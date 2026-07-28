import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// ── Disk storage helpers (commented out – Cloudinary handles files now) ───────
// import * as fs from 'fs';
// import * as path from 'path';
// ─────────────────────────────────────────────────────────────────────────────
import {
  SocialBoost,
  SocialBoostDocument,
  SocialBoostStatus,
} from './schemas/social-boost.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';
import { FacilitiesService } from '../facilities/facilities.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class SocialBoostService {
  constructor(
    @InjectModel(SocialBoost.name) private model: Model<SocialBoostDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly facilitiesService: FacilitiesService,
  ) {}

  async submit(
    dto: CreateSubmissionDto,
    fileUrl: string | undefined,
    userId: string,
  ): Promise<SocialBoostDocument> {
    const facilities = await this.facilitiesService.findByOwner(userId);
    if (!facilities.length) {
      throw new ForbiddenException('You must have a facility to submit a social boost post');
    }
    const facility = facilities[0];

    const submission = await this.model.create({
      ...dto,
      fileUrl: fileUrl ?? dto.fileUrl,
      facilityId: facility._id,
      facilityName: facility.name,
      submittedBy: userId,
    });

    // Notify all admins
    await this.notificationsService.createForAllAdmins(
      NotificationType.GENERAL,
      'New Social Boost Submission',
      `"${facility.name}" submitted a new social post for review — Category: ${dto.category}, Channel: ${dto.channel}.`,
      { submissionId: (submission._id as any).toString(), facilityId: facility._id.toString() },
    );

    return submission;
  }

  async findMy(userId: string): Promise<SocialBoostDocument[]> {
    const facilities = await this.facilitiesService.findByOwner(userId);
    if (!facilities.length) return [];
    const facilityId = facilities[0]._id;
    return this.model
      .find({ facilityId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(filters?: { status?: SocialBoostStatus }): Promise<SocialBoostDocument[]> {
    const query: Record<string, any> = {};
    if (filters?.status) query.status = filters.status;
    return this.model
      .find(query)
      .populate('submittedBy', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
    adminId: string,
  ): Promise<SocialBoostDocument> {
    const submission = await this.model.findById(id).exec();
    if (!submission) throw new NotFoundException('Submission not found');

    const updated = await this.model
      .findByIdAndUpdate(
        id,
        {
          status: dto.status,
          reviewNotes: dto.reviewNotes,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    // Notify the facility owner
    const statusLabels: Record<SocialBoostStatus, string> = {
      [SocialBoostStatus.APPROVED]: 'approved',
      [SocialBoostStatus.POSTED]: 'posted to social media',
      [SocialBoostStatus.REJECTED]: 'rejected',
      [SocialBoostStatus.PENDING]: 'pending review',
    };
    const label = statusLabels[dto.status] ?? dto.status;

    await this.notificationsService.createForUser(
      submission.submittedBy,
      NotificationType.GENERAL,
      `Social Boost Update`,
      `Your post submission has been ${label}.${dto.reviewNotes ? ` Note: ${dto.reviewNotes}` : ''}`,
      { submissionId: id },
    );

    return updated!;
  }

  async delete(id: string, userId: string, userRole: Role): Promise<void> {
    const submission = await this.model.findById(id).exec();
    if (!submission) throw new NotFoundException('Submission not found');

    if (
      userRole !== Role.ADMIN &&
      submission.submittedBy.toString() !== userId
    ) {
      throw new ForbiddenException('You do not have permission to delete this submission');
    }

    // ── Disk storage cleanup (commented out – Cloudinary handles deletion) ───
    // if (submission.fileUrl) {
    //   const filename = path.basename(submission.fileUrl);
    //   const filePath = path.join(process.cwd(), 'uploads', 'social-boost', filename);
    //   if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    // }
    // ────────────────────────────────────────────────────────────────────────

    await this.model.findByIdAndDelete(id).exec();
  }
}
