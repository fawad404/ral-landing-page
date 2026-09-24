import { HttpException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Source, SourceDocument, SourcePriority, SourceType, TrustLevel } from './schemas/source.schema';
import { ContentItem, ContentItemDocument, ContentStatus } from './schemas/content-item.schema';
import { ScanLog, ScanLogDocument } from './schemas/scan-log.schema';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { QueryContentDto } from './dto/query-content.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';
import { QueryScanLogDto } from './dto/query-scan-log.dto';
import { FeedIngestionService } from './feed-ingestion.service';
import { AiProcessingError } from './ai-processing.service';
import { CATEGORIES } from './categories';

export { CATEGORIES };

const DEFAULT_SOURCES = [
  // ── Core government / official sources ────────────────────────────────────
  {
    name: 'ADHS Newsroom',
    rssUrl: 'https://news.google.com/rss/search?q=%22Arizona+Department+of+Health%22+%22assisted+living%22+OR+%22long-term+care%22+OR+licensing+OR+%22care+facility%22',
    websiteUrl: 'https://www.azdhs.gov/news/index.php',
    type: SourceType.RSS,
    priority: SourcePriority.CRITICAL,
    trustLevel: TrustLevel.HIGH,
    categories: ['Compliance & Regulatory', 'Arizona Regulations'],
    description: 'Arizona Department of Health Services — regulations, licensing, policy (via Google News)',
  },
  {
    name: "McKnight's Senior Living",
    rssUrl: 'https://news.google.com/rss/search?q=site%3Amcknightsseniorliving.com',
    websiteUrl: 'https://www.mcknightsseniorliving.com',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.HIGH,
    categories: ['Industry News & Operations', 'Staffing & Caregiver News'],
    description: 'Daily senior living news, staffing, operations, regulatory changes (via Google News)',
  },
  {
    name: 'Senior Housing News',
    rssUrl: 'https://seniorhousingnews.com/feed/',
    websiteUrl: 'https://seniorhousingnews.com',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.HIGH,
    categories: ['Market Trends', 'Industry News & Operations'],
    description: 'Investment, operations, and trends in senior housing',
  },
  {
    name: 'CMS Newsroom',
    rssUrl: 'https://news.google.com/rss/search?q=site%3Acms.gov+%22assisted+living%22+OR+%22long-term+care%22+OR+Medicaid+OR+Medicare',
    websiteUrl: 'https://www.cms.gov/newsroom',
    type: SourceType.RSS,
    priority: SourcePriority.CRITICAL,
    trustLevel: TrustLevel.HIGH,
    categories: ['Compliance & Regulatory', 'Law / Policy / ALTCS Updates'],
    description: 'Centers for Medicare & Medicaid Services — Medicaid updates, federal policy (via Google News)',
  },
  {
    name: 'AHCA/NCAL',
    rssUrl: 'https://news.google.com/rss/search?q=%22AHCA%22+%22NCAL%22+%22assisted+living%22+OR+%22nursing+facility%22+OR+%22long-term+care%22',
    websiteUrl: 'https://www.ahcancal.org/News-and-Communications',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.HIGH,
    categories: ['Industry News & Operations', 'Compliance & Regulatory'],
    description: 'Assisted living trends, regulatory insights, operator-focused news (via Google News)',
  },
  {
    name: 'LeadingAge',
    rssUrl: 'https://news.google.com/rss/search?q=%22LeadingAge%22+%22senior+living%22+OR+%22aging+services%22+OR+%22long-term+care%22',
    websiteUrl: 'https://leadingage.org/news/',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.HIGH,
    categories: ['Law / Policy / ALTCS Updates', 'Industry News & Operations'],
    description: 'Policy, nonprofit, and aging services news (via Google News)',
  },
  {
    name: 'Google News — Assisted Living Arizona',
    rssUrl: 'https://news.google.com/rss/search?q=assisted+living+Arizona',
    websiteUrl: 'https://news.google.com',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Industry News & Operations'],
    description: 'Dynamic Google News feed for Arizona assisted living',
  },
  {
    name: 'Google News — Senior Living Regulations',
    rssUrl: 'https://news.google.com/rss/search?q=senior+living+regulations',
    websiteUrl: 'https://news.google.com',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Compliance & Regulatory'],
    description: 'Dynamic Google News feed for senior living regulations',
  },
  {
    name: 'Google News — Caregiver Shortage Arizona',
    rssUrl: 'https://news.google.com/rss/search?q=caregiver+shortage+Arizona',
    websiteUrl: 'https://news.google.com',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Staffing & Caregiver News'],
    description: 'Dynamic Google News feed for Arizona caregiver shortages',
  },
  // ── High-value regional / policy sources ───────────────────────────────────
  {
    name: 'AHCCCS / ALTCS News',
    rssUrl: 'https://news.google.com/rss/search?q=AHCCCS+ALTCS+Arizona+Medicaid',
    websiteUrl: 'https://www.azahcccs.gov',
    type: SourceType.RSS,
    priority: SourcePriority.CRITICAL,
    trustLevel: TrustLevel.HIGH,
    categories: ['ALTCS / Medicaid', 'Law / Policy / ALTCS Updates'],
    description: 'Arizona ALTCS and Medicaid updates via Google News (azahcccs.gov does not publish RSS)',
  },
  {
    name: 'Arizona Legislature — Senior Care Bills',
    rssUrl: 'https://news.google.com/rss/search?q=Arizona+legislature+%22assisted+living%22+OR+%22senior+care%22+OR+%22ALTCS%22+bill',
    websiteUrl: 'https://www.azleg.gov',
    type: SourceType.RSS,
    priority: SourcePriority.CRITICAL,
    trustLevel: TrustLevel.HIGH,
    categories: ['Law / Policy / ALTCS Updates', 'Arizona Regulations'],
    description: 'Arizona legislative activity affecting assisted living and senior care',
  },
  {
    name: 'Kaiser Family Foundation',
    rssUrl: 'https://www.kff.org/feed/',
    websiteUrl: 'https://www.kff.org',
    type: SourceType.RSS,
    priority: SourcePriority.MEDIUM,
    trustLevel: TrustLevel.HIGH,
    categories: ['Law / Policy / ALTCS Updates'],
    description: 'Policy and data insights',
  },
  {
    name: 'CDC Health Alerts',
    rssUrl: 'https://tools.cdc.gov/api/v2/resources/media/403372.rss',
    websiteUrl: 'https://www.cdc.gov',
    type: SourceType.RSS,
    priority: SourcePriority.MEDIUM,
    trustLevel: TrustLevel.HIGH,
    categories: ['Emergency & Safety Alerts'],
    description: 'CDC health alerts relevant to care facilities',
  },
  {
    name: 'Modern Healthcare',
    rssUrl: 'https://news.google.com/rss/search?q=site%3Amodernhealthcare.com+%22assisted+living%22+OR+%22senior+care%22+OR+%22long-term+care%22',
    websiteUrl: 'https://www.modernhealthcare.com',
    type: SourceType.RSS,
    priority: SourcePriority.MEDIUM,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Industry News & Operations'],
    description: 'Healthcare industry news (via Google News)',
  },
  // ── Local news ──────────────────────────────────────────────────────────
  {
    name: 'AZ Central',
    rssUrl: 'https://news.google.com/rss/search?q=site%3Aazcentral.com+%22assisted+living%22+OR+%22senior+care%22+OR+%22nursing+home%22+Arizona',
    websiteUrl: 'https://www.azcentral.com',
    type: SourceType.RSS,
    priority: SourcePriority.LOW,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Industry News & Operations'],
    description: 'Local Arizona news — senior stories, facility issues, community updates (via Google News)',
  },
  {
    name: 'Phoenix Business Journal',
    rssUrl: 'https://news.google.com/rss/search?q=site%3Abizjournals.com+phoenix+%22assisted+living%22+OR+%22senior+living%22+OR+%22senior+care%22',
    websiteUrl: 'https://www.bizjournals.com/phoenix',
    type: SourceType.RSS,
    priority: SourcePriority.LOW,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Market Trends'],
    description: 'Phoenix deals, developments, facility openings (via Google News)',
  },
  {
    name: '12 News Arizona',
    rssUrl: 'https://www.12news.com/feeds/syndication/rss/news',
    websiteUrl: 'https://www.12news.com',
    type: SourceType.RSS,
    priority: SourcePriority.LOW,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Industry News & Operations'],
    description: 'Local Arizona news',
  },
  {
    name: 'ABC15 Arizona',
    rssUrl: 'https://news.google.com/rss/search?q=site%3Aabc15.com+%22assisted+living%22+OR+%22senior+care%22+OR+%22nursing+home%22+Arizona',
    websiteUrl: 'https://www.abc15.com',
    type: SourceType.RSS,
    priority: SourcePriority.LOW,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Industry News & Operations'],
    description: 'Local Arizona news (via Google News)',
  },
  // ── Emergency & Safety (Phase 2 — Newsletter category) ───────────────────
  {
    name: 'NWS Phoenix Alerts',
    rssUrl: 'https://news.google.com/rss/search?q=%22National+Weather+Service%22+Arizona+%22heat+warning%22+OR+%22heat+advisory%22+OR+monsoon+OR+wildfire+OR+%22air+quality+alert%22',
    websiteUrl: 'https://www.weather.gov/psr',
    type: SourceType.RSS,
    priority: SourcePriority.HIGH,
    trustLevel: TrustLevel.HIGH,
    categories: ['Emergency & Safety Alerts'],
    description: 'National Weather Service Phoenix — heat warnings, monsoon alerts, extreme weather for Arizona (via Google News)',
  },
  {
    name: 'CDC Emergency Preparedness',
    rssUrl: 'https://tools.cdc.gov/api/v2/resources/media/403372.rss',
    websiteUrl: 'https://www.cdc.gov/phpr',
    type: SourceType.RSS,
    priority: SourcePriority.MEDIUM,
    trustLevel: TrustLevel.HIGH,
    categories: ['Emergency & Safety Alerts'],
    description: 'CDC emergency preparedness — flu outbreaks, COVID updates, infection control for care facilities',
  },
  {
    name: 'Google News — Arizona Heat Safety',
    rssUrl: 'https://news.google.com/rss/search?q=Arizona+heat+warning+OR+%22heat+advisory%22+senior+care',
    websiteUrl: 'https://news.google.com',
    type: SourceType.RSS,
    priority: SourcePriority.MEDIUM,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Emergency & Safety Alerts'],
    description: 'Google News feed for Arizona heat and safety alerts affecting senior care facilities',
  },
  {
    name: 'Google News — Arizona Wildfire Air Quality',
    rssUrl: 'https://news.google.com/rss/search?q=Arizona+wildfire+OR+%22air+quality%22+health+alert',
    websiteUrl: 'https://news.google.com',
    type: SourceType.RSS,
    priority: SourcePriority.MEDIUM,
    trustLevel: TrustLevel.MEDIUM,
    categories: ['Emergency & Safety Alerts'],
    description: 'Google News feed for Arizona wildfire and air quality alerts',
  },
];

@Injectable()
export class IntelligenceHubService implements OnModuleInit {
  constructor(
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
    @InjectModel(ContentItem.name) private contentItemModel: Model<ContentItemDocument>,
    @InjectModel(ScanLog.name) private scanLogModel: Model<ScanLogDocument>,
    private feedIngestionService: FeedIngestionService,
  ) {}

  async onModuleInit() {
    await this.seedSources();
  }

  private async seedSources() {
    const count = await this.sourceModel.countDocuments();
    if (count === 0) {
      await this.sourceModel.insertMany(DEFAULT_SOURCES);
      return;
    }

    // Re-activate original sources that were accidentally disabled
    const originalUrls = DEFAULT_SOURCES.map((s) => s.rssUrl);
    await this.sourceModel.updateMany(
      { rssUrl: { $in: originalUrls }, isActive: false },
      { $set: { isActive: true } },
    );

    // Add new default sources that don't exist in DB yet (e.g. AHCCCS RSS, AZ Legislature)
    for (const src of DEFAULT_SOURCES) {
      const exists = await this.sourceModel.findOne({ name: src.name }).lean();
      if (!exists) {
        await this.sourceModel.create(src);
      }
    }

    // Sync rssUrl for existing sources whose URL changed in DEFAULT_SOURCES
    for (const src of DEFAULT_SOURCES) {
      await this.sourceModel.updateOne(
        { name: src.name, rssUrl: { $ne: src.rssUrl } },
        { $set: { rssUrl: src.rssUrl, description: src.description } },
      );
    }

    // One-time cleanup: remove extra Google News sources that were accidentally added
    const extraUrls = [
      'https://news.google.com/rss/search?q=assisted+living+Arizona&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=senior+living+regulations+arizona&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=caregiver+shortage+Arizona&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=ALTCS+Medicaid+Arizona&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=%22assisted+living%22+compliance+licensing&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=%22memory+care%22+OR+%22dementia%22+%22assisted+living%22&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=Arizona+health+department+regulations+care+facility&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=%22senior+care%22+staffing+workforce&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=%22residential+assisted+living%22+OR+%22group+home%22+senior&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=Phoenix+Tucson+%22senior+living%22+OR+%22assisted+living%22&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=Arizona+%22elder+care%22+OR+%22nursing+home%22+OR+%22care+facility%22&hl=en-US&gl=US&ceid=US:en',
    ];
    await this.sourceModel.deleteMany({ rssUrl: { $in: extraUrls } });
  }

  // ─── CATEGORIES ───────────────────────────────────────────────────────────

  getCategories(): string[] {
    return CATEGORIES;
  }

  // ─── SOURCES ──────────────────────────────────────────────────────────────

  private static readonly PRIORITY_RANK: Record<SourcePriority, number> = {
    [SourcePriority.CRITICAL]: 0,
    [SourcePriority.HIGH]: 1,
    [SourcePriority.MEDIUM]: 2,
    [SourcePriority.LOW]: 3,
  };

  async getSources() {
    const sources = await this.sourceModel.find().exec();
    return sources.sort((a, b) => {
      const rankDiff =
        IntelligenceHubService.PRIORITY_RANK[a.priority] - IntelligenceHubService.PRIORITY_RANK[b.priority];
      return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
    });
  }

  createSource(dto: CreateSourceDto): Promise<SourceDocument> {
    return this.sourceModel.create(dto);
  }

  async updateSource(id: string, dto: UpdateSourceDto): Promise<SourceDocument> {
    const source = await this.sourceModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!source) throw new NotFoundException('Source not found');
    return source;
  }

  async deleteSource(id: string): Promise<void> {
    const result = await this.sourceModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Source not found');
  }

  // ─── CONTENT ITEMS ────────────────────────────────────────────────────────

  // Owner "Arizona Updates" page: admin-approved items only, trimmed to the
  // fields an owner needs.
  async getOwnerUpdates(page = 1, limit = 20) {
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const skip = (Math.max(page, 1) - 1) * safeLimit;
    const filter = {
      status: { $in: [ContentStatus.APPROVED, ContentStatus.SCHEDULED, ContentStatus.PUBLISHED] },
    };
    const [items, total] = await Promise.all([
      this.contentItemModel
        .find(filter)
        .select(
          'aiHeadline originalTitle aiSummary aiWhatThisMeans aiWhoIsAffected aiOperatorTakeaway ' +
            'articleUrl sourceName category urgency isArizonaSpecific originalPublishDate publishedAt createdAt',
        )
        .sort({ publishedAt: -1, originalPublishDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.contentItemModel.countDocuments(filter),
    ]);
    return { items, total, page: Math.max(page, 1), limit: safeLimit };
  }

  async getContentItems(query: QueryContentDto) {
    const filter: Record<string, any> = {};

    if (query.search) filter.$text = { $search: query.search };
    if (query.category) filter.category = query.category;
    if (query.sourceName) filter.sourceName = { $regex: query.sourceName, $options: 'i' };
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.changeType) filter.changeType = query.changeType;
    if (query.urgency) filter.urgency = query.urgency;
    if (query.riskLevel) filter.riskLevel = query.riskLevel;
    if (query.opportunityLevel) filter.opportunityLevel = query.opportunityLevel;
    if (query.approved !== undefined) filter.approved = query.approved;
    if (query.reviewed !== undefined) filter.reviewed = query.reviewed;
    if (query.readyToPost !== undefined) filter.readyToPost = query.readyToPost;

    if (query.dateFrom || query.dateTo) {
      filter.importedAt = {};
      if (query.dateFrom) filter.importedAt.$gte = new Date(query.dateFrom);
      if (query.dateTo) filter.importedAt.$lte = new Date(query.dateTo);
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.contentItemModel.find(filter).sort({ importedAt: -1 }).skip(skip).limit(limit).exec(),
      this.contentItemModel.countDocuments(filter).exec(),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getContentItemById(id: string): Promise<ContentItemDocument> {
    const item = await this.contentItemModel.findById(id).exec();
    if (!item) throw new NotFoundException('Content item not found');
    return item;
  }

  async updateContentItem(
    id: string,
    dto: UpdateContentItemDto,
    editedBy?: string,
  ): Promise<ContentItemDocument> {
    const updateData: Record<string, any> = { ...dto };

    if (editedBy) {
      updateData.editedBy = editedBy;
      updateData.editedAt = new Date();
    }

    // Auto-set scheduledFor to now when scheduling (if no date provided by caller)
    if (dto.status === ContentStatus.SCHEDULED && !dto.scheduledFor) {
      updateData.scheduledFor = new Date();
    }

    // Convert scheduledFor string → Date if provided
    if (dto.scheduledFor) {
      updateData.scheduledFor = new Date(dto.scheduledFor);
    }

    // Auto-set publishedAt to now when marking as published
    if (dto.status === ContentStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    const item = await this.contentItemModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
    if (!item) throw new NotFoundException('Content item not found');
    return item;
  }

  async deleteContentItem(id: string): Promise<void> {
    const result = await this.contentItemModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Content item not found');
  }

  async reprocessItem(id: string): Promise<ContentItemDocument> {
    const item = await this.contentItemModel.findById(id).exec();
    if (!item) throw new NotFoundException('Content item not found');

    try {
      await this.feedIngestionService.processItemWithAI(
        id,
        item.originalTitle,
        item.originalContent || item.originalExcerpt || '',
        item.sourceName,
        item.originalPublishDate?.toISOString() ?? new Date().toISOString(),
        true, // throwOnError — surface AI errors to the user
      );
    } catch (err) {
      if (err instanceof AiProcessingError) {
        throw new HttpException(
          { message: err.message, code: err.code },
          err.httpStatus,
        );
      }
      throw new HttpException(
        { message: 'AI processing failed due to an unexpected error.', code: 'unknown_error' },
        500,
      );
    }

    return this.contentItemModel.findById(id).exec() as Promise<ContentItemDocument>;
  }

  // ─── MANUAL INGEST ────────────────────────────────────────────────────────

  triggerIngest() {
    return this.feedIngestionService.ingestAll();
  }

  // ─── SCAN LOGS ────────────────────────────────────────────────────────────

  async getScanLogs(query: QueryScanLogDto) {
    const filter: Record<string, any> = {};

    if (query.sourceId) filter.sourceId = query.sourceId;
    if (query.outcome) filter.outcome = query.outcome;

    if (query.dateFrom || query.dateTo) {
      filter.scannedAt = {};
      if (query.dateFrom) filter.scannedAt.$gte = new Date(query.dateFrom);
      if (query.dateTo) filter.scannedAt.$lte = new Date(query.dateTo);
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 200);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.scanLogModel.find(filter).sort({ scannedAt: -1 }).skip(skip).limit(limit).exec(),
      this.scanLogModel.countDocuments(filter).exec(),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── STATS ────────────────────────────────────────────────────────────────

  async getStats() {
    const [total, newItems, pendingReview, processing, approved, rejected, readyToPost, scheduled, published, archived] =
      await Promise.all([
        this.contentItemModel.countDocuments(),
        // "New" = items just imported (new pipeline) + legacy pending items that haven't been processed yet
        this.contentItemModel.countDocuments({ status: { $in: [ContentStatus.NEW, ContentStatus.PENDING] } }),
        // "Pending Review" = AI done, awaiting admin (new pipeline) + legacy processed items
        this.contentItemModel.countDocuments({ status: { $in: [ContentStatus.PENDING_REVIEW, ContentStatus.PROCESSED] } }),
        this.contentItemModel.countDocuments({ status: ContentStatus.PROCESSING }),
        this.contentItemModel.countDocuments({ approved: true }),
        this.contentItemModel.countDocuments({ status: ContentStatus.REJECTED }),
        this.contentItemModel.countDocuments({ readyToPost: true }),
        this.contentItemModel.countDocuments({ status: ContentStatus.SCHEDULED }),
        this.contentItemModel.countDocuments({ status: ContentStatus.PUBLISHED }),
        this.contentItemModel.countDocuments({ status: ContentStatus.ARCHIVED }),
      ]);

    return { total, newItems, pendingReview, processing, approved, rejected, readyToPost, scheduled, published, archived };
  }
}
