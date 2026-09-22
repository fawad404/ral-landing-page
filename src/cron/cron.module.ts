import { Module } from '@nestjs/common';
import { IntelligenceHubModule } from '../intelligence-hub/intelligence-hub.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CronController } from './cron.controller';
import { CronSecretGuard } from './cron-secret.guard';

@Module({
  imports: [IntelligenceHubModule, NotificationsModule],
  controllers: [CronController],
  providers: [CronSecretGuard],
})
export class CronModule {}
