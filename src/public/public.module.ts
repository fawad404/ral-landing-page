import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inquiry, InquirySchema } from '../inquiries/schemas/inquiry.schema';
import { Facility, FacilitySchema } from '../facilities/schemas/facility.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inquiry.name, schema: InquirySchema },
      { name: Facility.name, schema: FacilitySchema },
    ]),
    NotificationsModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
