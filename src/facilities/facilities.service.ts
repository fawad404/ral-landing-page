import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// ── Disk storage helpers (commented out – kept for local fallback if needed) ──
// import * as fs from 'fs';
// import * as path from 'path';
// ─────────────────────────────────────────────────────────────────────────────
import {
  Facility,
  FacilityDocument,
  FacilityStatus,
} from './schemas/facility.schema';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto, UpdateAvailabilityDto } from './dto/update-facility.dto';
import { Role } from '../common/enums/role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateFacilityDto, ownerId: string): Promise<FacilityDocument> {
    return this.facilityModel.create({ ...dto, ownerId });
  }

  async findAll(filters?: {
    status?: FacilityStatus;
    isVisible?: boolean;
    isFlagged?: boolean;
    services?: string;
    zipCode?: string;
  }) {
    const query: Record<string, any> = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.isVisible !== undefined) query.isVisible = filters.isVisible;
    if (filters?.isFlagged !== undefined) query.isFlagged = filters.isFlagged;
    if (filters?.services) query.services = { $in: [filters.services] };
    if (filters?.zipCode) query['address.zipCode'] = filters.zipCode;

    return this.facilityModel
      .find(query)
      .populate('ownerId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<FacilityDocument> {
    const facility = await this.facilityModel
      .findById(id)
      .populate('ownerId', 'email firstName lastName')
      .exec();
    if (!facility) throw new NotFoundException('Facility not found');
    return facility;
  }

  async findByOwner(ownerId: string) {
    return this.facilityModel
      .find({ ownerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    dto: UpdateFacilityDto,
    requestingUserId: string,
    requestingUserRole: Role,
  ): Promise<FacilityDocument> {
    const facility = await this.facilityModel.findById(id).exec();
    if (!facility) throw new NotFoundException('Facility not found');

    if (
      requestingUserRole !== Role.ADMIN &&
      facility.ownerId.toString() !== requestingUserId
    ) {
      throw new ForbiddenException('You do not have permission to update this facility');
    }

    const updated = await this.facilityModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    return updated!;
  }

  async updateAvailability(
    id: string,
    dto: UpdateAvailabilityDto,
    requestingUserId: string,
    requestingUserRole: Role,
  ): Promise<FacilityDocument> {
    const facility = await this.facilityModel.findById(id).exec();
    if (!facility) throw new NotFoundException('Facility not found');

    if (
      requestingUserRole !== Role.ADMIN &&
      facility.ownerId.toString() !== requestingUserId
    ) {
      throw new ForbiddenException('You do not have permission to update this facility');
    }

    if (dto.availabilityCount > facility.capacity) {
      throw new BadRequestException('Availability count cannot exceed capacity');
    }

    const updated = await this.facilityModel
      .findByIdAndUpdate(
        id,
        {
          availabilityCount: dto.availabilityCount,
          lastUpdated: new Date(),
          isFlagged: false,
        },
        { new: true },
      )
      .exec();
    return updated!;
  }

  async addPhoto(
    id: string,
    fileUrl: string,
    publicId: string,
    label: string,
    requestingUserId: string,
    requestingUserRole: Role,
  ): Promise<FacilityDocument> {
    const facility = await this.facilityModel.findById(id).exec();
    if (!facility) throw new NotFoundException('Facility not found');

    if (
      requestingUserRole !== Role.ADMIN &&
      facility.ownerId.toString() !== requestingUserId
    ) {
      throw new ForbiddenException('You do not have permission to update this facility');
    }

    const updated = await this.facilityModel
      .findByIdAndUpdate(
        id,
        { $push: { photos: { url: fileUrl, publicId, label: label || '', uploadedAt: new Date() } } },
        { new: true },
      )
      .exec();
    return updated!;
  }

  async removePhoto(
    id: string,
    publicId: string,
    requestingUserId: string,
    requestingUserRole: Role,
  ): Promise<FacilityDocument> {
    const facility = await this.facilityModel.findById(id).exec();
    if (!facility) throw new NotFoundException('Facility not found');

    if (
      requestingUserRole !== Role.ADMIN &&
      facility.ownerId.toString() !== requestingUserId
    ) {
      throw new ForbiddenException('You do not have permission to update this facility');
    }

    // ── Disk storage cleanup (commented out – Cloudinary handles deletion now) ─
    // const filePath = path.join(process.cwd(), 'uploads', 'facilities', id, filename);
    // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    // ──────────────────────────────────────────────────────────────────────────

    const updated = await this.facilityModel
      .findByIdAndUpdate(
        id,
        { $pull: { photos: { publicId } } },
        { new: true },
      )
      .exec();
    return updated!;
  }

  async approve(id: string): Promise<FacilityDocument> {
    const facility = await this.facilityModel
      .findByIdAndUpdate(id, { status: FacilityStatus.APPROVED }, { new: true })
      .exec();
    if (!facility) throw new NotFoundException('Facility not found');
    return facility;
  }

  async reject(id: string): Promise<FacilityDocument> {
    const facility = await this.facilityModel
      .findByIdAndUpdate(id, { status: FacilityStatus.REJECTED }, { new: true })
      .exec();
    if (!facility) throw new NotFoundException('Facility not found');
    return facility;
  }

  async activate(id: string): Promise<FacilityDocument> {
    const facility = await this.facilityModel
      .findByIdAndUpdate(id, { isVisible: true }, { new: true })
      .exec();
    if (!facility) throw new NotFoundException('Facility not found');
    return facility;
  }

  async deactivate(id: string): Promise<FacilityDocument> {
    const facility = await this.facilityModel
      .findByIdAndUpdate(id, { isVisible: false }, { new: true })
      .exec();
    if (!facility) throw new NotFoundException('Facility not found');
    return facility;
  }

  async getFlagged() {
    return this.facilityModel
      .find({ isFlagged: true })
      .populate('ownerId', 'email firstName lastName phone')
      .sort({ lastUpdated: 1 })
      .exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.facilityModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Facility not found');
  }

  async findApprovedWithAvailability() {
    return this.facilityModel
      .find({ status: FacilityStatus.APPROVED, isVisible: true, availabilityCount: { $gt: 0 } })
      .exec();
  }
}
