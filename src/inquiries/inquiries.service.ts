import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inquiry, InquiryDocument, InquiryStatus } from './schemas/inquiry.schema';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateInquiryDto): Promise<InquiryDocument> {
    const inquiry = await this.inquiryModel.create(dto);

    await this.notificationsService.createForAllAdmins(
      NotificationType.NEW_INQUIRY,
      'New Inquiry Received',
      `New inquiry from ${dto.familyData.name} (${dto.familyData.email})`,
      {
        inquiryId: inquiry._id.toString(),
        familyName: dto.familyData.name,
        familyEmail: dto.familyData.email,
      },
    );

    return inquiry;
  }

  async findAll(filters?: { status?: InquiryStatus; assignedTo?: string }) {
    const query: Record<string, any> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.assignedTo) query.assignedTo = filters.assignedTo;

    return this.inquiryModel
      .find(query)
      .populate('assignedFacilityIds', 'name address services')
      .populate('assignedTo', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<InquiryDocument> {
    const inquiry = await this.inquiryModel
      .findById(id)
      .populate('assignedFacilityIds', 'name address services availabilityCount')
      .populate('assignedTo', 'email firstName lastName')
      .exec();
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async update(id: string, dto: UpdateInquiryDto): Promise<InquiryDocument> {
    const inquiry = await this.inquiryModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<InquiryDocument> {
    const inquiry = await this.inquiryModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async assignFacilities(
    id: string,
    facilityIds: string[],
    matchReason: string,
    matchHistory: Array<{ facilityId: string; reason: string; score: number; isManualOverride?: boolean }>,
  ): Promise<InquiryDocument> {
    const objectIds = facilityIds.map((fid) => new Types.ObjectId(fid));
    const historyEntries = matchHistory.map((h) => ({
      facilityId: new Types.ObjectId(h.facilityId),
      reason: h.reason,
      score: h.score,
      assignedAt: new Date(),
      isManualOverride: h.isManualOverride ?? false,
    }));

    const inquiry = await this.inquiryModel
      .findByIdAndUpdate(
        id,
        {
          assignedFacilityIds: objectIds,
          matchReason,
          $push: { matchHistory: { $each: historyEntries } },
        },
        { new: true },
      )
      .exec();
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async delete(id: string): Promise<void> {
    const result = await this.inquiryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Inquiry not found');
  }

  async getStats() {
    const total = await this.inquiryModel.countDocuments().exec();
    const byStatus = await this.inquiryModel
      .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      .exec();
    return { total, byStatus };
  }
}
