import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { FeedIngestionService } from '../intelligence-hub/feed-ingestion.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CronSecretGuard } from './cron-secret.guard';

@ApiExcludeController()
@UseGuards(CronSecretGuard)
@Controller('cron')
export class CronController {
  constructor(
    private readonly feedIngestionService: FeedIngestionService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Respects each source's scanFrequencyHours, same as the in-process @Cron.
  @Post('ingest')
  @HttpCode(200)
  ingest() {
    return this.feedIngestionService.ingestAll(true);
  }

  @Post('facility-inactivity')
  @HttpCode(200)
  async facilityInactivity() {
    await this.notificationsService.checkFacilityInactivity();
    return { ok: true };
  }
}
