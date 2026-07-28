import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchema } from './schemas/facility.schema';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Facility.name, schema: FacilitySchema }]),
    NotificationsModule,
  ],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  exports: [FacilitiesService, MongooseModule],
})
export class FacilitiesModule {}
