import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument, LeadType } from './schemas/lead.schema';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private notificationsService: NotificationsService,
    private mailService: MailService,
    private authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateLeadDto): Promise<LeadDocument> {
    const existing = await this.leadModel.findOne({ email: dto.email.toLowerCase().trim() }).exec();
    if (existing) {
      throw new ConflictException('A submission with this email already exists. We will be in touch soon.');
    }

    const lead = await this.leadModel.create(dto);

    const label = dto.type === LeadType.FACILITY ? 'Facility' : 'Founding Partner';

    // Awaited (errors swallowed) so serverless hosts don't freeze the function
    // before the notification/email finishes.
    await this.notificationsService.createForAllAdmins(
      NotificationType.GENERAL,
      `New ${label} Lead`,
      `${dto.name} (${dto.email}) submitted a ${label.toLowerCase()} inquiry from the landing page.`,
      { leadId: (lead._id as any).toString(), leadType: dto.type, name: dto.name, email: dto.email },
    ).catch(() => {});

    await this.mailService.sendLeadNotification({
      type: dto.type,
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? '',
    }).catch(() => {});

    return lead;
  }

  async findAll(type?: LeadType, status?: string): Promise<LeadDocument[]> {
    const filter: Record<string, any> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    return this.leadModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<LeadDocument | null> {
    return this.leadModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateLeadDto): Promise<LeadDocument | null> {
    return this.leadModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.leadModel.findByIdAndDelete(id).exec();
  }

  async createAccount(id: string, password: string, loginUrl: string): Promise<{ email: string }> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new Error('Lead not found');

    const role = lead.type === LeadType.FACILITY ? Role.FACILITY : Role.VENDOR;
    const nameParts = lead.name.trim().split(' ');
    const firstName = nameParts[0] ?? lead.name;
    const lastName = nameParts.slice(1).join(' ') || '';

    const { user } = await this.authService.register({
      email: lead.email,
      password,
      confirmPassword: password,
      role,
      firstName,
      lastName,
      phone: lead.phone,
      facilityName: lead.homeName || lead.companyName,
    });

    // Auto-approve — no manual approval needed since admin is creating the account
    await this.userModel.findByIdAndUpdate((user as any)._id, { isApproved: true }).exec();

    await this.leadModel.findByIdAndUpdate(id, { linkedUserId: (user as any)._id?.toString() ?? '' }).exec();

    await this.mailService.sendAccountCredentials({
      to: lead.email,
      name: lead.name,
      tempPassword: password,
      loginUrl,
    });

    return { email: lead.email };
  }
}
