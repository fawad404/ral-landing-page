import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import * as https from 'https';
import * as http from 'http';
import Parser from 'rss-parser';
import { Source, SourceDocument, SourceType } from './schemas/source.schema';
import {
  ContentItem,
  ContentItemDocument,
  ContentStatus,
  PriorityLevel,
} from './schemas/content-item.schema';
import { AiProcessingService, AiProcessingError } from './ai-processing.service';

const RELEVANT_KEYWORDS = [
  'assisted living',
  'senior living',
  'long term care',
  'long-term care',
  'caregiver',
  'memory care',
  'medicaid',
  'altcs',
  'nursing facility',
  'nursing home',
  'elder care',
  'senior care',
  'residential care',
  'adult care home',
  'board and care',
];

const ARIZONA_KEYWORDS = [
  'arizona',
  ' az ',
  'phoenix',
  'tucson',
  'scottsdale',
  'mesa',
  'tempe',
  'chandler',
  'gilbert',
  'glendale',
  'peoria',
  'flagstaff',
  'adhs',
  'ahcccs',
  'altcs',
  'azleg',
  'az legislature',
  'arizona legislature',
  'arizona department of health',
];

// Sources whose content is automatically CRITICAL priority (regulatory/legislative)
const CRITICAL_SOURCE_KEYWORDS = [
  'adhs',
  'ahcccs',
  'altcs',
  'arizona legislature',
  'azleg',
  'arizona department of health',
  'cms newsroom',
  'centers for medicare',
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  // ── Original categories ───────────────────────────────────────────────────
  'Arizona Regulations': ['adhs', 'arizona department of health', 'azleg', 'arizona regulation', 'arizona law'],
  'Compliance & Licensing': ['compliance', 'licensing', 'license', 'inspection', 'survey', 'violation', 'deficiency', 'citation'],
  'ALTCS / Medicaid': ['altcs', 'medicaid', 'ahcccs', 'reimbursement', 'long-term care funding', 'waiver'],
  'Staffing & Caregivers': ['staffing', 'caregiver', 'workforce', 'staff shortage', 'hiring', 'nurse', 'cna', 'turnover', 'direct care'],
  'Memory Care': ['memory care', 'dementia', 'alzheimer', 'cognitive decline', 'memory unit'],
  'Risk / Legal / Liability': ['lawsuit', 'liability', 'settlement', 'negligence', 'abuse', 'neglect', 'legal action', 'litigation'],
  'Market Trends': ['market', 'investment', 'acquisition', 'occupancy', 'census', 'trend', 'growth'],
  'Residential Assisted Living': ['residential assisted living', 'ral ', 'group home', 'board and care', 'adult foster'],
  'Manager Insights': ['manager', 'management', 'administrator', 'leadership', 'best practice', 'operations tip'],
  'Assisted Living Operations': ['operations', 'facility management', 'resident care', 'care plan', 'admission'],
  // ── Newsletter aggregator categories (Phase 2) ────────────────────────────
  'Compliance & Regulatory': ['adhs', 'compliance', 'licensing', 'license', 'inspection', 'survey', 'violation', 'citation', 'emergency order', 'regulatory', 'arizona department of health', 'azleg', 'arizona regulation'],
  'Staffing & Caregiver News': ['staffing', 'caregiver', 'cna', 'workforce', 'hiring', 'staff shortage', 'wage', 'turnover', 'direct care worker', 'healthcare staffing', 'caregiver shortage'],
  'Industry News & Operations': ['assisted living', 'senior living', 'senior care', 'occupancy', 'operations', 'facility management', 'resident care', 'care plan', 'senior housing', 'memory care', 'market trend'],
  'Emergency & Safety Alerts': ['heat warning', 'heat advisory', 'wildfire', 'air quality', 'flu outbreak', 'covid', 'infection control', 'emergency alert', 'monsoon', 'extreme heat', 'public health emergency'],
  'Law / Policy / ALTCS Updates': ['altcs', 'medicaid', 'ahcccs', 'legislation', 'bill', 'law', 'policy', 'reimbursement', 'arizona legislature', 'medicaid change', 'waiver', 'cms rule'],
};

@Injectable()
export class FeedIngestionService {
  private readonly logger = new Logger(FeedIngestionService.name);
  private readonly parser = new Parser({
    timeout: 20000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    },
    customFields: { item: [['content:encoded', 'contentEncoded']] },
  });

  constructor(
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
    @InjectModel(ContentItem.name) private contentItemModel: Model<ContentItemDocument>,
    private aiService: AiProcessingService,
  ) {}

  // Every 2 hours
  @Cron('0 */2 * * *')
  async scheduledIngestion() {
    this.logger.log('Starting scheduled feed ingestion...');
    await this.ingestAll();
  }

  async ingestAll(): Promise<{
    imported: number;
    alreadyExists: number;
    notRelevant: number;
    skipped: number;
    errors: number;
    failedSources: string[];
  }> {
    const sources = await this.sourceModel.find({ isActive: true }).exec();
    const rssSources = sources.filter((s) => s.type === SourceType.RSS);
    const skippedNonRss = sources.length - rssSources.length;
    if (skippedNonRss > 0) {
      this.logger.log(`Skipping ${skippedNonRss} non-RSS source(s)`);
    }

    // Process sources in parallel batches of 5.
    // All-at-once parallelism causes rss2json rate-limit (10 req/min free tier)
    // when many sources fall through to that third-layer proxy simultaneously.
    const BATCH_SIZE = 5;
    let imported = 0;
    let alreadyExists = 0;
    let notRelevant = 0;
    let errors = 0;
    const failedSources: string[] = [];

    for (let i = 0; i < rssSources.length; i += BATCH_SIZE) {
      const batch = rssSources.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((source) => this.ingestSource(source)));

      results.forEach((result, j) => {
        const source = batch[j];
        if (result.status === 'fulfilled') {
          imported += result.value.imported;
          alreadyExists += result.value.alreadyExists;
          notRelevant += result.value.notRelevant;
        } else {
          const message = result.reason instanceof Error ? result.reason.message : String(result.reason);
          this.logger.error(`Failed to ingest source: ${source.name} — ${message}`);
          failedSources.push(`${source.name}: ${message.slice(0, 120)}`);
          errors++;
        }
      });
    }

    const skipped = alreadyExists + notRelevant;
    this.logger.log(
      `Ingestion complete. Imported: ${imported}, Already exists: ${alreadyExists}, Not relevant: ${notRelevant}, Errors: ${errors}`,
    );
    return { imported, alreadyExists, notRelevant, skipped, errors, failedSources };
  }

  private readonly PROXY_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };

  /**
   * Fetch an RSS feed with three-layer fallback:
   *   1. Direct fetch via rss-parser
   *   2. ProxyShare residential proxy via axios (bypasses Cloudflare & paywalled feeds)
   *   3. rss2json.com public API (handles HTTP/2 gov sites like alerts.weather.gov)
   */
  private async fetchFeed(rssUrl: string): Promise<Parser.Output<Record<string, any>>> {
    // 1. Direct fetch
    try {
      return await this.parser.parseURL(rssUrl);
    } catch (directErr) {
      const msg = directErr instanceof Error ? directErr.message : String(directErr);
      this.logger.warn(`Direct fetch failed for ${rssUrl} (${msg}) — trying ProxyShare residential proxy`);
    }

    // 2. ProxyShare residential proxy via axios
    const host = process.env.PROXY_HOST;
    const port = process.env.PROXY_PORT;
    const username = process.env.PROXY_USERNAME;
    const password = process.env.PROXY_PASSWORD;

    if (host && port && username && password) {
      try {
        const response = await axios.get<string>(rssUrl, {
          proxy: {
            protocol: 'http',
            host,
            port: Number(port),
            auth: { username, password },
          },
          httpsAgent: new https.Agent({ insecureHTTPParser: true } as any),
          httpAgent: new http.Agent({ insecureHTTPParser: true } as any),
          timeout: 30000,
          responseType: 'text',
          headers: this.PROXY_HEADERS,
          maxRedirects: 10,
        });

        const xml = response.data;
        if (xml?.trim()) {
          return await this.parser.parseString(xml);
        }
      } catch (proxyErr) {
        const msg = proxyErr instanceof Error ? proxyErr.message : String(proxyErr);
        this.logger.warn(`ProxyShare failed for ${rssUrl} (${msg}) — trying rss2json fallback`);
      }
    }

    // 3. rss2json.com public API — handles HTTP/2 servers that break Node's HTTP/1.1 parser
    try {
      const resp = await axios.get<any>('https://api.rss2json.com/v1/api.json', {
        params: { rss_url: rssUrl },
        timeout: 30000,
      });

      if (resp.data?.status !== 'ok') {
        throw new Error(resp.data?.message ?? 'rss2json returned non-ok status');
      }

      return {
        title: resp.data.feed?.title ?? '',
        items: (resp.data.items ?? []).map((i: any) => ({
          title: i.title ?? '',
          link: i.link ?? '',
          guid: i.guid ?? i.link ?? '',
          pubDate: i.pubDate ?? '',
          contentSnippet: i.description ?? '',
          content: i.content ?? i.description ?? '',
        })),
      };
    } catch (rss2jsonErr) {
      const msg = rss2jsonErr instanceof Error ? rss2jsonErr.message : String(rss2jsonErr);
      throw new Error(`All fetch attempts failed for ${rssUrl}. Final error: ${msg}`);
    }
  }

  async ingestSource(source: SourceDocument): Promise<{ imported: number; alreadyExists: number; notRelevant: number }> {
    let imported = 0;
    let alreadyExists = 0;
    let notRelevant = 0;

    const feed = await this.fetchFeed(source.rssUrl);
    await this.sourceModel.findByIdAndUpdate(source._id, { lastFetchedAt: new Date() });

    // Only import articles published within the last 30 days
    const CUTOFF_DATE = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    for (const item of feed.items ?? []) {
      const articleUrl = item.link ?? item.guid ?? '';
      if (!articleUrl) { notRelevant++; continue; }

      const exists = await this.contentItemModel.findOne({ articleUrl }).lean().exec();
      if (exists) { alreadyExists++; continue; }

      const title = this.stripHtml(item.title ?? '');
      const excerpt = this.stripHtml(item.contentSnippet ?? item.summary ?? '');
      const content = this.stripHtml((item as any).contentEncoded ?? item.content ?? excerpt);
      const publishDate = item.pubDate ? new Date(item.pubDate) : new Date();

      // Skip unparseable or future-dated items
      if (isNaN(publishDate.getTime())) { notRelevant++; continue; }

      // Skip articles older than 30 days
      if (publishDate < CUTOFF_DATE) { notRelevant++; continue; }

      const searchText = `${title} ${excerpt}`.toLowerCase();
      const isRelevant = RELEVANT_KEYWORDS.some((kw) => searchText.includes(kw));
      if (!isRelevant) { notRelevant++; continue; }

      const isArizonaSpecific = ARIZONA_KEYWORDS.some((kw) => searchText.includes(kw));
      const category = this.autoCategory(searchText);
      const sourceNameLower = source.name.toLowerCase();
      const isCriticalSource = CRITICAL_SOURCE_KEYWORDS.some((kw) => sourceNameLower.includes(kw) || searchText.includes(kw));
      const priority = isCriticalSource
        ? PriorityLevel.CRITICAL
        : isArizonaSpecific
        ? PriorityLevel.HIGH
        : PriorityLevel.NORMAL;

      try {
        const newItem = await this.contentItemModel.create({
          sourceName: source.name,
          sourceUrl: source.websiteUrl ?? source.rssUrl,
          articleUrl,
          originalTitle: title,
          originalExcerpt: excerpt,
          originalContent: content,
          originalPublishDate: publishDate,
          importedAt: new Date(),
          category,
          status: ContentStatus.NEW,
          isArizonaSpecific,
          priority,
        });

        await this.processItemWithAI(
          newItem._id.toString(),
          title,
          content || excerpt,
          source.name,
          publishDate.toISOString(),
        );

        imported++;
      } catch (err: any) {
        if (err?.code === 11000) {
          alreadyExists++;
        } else {
          this.logger.error(`Error saving item from ${source.name}: ${err}`);
          notRelevant++;
        }
      }
    }

    return { imported, alreadyExists, notRelevant };
  }

  /**
   * Processes an item with AI.
   * - When called from the cron job: errors are swallowed (logged only).
   * - When called from a user action (reprocess): pass throwOnError=true so
   *   the caller can surface the error message to the frontend.
   */
  async processItemWithAI(
    itemId: string,
    title: string,
    content: string,
    source: string,
    date: string,
    throwOnError = false,
  ): Promise<void> {
    await this.contentItemModel.findByIdAndUpdate(itemId, { status: ContentStatus.PROCESSING });

    try {
      const aiOutput = await this.aiService.processArticle(title, content, source, date);

      await this.contentItemModel.findByIdAndUpdate(itemId, {
        status: ContentStatus.PENDING_REVIEW,
        aiHeadline: aiOutput.headline,
        aiSummary: aiOutput.summary,
        aiWhatThisMeans: aiOutput.what_this_means,
        aiOperatorTakeaway: aiOutput.operator_takeaway,
        aiFacebookPost: aiOutput.facebook_post,
        aiEmailBlurb: aiOutput.email_blurb,
        aiRelevanceScore: aiOutput.relevance_score,
      });
    } catch (err) {
      await this.contentItemModel.findByIdAndUpdate(itemId, { status: ContentStatus.NEW });

      if (err instanceof AiProcessingError) {
        this.logger.warn(`AI processing error for item ${itemId} [${err.code}]: ${err.message}`);
        if (throwOnError) throw err;
      } else {
        this.logger.error(`Unexpected error for item ${itemId}: ${err}`);
        if (throwOnError) throw err;
      }
    }
  }

  private stripHtml(html: any): string {
    if (!html) return '';
    // rss2json may return objects/arrays for content fields — coerce to string
    const str = typeof html === 'string' ? html : JSON.stringify(html);
    return str
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private autoCategory(text: string): string {
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        return category;
      }
    }
    return 'Senior Care Industry News';
  }
}
