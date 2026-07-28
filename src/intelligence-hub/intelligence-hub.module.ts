import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntelligenceHubController } from './intelligence-hub.controller';
import { IntelligenceHubService } from './intelligence-hub.service';
import { FeedIngestionService } from './feed-ingestion.service';
import { AiProcessingService } from './ai-processing.service';
import { Source, SourceSchema } from './schemas/source.schema';
import { ContentItem, ContentItemSchema } from './schemas/content-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Source.name, schema: SourceSchema },
      { name: ContentItem.name, schema: ContentItemSchema },
    ]),
  ],
  controllers: [IntelligenceHubController],
  providers: [IntelligenceHubService, FeedIngestionService, AiProcessingService],
})
export class IntelligenceHubModule {}
