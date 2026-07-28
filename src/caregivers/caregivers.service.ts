import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Caregiver, CaregiverDocument, CaregiverStatus } from './schemas/caregiver.schema';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';

export interface PaginatedCaregivers {
  data: CaregiverDocument[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class CaregiversService {
  constructor(
    @InjectModel(Caregiver.name) private caregiverModel: Model<CaregiverDocument>,
  ) {}

  async create(dto: CreateCaregiverDto): Promise<CaregiverDocument> {
    const caregiver = new this.caregiverModel(dto);
    return caregiver.save();
  }

  async apply(dto: CreateCaregiverDto): Promise<CaregiverDocument> {
    const { confirmUpdate, ...caregiverData } = dto;

    if (dto.email) {
      const existing = await this.caregiverModel
        .findOne({ email: dto.email.toLowerCase().trim() })
        .exec();

      if (existing && !confirmUpdate) {
        throw new ConflictException({
          exists: true,
          message: 'This email is already in our records.',
        });
      }

      if (existing && confirmUpdate) {
        Object.assign(existing, {
          ...caregiverData,
          status: CaregiverStatus.PENDING,
          isVisible: false,
        });
        return existing.save();
      }
    }

    const caregiver = new this.caregiverModel({
      ...caregiverData,
      status: CaregiverStatus.PENDING,
      isVisible: false,
    });
    return caregiver.save();
  }

  async approve(id: string): Promise<CaregiverDocument> {
    const caregiver = await this.caregiverModel
      .findByIdAndUpdate(id, { status: CaregiverStatus.ACTIVE, isVisible: true }, { new: true })
      .exec();
    if (!caregiver) throw new NotFoundException('Caregiver not found');
    return caregiver;
  }

  async reject(id: string): Promise<CaregiverDocument> {
    const caregiver = await this.caregiverModel
      .findByIdAndUpdate(id, { status: CaregiverStatus.INACTIVE, isVisible: false }, { new: true })
      .exec();
    if (!caregiver) throw new NotFoundException('Caregiver not found');
    return caregiver;
  }

  async findAll(params?: {
    status?: string;
    city?: string;
    certification?: string;
    availability?: string;
    search?: string;
  }): Promise<CaregiverDocument[]> {
    const query: Record<string, any> = {};

    if (params?.status) query.status = params.status;
    if (params?.city) query.city = new RegExp(params.city, 'i');
    if (params?.certification) query.certifications = params.certification;
    if (params?.availability) query.availability = params.availability;
    if (params?.search) {
      const rx = new RegExp(params.search, 'i');
      query.$or = [
        { firstName: rx }, { lastName: rx },
        { city: rx }, { bio: rx },
      ];
    }

    return this.caregiverModel.find(query).sort({ createdAt: -1 }).exec();
  }

  // Public directory — sorted by last updated, paginated 20 per page
  async findVisible(params?: {
    workArea?: string;
    availableNow?: string;
    shift?: string;
    search?: string;
    page?: string;
    limit?: string;
  }): Promise<PaginatedCaregivers> {
    const query: Record<string, any> = {
      isVisible: true,
      status: CaregiverStatus.ACTIVE,
    };

    if (params?.workArea) query.workAreas = params.workArea;
    if (params?.availableNow === 'true') query.availableNow = true;
    if (params?.shift) query.availability = params.shift;
    if (params?.search) {
      const rx = new RegExp(params.search, 'i');
      query.$or = [
        { firstName: rx }, { lastName: rx },
        { city: rx }, { bio: rx },
      ];
    }

    const page = Math.max(1, parseInt(params?.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(params?.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.caregiverModel.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).exec(),
      this.caregiverModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<CaregiverDocument> {
    const caregiver = await this.caregiverModel.findById(id).exec();
    if (!caregiver) throw new NotFoundException('Caregiver not found');
    return caregiver;
  }

  async update(id: string, dto: UpdateCaregiverDto): Promise<CaregiverDocument> {
    const caregiver = await this.caregiverModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!caregiver) throw new NotFoundException('Caregiver not found');
    return caregiver;
  }

  async toggleVisibility(id: string): Promise<CaregiverDocument> {
    const caregiver = await this.findById(id);
    caregiver.isVisible = !caregiver.isVisible;
    return caregiver.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.caregiverModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Caregiver not found');
  }
}
