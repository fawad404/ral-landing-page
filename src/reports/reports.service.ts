import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  Facility,
  FacilityDocument,
  FacilityStatus,
} from '../facilities/schemas/facility.schema';
import { Inquiry, InquiryDocument, InquiryStatus } from '../inquiries/schemas/inquiry.schema';
import { Partner, PartnerDocument } from '../partners/schemas/partner.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
    @InjectModel(Partner.name) private partnerModel: Model<PartnerDocument>,
  ) {}

  async getDashboard() {
    const [
      totalUsers,
      totalFacilities,
      activeFacilities,
      inactiveFacilities,
      pendingFacilities,
      flaggedFacilities,
      totalInquiries,
      inquiriesByStatus,
      totalPartners,
      visiblePartners,
      recentInquiries,
    ] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.facilityModel.countDocuments().exec(),
      this.facilityModel.countDocuments({ status: FacilityStatus.APPROVED, isVisible: true }).exec(),
      this.facilityModel.countDocuments({ isVisible: false }).exec(),
      this.facilityModel.countDocuments({ status: FacilityStatus.PENDING }).exec(),
      this.facilityModel.countDocuments({ isFlagged: true }).exec(),
      this.inquiryModel.countDocuments().exec(),
      this.inquiryModel
        .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
        .exec(),
      this.partnerModel.countDocuments().exec(),
      this.partnerModel.countDocuments({ isVisible: true }).exec(),
      this.inquiryModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('familyData.name familyData.email status createdAt')
        .exec(),
    ]);

    const inquiryStatusMap: Record<string, number> = {};
    inquiriesByStatus.forEach((item: any) => {
      inquiryStatusMap[item._id] = item.count;
    });

    return {
      summary: {
        totalUsers,
        totalFacilities,
        activeFacilities,
        inactiveFacilities,
        pendingFacilities,
        flaggedFacilities,
        totalInquiries,
        totalPartners,
        visiblePartners,
      },
      inquiriesByStatus: inquiryStatusMap,
      recentInquiries,
    };
  }

  async getFacilityStats() {
    const [byStatus, byService, flagged, avgAvailability] = await Promise.all([
      this.facilityModel
        .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
        .exec(),
      this.facilityModel
        .aggregate([
          { $unwind: '$services' },
          { $group: { _id: '$services', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ])
        .exec(),
      this.facilityModel
        .find({ isFlagged: true })
        .select('name address lastUpdated')
        .limit(20)
        .exec(),
      this.facilityModel
        .aggregate([
          {
            $group: {
              _id: null,
              avgAvailability: { $avg: '$availabilityCount' },
              totalCapacity: { $sum: '$capacity' },
              totalAvailable: { $sum: '$availabilityCount' },
            },
          },
        ])
        .exec(),
    ]);

    return { byStatus, byService, flagged, avgAvailability: avgAvailability[0] ?? null };
  }

  async getInquiryStats() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [total, byStatus, recent30Days, placedRate, avgMatchedFacilities] =
      await Promise.all([
        this.inquiryModel.countDocuments().exec(),
        this.inquiryModel
          .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
          .exec(),
        this.inquiryModel
          .countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
          .exec(),
        this.inquiryModel.countDocuments({ status: InquiryStatus.PLACED }).exec(),
        this.inquiryModel
          .aggregate([
            {
              $group: {
                _id: null,
                avgMatched: { $avg: { $size: '$assignedFacilityIds' } },
              },
            },
          ])
          .exec(),
      ]);

    const placementRate = total > 0 ? ((placedRate / total) * 100).toFixed(1) + '%' : '0%';

    return {
      total,
      byStatus,
      recent30Days,
      placementRate,
      avgMatchedFacilities: avgMatchedFacilities[0]?.avgMatched?.toFixed(1) ?? 0,
    };
  }

  async getPartnerStats() {
    const [total, byCategory, visible, hidden] = await Promise.all([
      this.partnerModel.countDocuments().exec(),
      this.partnerModel
        .aggregate([
          { $group: { _id: '$category', count: { $sum: 1 }, visible: { $sum: { $cond: ['$isVisible', 1, 0] } } } },
          { $sort: { count: -1 } },
        ])
        .exec(),
      this.partnerModel.countDocuments({ isVisible: true }).exec(),
      this.partnerModel.countDocuments({ isVisible: false }).exec(),
    ]);

    return { total, byCategory, visible, hidden };
  }
}
