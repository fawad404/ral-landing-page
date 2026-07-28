import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Facility, FacilitySchema } from '../facilities/schemas/facility.schema';
import { Inquiry, InquirySchema } from '../inquiries/schemas/inquiry.schema';
import { Partner, PartnerSchema } from '../partners/schemas/partner.schema';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Facility.name, schema: FacilitySchema },
      { name: Inquiry.name, schema: InquirySchema },
      { name: Partner.name, schema: PartnerSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
