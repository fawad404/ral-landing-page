import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AvailabilityRequest, AvailabilityRequestDocument } from './schemas/availability-request.schema';
import { AvailabilityResponse, AvailabilityResponseDocument, ResponseType } from './schemas/availability-response.schema';
import { SubmitRequestDto } from './dto/submit-request.dto';
import { SubmitInterestedDto, SubmitResponseDto } from './dto/submit-response.dto';
import { MailService } from '../mail/mail.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AvailabilityBroadcastService {
  private readonly logger = new Logger(AvailabilityBroadcastService.name);

  constructor(
    @InjectModel(AvailabilityRequest.name) private requestModel: Model<AvailabilityRequestDocument>,
    @InjectModel(AvailabilityResponse.name) private responseModel: Model<AvailabilityResponseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async submitRequest(dto: SubmitRequestDto): Promise<{ requestId: string }> {
    const request = await this.requestModel.create({
      ...dto,
      notes: dto.notes?.trim() || '',
      broadcastedAt: new Date(),
    });

    const requestId = (request._id as any).toString();

    this.broadcastToFacilities(requestId, request).catch((err) => {
      this.logger.error('Broadcast failed for request ' + requestId, err);
    });

    return { requestId };
  }

  async getRequest(requestId: string): Promise<{ contactName: string; phone: string; email: string; preferredArea: string; careTypes: string[]; paymentType: string; moveTimeline: string }> {
    const request = await this.requestModel.findById(requestId).exec();
    if (!request) throw new NotFoundException('Request not found');
    return {
      contactName: request.contactName,
      phone: request.phone,
      email: request.email,
      preferredArea: request.preferredArea,
      careTypes: request.careTypes,
      paymentType: request.paymentType,
      moveTimeline: request.moveTimeline,
    };
  }

  async recordResponse(requestId: string, dto: SubmitResponseDto): Promise<void> {
    const request = await this.requestModel.findById(requestId).exec();
    if (!request) throw new NotFoundException('Request not found');

    const alreadyRecorded = await this.responseModel.findOne({ requestId, responseType: dto.responseType }).exec();
    if (alreadyRecorded) return;

    await this.responseModel.create({ requestId, responseType: dto.responseType });
  }

  async recordInterestedResponse(requestId: string, dto: SubmitInterestedDto): Promise<void> {
    const request = await this.requestModel.findById(requestId).exec();
    if (!request) throw new NotFoundException('Request not found');

    await this.responseModel.create({
      requestId,
      responseType: ResponseType.INTERESTED,
      facilityName: dto.facilityName,
      contactName: dto.contactName,
      phone: dto.phone,
      email: dto.email,
      availableBedCount: dto.availableBedCount,
      notes: dto.notes?.trim() || '',
    });

    this.mailService.forwardInterestedResponse({
      plannerEmail: request.email,
      plannerName: request.contactName,
      requestArea: request.preferredArea,
      requestCareTypes: request.careTypes,
      facilityName: dto.facilityName,
      facilityContact: dto.contactName,
      facilityPhone: dto.phone,
      facilityEmail: dto.email,
      availableBedCount: dto.availableBedCount,
      notes: dto.notes,
    }).catch((err) => {
      this.logger.error('Failed to forward interested response for request ' + requestId, err);
    });
  }

  private async broadcastToFacilities(requestId: string, request: AvailabilityRequestDocument): Promise<void> {
    const facilities = await this.userModel
      .find({ role: Role.FACILITY, isActive: true, isApproved: true })
      .select('email firstName lastName')
      .exec();

    if (!facilities.length) {
      this.logger.warn('No active facility users to broadcast to — request ' + requestId);
      return;
    }

    const landingUrl = this.config.get<string>('LANDING_URL') || 'http://localhost:3001';

    await Promise.allSettled(
      facilities.map((user) =>
        this.mailService.sendAvailabilityBroadcast({
          to: user.email,
          recipientName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'RAL Owner',
          requestId,
          preferredArea: request.preferredArea,
          careTypes: request.careTypes,
          paymentType: request.paymentType,
          moveTimeline: request.moveTimeline,
          landingUrl,
        }).catch((err) => {
          this.logger.error(`Broadcast email failed for ${user.email}`, err);
        })
      )
    );

    this.logger.log(`Broadcast sent to ${facilities.length} facility users for request ${requestId}`);
  }
}
