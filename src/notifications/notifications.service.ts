import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.schema';
import {
  Facility,
  FacilityDocument,
  FacilityStatus,
} from '../facilities/schemas/facility.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Facility.name)
    private facilityModel: Model<FacilityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createForUser(
    userId: string | Types.ObjectId,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<NotificationDocument> {
    return this.notificationModel.create({
      userId,
      type,
      title,
      message,
      metadata: metadata ?? {},
    });
  }

  async createForAllAdmins(
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const admins = await this.userModel
      .find({ role: Role.ADMIN, isActive: true })
      .select('_id')
      .exec();

    const notifications = admins.map((admin) => ({
      userId: admin._id,
      type,
      title,
      message,
      metadata: metadata ?? {},
    }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }

  async findForUser(userId: string, onlyUnread = false) {
    const query: Record<string, any> = { userId };
    if (onlyUnread) query.isRead = false;
    return this.notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDocument | null> {
    return this.notificationModel
      .findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true })
      .exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany({ userId, isRead: false }, { isRead: true })
      .exec();
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.notificationModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({ userId, isRead: false }).exec();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkFacilityInactivity(): Promise<void> {
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const staleFacilities = await this.facilityModel
      .find({
        status: FacilityStatus.APPROVED,
        isVisible: true,
        lastUpdated: { $lt: threshold },
        isFlagged: false,
      })
      .exec();

    for (const facility of staleFacilities) {
      await this.facilityModel.findByIdAndUpdate(facility._id, { isFlagged: true }).exec();

      await this.createForUser(
        facility.ownerId,
        NotificationType.FACILITY_INACTIVE,
        'Availability Update Required',
        `Your facility "${facility.name}" has not updated availability in over 24 hours. Please update your current availability.`,
        { facilityId: facility._id.toString(), facilityName: facility.name },
      );

      await this.createForAllAdmins(
        NotificationType.FACILITY_INACTIVE,
        'Flagged: Facility Inactivity',
        `Facility "${facility.name}" has not updated availability in over 24 hours and has been flagged.`,
        { facilityId: facility._id.toString(), facilityName: facility.name },
      );
    }
  }
}
