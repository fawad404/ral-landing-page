import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partner, PartnerDocument, PartnerStatus } from './schemas/partner.schema';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PartnersService {
  constructor(
    @InjectModel(Partner.name) private partnerModel: Model<PartnerDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  // ── Vendor: create own partner profile ────────────────────────────────────
  async createByVendor(dto: CreatePartnerDto, userId: string): Promise<PartnerDocument> {
    const existing = await this.partnerModel.findOne({ userId }).exec();
    if (existing) throw new ConflictException('You already have a partner profile');
    return this.partnerModel.create({ ...dto, userId, status: PartnerStatus.PENDING, isVisible: false });
  }

  // ── Vendor: get own profile ────────────────────────────────────────────────
  async findByUserId(userId: string): Promise<PartnerDocument[]> {
    return this.partnerModel.find({ userId }).exec();
  }

  // ── Vendor: update own profile ────────────────────────────────────────────
  async updateByVendor(id: string, dto: UpdatePartnerDto, userId: string): Promise<PartnerDocument> {
    const partner = await this.findById(id);
    if (partner.userId !== userId) throw new ForbiddenException('You can only edit your own profile');
    const updated = await this.partnerModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    return updated!;
  }

  // ── Vendor: upload logo ───────────────────────────────────────────────────
  async uploadLogo(id: string, buffer: Buffer, userId: string): Promise<PartnerDocument> {
    const partner = await this.findById(id);
    if (partner.userId !== userId) throw new ForbiddenException('You can only update your own logo');

    // Delete old logo if exists
    if (partner.logoPublicId) {
      await this.cloudinary.deleteByPublicId(partner.logoPublicId).catch(() => null);
    }

    const result = await this.cloudinary.uploadBuffer(buffer, 'partners', { resourceType: 'image' });
    const updated = await this.partnerModel.findByIdAndUpdate(
      id,
      { logoUrl: result.secure_url, logoPublicId: result.public_id },
      { new: true },
    ).exec();
    return updated!;
  }

  // ── Public/Facility: get only visible partners ────────────────────────────
  async findVisible(): Promise<PartnerDocument[]> {
    return this.partnerModel
      .find({ isVisible: true, status: PartnerStatus.APPROVED })
      .sort({ createdAt: -1 })
      .exec();
  }

  // ── Admin: get all partners ───────────────────────────────────────────────
  async findAll(filters?: { status?: string; category?: string }) {
    const query: Record<string, any> = {};
    if (filters?.status)   query.status   = filters.status;
    if (filters?.category) query.category = filters.category;
    return this.partnerModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<PartnerDocument> {
    const partner = await this.partnerModel.findById(id).exec();
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  // ── Admin: approve ────────────────────────────────────────────────────────
  async approve(id: string): Promise<PartnerDocument> {
    const updated = await this.partnerModel
      .findByIdAndUpdate(id, { status: PartnerStatus.APPROVED, rejectionReason: null }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Partner not found');
    return updated;
  }

  // ── Admin: reject ─────────────────────────────────────────────────────────
  async reject(id: string, reason?: string): Promise<PartnerDocument> {
    const updated = await this.partnerModel
      .findByIdAndUpdate(id, { status: PartnerStatus.REJECTED, rejectionReason: reason ?? '' }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Partner not found');
    return updated;
  }

  // ── Admin: toggle visibility ──────────────────────────────────────────────
  async toggleVisibility(id: string): Promise<PartnerDocument> {
    const partner = await this.findById(id);
    if (partner.status !== PartnerStatus.APPROVED) {
      throw new BadRequestException('Only approved partners can be made visible');
    }
    const updated = await this.partnerModel
      .findByIdAndUpdate(id, { isVisible: !partner.isVisible }, { new: true })
      .exec();
    return updated!;
  }

  // ── Admin: update (category, orderWeight, etc.) ───────────────────────────
  async adminUpdate(id: string, dto: Record<string, any>): Promise<PartnerDocument> {
    const updated = await this.partnerModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!updated) throw new NotFoundException('Partner not found');
    return updated;
  }

  // ── Admin: delete ─────────────────────────────────────────────────────────
  async delete(id: string): Promise<void> {
    const partner = await this.partnerModel.findByIdAndDelete(id).exec();
    if (!partner) throw new NotFoundException('Partner not found');
    if (partner.logoPublicId) {
      await this.cloudinary.deleteByPublicId(partner.logoPublicId).catch(() => null);
    }
  }

  async getCategories() {
    return this.partnerModel.distinct('category').exec();
  }
}
