import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { ComplianceTask, ComplianceTaskSchema } from './schemas/compliance-task.schema';
import { ComplianceIncident, ComplianceIncidentSchema } from './schemas/compliance-incident.schema';
import { StaffCredential, StaffCredentialSchema } from './schemas/staff-credential.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ComplianceTask.name, schema: ComplianceTaskSchema },
      { name: ComplianceIncident.name, schema: ComplianceIncidentSchema },
      { name: StaffCredential.name, schema: StaffCredentialSchema },
    ]),
  ],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
