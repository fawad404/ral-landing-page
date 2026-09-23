import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DealRoomRequest,
  DealRoomRequestDocument,
  DealRoomStatus,
} from './schemas/deal-room.schema';
import { RejectRequestDto } from './dto/reject-request.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';
import { FacilitiesService } from '../facilities/facilities.service';
import { FacilityStatus } from '../facilities/schemas/facility.schema';

@Injectable()
export class DealRoomService {
  constructor(
    @InjectModel(DealRoomRequest.name) private model: Model<DealRoomRequestDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly facilitiesService: FacilitiesService,
  ) {}

  async requestAccess(userId: string): Promise<DealRoomRequestDocument> {
    const facilities = await this.facilitiesService.findByOwner(userId);
    if (!facilities.length) {
      throw new ForbiddenException('You must have a registered facility to request deal room access');
    }
    const facility = facilities[0];
    if (facility.status !== FacilityStatus.APPROVED) {
      throw new ForbiddenException('Your facility must be approved by RAL Connect before requesting Deal Room access');
    }

    const existing = await this.model
      .findOne({ facilityId: facility._id, status: { $in: [DealRoomStatus.PENDING, DealRoomStatus.APPROVED] } })
      .exec();
    if (existing) {
      throw new ConflictException(
        existing.status === DealRoomStatus.APPROVED
          ? 'Your facility already has deal room access'
          : 'You already have a pending access request',
      );
    }

    const request = await this.model.create({
      facilityId: facility._id,
      facilityName: facility.name,
      ownerId: userId,
    });

    await this.notificationsService.createForAllAdmins(
      NotificationType.GENERAL,
      'New Deal Room Access Request',
      `"${facility.name}" has requested access to the Deal Room.`,
      { requestId: (request._id as any).toString(), facilityId: facility._id.toString() },
    );

    return request;
  }

  async findMyRequest(userId: string): Promise<DealRoomRequestDocument | null> {
    const facilities = await this.facilitiesService.findByOwner(userId);
    if (!facilities.length) return null;
    const facilityId = facilities[0]._id;
    return this.model
      .findOne({ facilityId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(filters?: { status?: DealRoomStatus }): Promise<DealRoomRequestDocument[]> {
    const query: Record<string, any> = {};
    if (filters?.status) query.status = filters.status;
    return this.model
      .find(query)
      .populate('ownerId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async approve(id: string, adminId: string): Promise<DealRoomRequestDocument> {
    const request = await this.model.findById(id).exec();
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== DealRoomStatus.PENDING) {
      throw new ConflictException('Request has already been reviewed');
    }
    const facility = await this.facilitiesService.findById(request.facilityId.toString());
    if (facility.status !== FacilityStatus.APPROVED) {
      throw new ConflictException('Approve the facility itself before granting Deal Room access');
    }

    const updated = await this.model
      .findByIdAndUpdate(
        id,
        { status: DealRoomStatus.APPROVED, reviewedBy: adminId, reviewedAt: new Date() },
        { new: true },
      )
      .exec();

    await this.notificationsService.createForUser(
      request.ownerId,
      NotificationType.GENERAL,
      'Deal Room Access Approved',
      `Your request for Deal Room access has been approved. You can now access exclusive partner deals.`,
      { requestId: id },
    );

    return updated!;
  }

  async reject(id: string, dto: RejectRequestDto, adminId: string): Promise<DealRoomRequestDocument> {
    const request = await this.model.findById(id).exec();
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== DealRoomStatus.PENDING) {
      throw new ConflictException('Request has already been reviewed');
    }

    const updated = await this.model
      .findByIdAndUpdate(
        id,
        {
          status: DealRoomStatus.REJECTED,
          rejectionReason: dto.rejectionReason,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    await this.notificationsService.createForUser(
      request.ownerId,
      NotificationType.GENERAL,
      'Deal Room Access Rejected',
      `Your request for Deal Room access has been rejected.${dto.rejectionReason ? ` Reason: ${dto.rejectionReason}` : ''}`,
      { requestId: id },
    );

    return updated!;
  }
}
