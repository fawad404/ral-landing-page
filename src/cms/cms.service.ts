import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resource, ResourceDocument, ResourceType } from './schemas/resource.schema';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class CmsService {
  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<ResourceDocument>,
  ) {}

  async create(dto: CreateResourceDto, authorId: string): Promise<ResourceDocument> {
    const slug = dto.slug ?? this.generateSlug(dto.title);
    return this.resourceModel.create({
      ...dto,
      slug,
      authorId: new Types.ObjectId(authorId),
    });
  }

  async findAll(filters?: { type?: ResourceType; isPublished?: boolean; tag?: string }) {
    const query: Record<string, any> = {};
    if (filters?.type) query.type = filters.type;
    if (filters?.isPublished !== undefined) query.isPublished = filters.isPublished;
    if (filters?.tag) query.tags = { $in: [filters.tag] };

    return this.resourceModel
      .find(query)
      .populate('authorId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<ResourceDocument> {
    const resource = await this.resourceModel
      .findById(id)
      .populate('authorId', 'email firstName lastName')
      .exec();
    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  async findBySlug(slug: string): Promise<ResourceDocument> {
    const resource = await this.resourceModel
      .findOne({ slug, isPublished: true })
      .populate('authorId', 'email firstName lastName')
      .exec();
    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  async update(id: string, dto: UpdateResourceDto): Promise<ResourceDocument> {
    if (dto.title && !dto.slug) {
      (dto as any).slug = this.generateSlug(dto.title);
    }
    const resource = await this.resourceModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  async togglePublish(id: string): Promise<ResourceDocument> {
    const resource = await this.findById(id);
    const updated = await this.resourceModel
      .findByIdAndUpdate(id, { isPublished: !resource.isPublished }, { new: true })
      .exec();
    return updated!;
  }

  async delete(id: string): Promise<void> {
    const result = await this.resourceModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Resource not found');
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-') +
      '-' +
      Date.now().toString(36)
    );
  }
}
