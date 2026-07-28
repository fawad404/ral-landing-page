import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { APIError } from 'openai';

export interface AiOutput {
  headline: string;
  summary: string;
  what_this_means: string;
  operator_takeaway: string;
  facebook_post: string;
  email_blurb: string;
  relevance_score: number;
}

export class AiProcessingError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly httpStatus: number,
  ) {
    super(message);
    this.name = 'AiProcessingError';
  }
}

function resolveOpenAiError(err: unknown): AiProcessingError {
  if (err instanceof APIError) {
    const code = (err.error as any)?.code ?? err.code ?? '';
    const type = (err.error as any)?.type ?? '';

    if (err.status === 401) {
      return new AiProcessingError(
        'Invalid OpenAI API key. Check OPENAI_API_KEY in your .env file.',
        'invalid_api_key',
        401,
      );
    }

    if (err.status === 429) {
      if (code === 'insufficient_quota' || type === 'insufficient_quota') {
        return new AiProcessingError(
          'Your OpenAI account has no credits. Go to platform.openai.com/settings/billing and add credits to continue.',
          'insufficient_quota',
          402,
        );
      }
      return new AiProcessingError(
        'OpenAI rate limit exceeded. Please wait a moment and try again.',
        'rate_limit_exceeded',
        429,
      );
    }

    if (err.status === 500 || err.status === 503) {
      return new AiProcessingError(
        'OpenAI service is temporarily unavailable. Try again in a few minutes.',
        'openai_server_error',
        503,
      );
    }

    return new AiProcessingError(
      err.message ?? 'OpenAI API error.',
      code || 'openai_error',
      err.status ?? 500,
    );
  }

  return new AiProcessingError(
    'AI processing failed due to an unexpected error.',
    'unknown_error',
    500,
  );
}

@Injectable()
export class AiProcessingService {
  private readonly logger = new Logger(AiProcessingService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('openai.apiKey') ?? '',
    });
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html
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

  /**
   * Processes an article through OpenAI.
   * Throws AiProcessingError on API-level failures (no credits, bad key, etc.)
   * Returns null only on parse/unexpected errors.
   */
  async processArticle(
    title: string,
    content: string,
    source: string,
    date: string,
  ): Promise<AiOutput> {
    const cleanTitle = this.stripHtml(title);
    const cleanContent = this.stripHtml(content);

    const systemPrompt = `You are a seasoned Arizona assisted living operator who also happens to be great at explaining things clearly.
You have run facilities, dealt with ADHS inspections, navigated ALTCS/Medicaid, and managed caregivers.
Your job is NOT to summarize news — it is to TRANSLATE it. Take complex regulatory, legislative, or industry news and rewrite it in plain language that a busy facility owner can understand in 30 seconds.
Tone: Direct, conversational, zero corporate jargon. Write like you are texting a colleague who owns a facility.
Never say "it is important to note", "stakeholders", "pursuant to", or any bureaucratic language.
If something does not directly affect Arizona ALF owners, say so briefly and move on.
Arizona context is critical — always connect federal or national news back to what it means specifically for Arizona operators.`;

    const userPrompt = `You are translating this article for Arizona assisted living owners. Ask yourself:
- If I owned a 10-bed ALF in Phoenix, what would I actually DO differently after reading this?
- Does this affect my license, my staff, my residents, my ALTCS reimbursements, or my costs?
- What is the single most important thing an operator needs to know?

Write with that lens. Do NOT produce a generic news summary.

ARTICLE TITLE:
${cleanTitle}

ARTICLE CONTENT:
${cleanContent.substring(0, 4000)}

SOURCE:
${source}

DATE:
${date}

---
Return ONLY valid JSON with exactly these fields:
{
  "headline": "Plain-English headline written for a facility owner, not a journalist. Make it specific and useful.",
  "summary": "2-3 sentences in plain English. No jargon. Write like you are explaining this to a friend who owns a facility. Focus on the single most important point.",
  "what_this_means": "Translate this into real-world impact for an Arizona ALF owner. Be specific: does this affect compliance deadlines, staffing ratios, ALTCS billing, inspection criteria, or resident care? If it does not apply to Arizona, say so clearly.",
  "operator_takeaway": "One concrete action or thing to watch. Start with a verb. Example: 'Review your medication documentation before your next ADHS inspection.' If no action is needed, say why.",
  "facebook_post": "Write a post for an Arizona assisted living Facebook group. Start with a hook that makes operators stop scrolling. Explain what happened in plain English. Say why it matters to them. End with a question to spark comments. Conversational, not corporate. No hashtags. 150-250 words.",
  "email_blurb": "2-3 sentences for an email newsletter. Plain language. Mention Arizona if relevant. End with one clear takeaway.",
  "relevance_score": <integer 1-10: 10 = directly affects Arizona ALF compliance or operations today, 1 = completely unrelated>
}`;

    let response: OpenAI.Chat.ChatCompletion;

    try {
      response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });
    } catch (err) {
      // Rethrow as typed AiProcessingError so callers can handle appropriately
      throw resolveOpenAiError(err);
    }

    const rawOutput = response.choices[0]?.message?.content;
    if (!rawOutput) {
      throw new AiProcessingError('OpenAI returned an empty response.', 'empty_response', 500);
    }

    try {
      return JSON.parse(rawOutput) as AiOutput;
    } catch {
      throw new AiProcessingError('OpenAI response could not be parsed.', 'parse_error', 500);
    }
  }
}
