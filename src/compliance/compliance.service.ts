import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ComplianceTask,
  ComplianceTaskDocument,
  TaskStatus,
} from './schemas/compliance-task.schema';
import {
  ComplianceIncident,
  ComplianceIncidentDocument,
  IncidentSeverity,
  IncidentStatus,
} from './schemas/compliance-incident.schema';
import {
  StaffCredential,
  StaffCredentialDocument,
  CredentialStatus,
} from './schemas/staff-credential.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectModel(ComplianceTask.name)
    private taskModel: Model<ComplianceTaskDocument>,
    @InjectModel(ComplianceIncident.name)
    private incidentModel: Model<ComplianceIncidentDocument>,
    @InjectModel(StaffCredential.name)
    private credentialModel: Model<StaffCredentialDocument>,
  ) {}

  // ─── helpers ──────────────────────────────────────────────────────────────

  private async refreshTaskStatuses(facilityId: string) {
    const now = new Date();
    await this.taskModel.updateMany(
      {
        facilityId,
        dueDate: { $lt: now },
        status: { $in: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS] },
      },
      { $set: { status: TaskStatus.OVERDUE } },
    );
  }

  private async refreshCredentialStatuses(facilityId: string) {
    const now = new Date();
    const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await Promise.all([
      this.credentialModel.updateMany(
        { facilityId, expirationDate: { $lt: now } },
        { $set: { status: CredentialStatus.EXPIRED } },
      ),
      this.credentialModel.updateMany(
        { facilityId, expirationDate: { $gte: now, $lte: soon } },
        { $set: { status: CredentialStatus.EXPIRING_SOON } },
      ),
      this.credentialModel.updateMany(
        { facilityId, expirationDate: { $gt: soon } },
        { $set: { status: CredentialStatus.VALID } },
      ),
    ]);
  }

  private computeCredentialStatus(expirationDate: string): CredentialStatus {
    const exp = new Date(expirationDate);
    const now = new Date();
    const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (exp < now) return CredentialStatus.EXPIRED;
    if (exp <= soon) return CredentialStatus.EXPIRING_SOON;
    return CredentialStatus.VALID;
  }

  // ─── STATS ────────────────────────────────────────────────────────────────

  async getStats(facilityId: string) {
    await Promise.all([
      this.refreshTaskStatuses(facilityId),
      this.refreshCredentialStatuses(facilityId),
    ]);

    const [
      totalTasks,
      openTasks,
      inProgressTasks,
      overdueTasks,
      completedTasks,
      totalIncidents,
      openIncidents,
      criticalIncidents,
      totalCredentials,
      expiredCredentials,
      expiringSoonCredentials,
    ] = await Promise.all([
      this.taskModel.countDocuments({ facilityId }),
      this.taskModel.countDocuments({ facilityId, status: TaskStatus.OPEN }),
      this.taskModel.countDocuments({ facilityId, status: TaskStatus.IN_PROGRESS }),
      this.taskModel.countDocuments({ facilityId, status: TaskStatus.OVERDUE }),
      this.taskModel.countDocuments({ facilityId, status: TaskStatus.COMPLETED }),
      this.incidentModel.countDocuments({ facilityId }),
      this.incidentModel.countDocuments({
        facilityId,
        status: { $in: [IncidentStatus.OPEN, IncidentStatus.UNDER_REVIEW] },
      }),
      this.incidentModel.countDocuments({ facilityId, severity: IncidentSeverity.CRITICAL }),
      this.credentialModel.countDocuments({ facilityId }),
      this.credentialModel.countDocuments({ facilityId, status: CredentialStatus.EXPIRED }),
      this.credentialModel.countDocuments({ facilityId, status: CredentialStatus.EXPIRING_SOON }),
    ]);

    return {
      tasks: { total: totalTasks, open: openTasks, inProgress: inProgressTasks, overdue: overdueTasks, completed: completedTasks },
      incidents: { total: totalIncidents, open: openIncidents, critical: criticalIncidents },
      credentials: { total: totalCredentials, expired: expiredCredentials, expiringSoon: expiringSoonCredentials },
    };
  }

  // ─── TASKS ────────────────────────────────────────────────────────────────

  async createTask(dto: CreateTaskDto, userId: string): Promise<ComplianceTaskDocument> {
    return this.taskModel.create({ ...dto, createdBy: userId });
  }

  async getTasks(
    facilityId: string,
    query: {
      status?: string;
      priority?: string;
      category?: string;
      assignedTo?: string;
      page?: number;
      limit?: number;
    },
  ) {
    await this.refreshTaskStatuses(facilityId);

    const filter: Record<string, any> = { facilityId };
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.category) filter.category = query.category;
    if (query.assignedTo) filter.assignedTo = { $regex: query.assignedTo, $options: 'i' };

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .sort({ dueDate: 1, priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments(filter),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getTaskById(id: string): Promise<ComplianceTaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<ComplianceTaskDocument> {
    const task = await this.taskModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async completeTask(id: string, completedBy: string): Promise<ComplianceTaskDocument> {
    const task = await this.taskModel
      .findByIdAndUpdate(
        id,
        { status: TaskStatus.COMPLETED, completedAt: new Date(), completedBy },
        { new: true },
      )
      .exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Task not found');
  }

  // ─── INCIDENTS ────────────────────────────────────────────────────────────

  async createIncident(dto: CreateIncidentDto, userId: string): Promise<ComplianceIncidentDocument> {
    return this.incidentModel.create({ ...dto, createdBy: userId });
  }

  async getIncidents(
    facilityId: string,
    query: {
      type?: string;
      severity?: string;
      status?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const filter: Record<string, any> = { facilityId };
    if (query.type) filter.type = query.type;
    if (query.severity) filter.severity = query.severity;
    if (query.status) filter.status = query.status;

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.incidentModel
        .find(filter)
        .sort({ incidentDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.incidentModel.countDocuments(filter),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getIncidentById(id: string): Promise<ComplianceIncidentDocument> {
    const incident = await this.incidentModel.findById(id).exec();
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async updateIncident(id: string, dto: UpdateIncidentDto): Promise<ComplianceIncidentDocument> {
    const incident = await this.incidentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async deleteIncident(id: string): Promise<void> {
    const result = await this.incidentModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Incident not found');
  }

  // ─── CREDENTIALS ──────────────────────────────────────────────────────────

  async createCredential(dto: CreateCredentialDto): Promise<StaffCredentialDocument> {
    const status = this.computeCredentialStatus(dto.expirationDate);
    return this.credentialModel.create({ ...dto, status });
  }

  async getCredentials(
    facilityId: string,
    query: {
      status?: string;
      credentialType?: string;
      staffName?: string;
      page?: number;
      limit?: number;
    },
  ) {
    await this.refreshCredentialStatuses(facilityId);

    const filter: Record<string, any> = { facilityId };
    if (query.status) filter.status = query.status;
    if (query.credentialType) filter.credentialType = query.credentialType;
    if (query.staffName) filter.staffName = { $regex: query.staffName, $options: 'i' };

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 200);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.credentialModel
        .find(filter)
        .sort({ expirationDate: 1, staffName: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.credentialModel.countDocuments(filter),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getCredentialById(id: string): Promise<StaffCredentialDocument> {
    const credential = await this.credentialModel.findById(id).exec();
    if (!credential) throw new NotFoundException('Credential not found');
    return credential;
  }

  async updateCredential(id: string, dto: UpdateCredentialDto): Promise<StaffCredentialDocument> {
    const updateData: Record<string, any> = { ...dto };
    if (dto.expirationDate) {
      updateData.status = this.computeCredentialStatus(dto.expirationDate);
    }
    const credential = await this.credentialModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!credential) throw new NotFoundException('Credential not found');
    return credential;
  }

  async deleteCredential(id: string): Promise<void> {
    const result = await this.credentialModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Credential not found');
  }
}
