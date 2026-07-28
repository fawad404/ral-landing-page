import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoInquiry, DemoInquirySchema } from './schemas/demo-inquiry.schema';
import { DemoInquiriesController } from './demo-inquiries.controller';
import { DemoInquiriesService } from './demo-inquiries.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DemoInquiry.name, schema: DemoInquirySchema },
    ]),
    NotificationsModule,
  ],
  controllers: [DemoInquiriesController],
  providers: [DemoInquiriesService],
})
export class DemoInquiriesModule {}
