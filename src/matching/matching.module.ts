import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { FacilitiesModule } from '../facilities/facilities.module';
import { InquiriesModule } from '../inquiries/inquiries.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [FacilitiesModule, InquiriesModule, AdminModule],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
