import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DemoInquiry, DemoInquiryDocument, DemoInquiryType } from './schemas/demo-inquiry.schema';
import { CreateDemoInquiryDto } from './dto/create-demo-inquiry.dto';
import { UpdateDemoInquiryDto } from './dto/update-demo-inquiry.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';

@Injectable()
export class DemoInquiriesService {
  constructor(
    @InjectModel(DemoInquiry.name) private demoInquiryModel: Model<DemoInquiryDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateDemoInquiryDto): Promise<DemoInquiryDocument> {
    const inquiry = await this.demoInquiryModel.create(dto);

    const label = dto.type === DemoInquiryType.FACILITY ? 'Facility Owner' : 'Discharge Planner';

    this.notificationsService.createForAllAdmins(
      NotificationType.GENERAL,
      `New Demo Inquiry — ${label}`,
      `${dto.name} (${dto.email}) submitted a demo inquiry as a ${label}.`,
      { inquiryId: (inquiry._id as any).toString(), type: dto.type, name: dto.name, email: dto.email },
    ).catch(() => {});

    return inquiry;
  }

  async findAll(type?: DemoInquiryType, status?: string): Promise<DemoInquiryDocument[]> {
    const filter: Record<string, any> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    return this.demoInquiryModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<DemoInquiryDocument | null> {
    return this.demoInquiryModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateDemoInquiryDto): Promise<DemoInquiryDocument | null> {
    return this.demoInquiryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.demoInquiryModel.findByIdAndDelete(id).exec();
  }
}
