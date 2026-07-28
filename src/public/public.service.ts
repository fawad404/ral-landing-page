import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from '../inquiries/schemas/inquiry.schema';
import { Facility, FacilityDocument, FacilityStatus } from '../facilities/schemas/facility.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';
import { PublicInquiryDto } from './dto/public-inquiry.dto';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
    @InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async submitInquiry(dto: PublicInquiryDto): Promise<InquiryDocument> {
    const inquiry = await this.inquiryModel.create(dto);

    await this.notificationsService.createForAllAdmins(
      NotificationType.NEW_INQUIRY,
      'New Public Inquiry',
      `New inquiry from ${dto.familyData.name} (${dto.familyData.email})`,
      {
        inquiryId: inquiry._id.toString(),
        familyName: dto.familyData.name,
        familyEmail: dto.familyData.email,
      },
    );

    return inquiry;
  }

  async searchFacilities(params: {
    zipCode?: string;
    services?: string;
    budgetMin?: number;
    budgetMax?: number;
    limit?: number;
  }) {
    const query: Record<string, any> = {
      status: FacilityStatus.APPROVED,
      isVisible: true,
      availabilityCount: { $gt: 0 },
    };

    if (params.zipCode) {
      query['address.zipCode'] = params.zipCode;
    }

    if (params.services) {
      const serviceList = params.services.split(',').map((s) => s.trim());
      query.services = { $in: serviceList };
    }

    if (params.budgetMin !== undefined || params.budgetMax !== undefined) {
      query['pricing.min'] = {};
      if (params.budgetMin !== undefined) {
        query['pricing.min'].$gte = params.budgetMin;
      }
      if (params.budgetMax !== undefined) {
        query['pricing.max'] = { $lte: params.budgetMax };
      }
    }

    const limit = Math.min(params.limit ?? 10, 50);

    return this.facilityModel
      .find(query)
      .select('-ownerId')
      .limit(limit)
      .sort({ availabilityCount: -1, createdAt: -1 })
      .exec();
  }
}
