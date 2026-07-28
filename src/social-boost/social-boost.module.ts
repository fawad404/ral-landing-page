import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialBoost, SocialBoostSchema } from './schemas/social-boost.schema';
import { SocialBoostService } from './social-boost.service';
import { SocialBoostController } from './social-boost.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { FacilitiesModule } from '../facilities/facilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocialBoost.name, schema: SocialBoostSchema }]),
    NotificationsModule,
    FacilitiesModule,
  ],
  controllers: [SocialBoostController],
  providers: [SocialBoostService],
})
export class SocialBoostModule {}
