import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ComplianceService } from './compliance.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@ApiTags('Compliance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.FACILITY, Role.ADMIN)
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // ─── STATS ────────────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get compliance stats for a facility' })
  @ApiQuery({ name: 'facilityId', required: true })
  getStats(@Query('facilityId') facilityId: string) {
    return this.complianceService.getStats(facilityId);
  }

  // ─── TASKS ────────────────────────────────────────────────────────────────

  @Post('tasks')
  @ApiOperation({ summary: 'Create a compliance task' })
  createTask(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    return this.complianceService.createTask(dto, user._id.toString());
  }

  @Get('tasks')
  @ApiOperation({ summary: 'List compliance tasks for a facility' })
  @ApiQuery({ name: 'facilityId', required: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'assignedTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getTasks(
    @Query('facilityId') facilityId: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.complianceService.getTasks(facilityId, { status, priority, category, assignedTo, page, limit });
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get a compliance task by ID' })
  getTask(@Param('id') id: string) {
    return this.complianceService.getTaskById(id);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update a compliance task' })
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.complianceService.updateTask(id, dto);
  }

  @Patch('tasks/:id/complete')
  @ApiOperation({ summary: 'Mark a compliance task as complete' })
  completeTask(@Param('id') id: string, @CurrentUser() user: any) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
    return this.complianceService.completeTask(id, name);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete a compliance task' })
  deleteTask(@Param('id') id: string) {
    return this.complianceService.deleteTask(id);
  }

  // ─── INCIDENTS ────────────────────────────────────────────────────────────

  @Post('incidents')
  @ApiOperation({ summary: 'Log a compliance incident' })
  createIncident(@Body() dto: CreateIncidentDto, @CurrentUser() user: any) {
    return this.complianceService.createIncident(dto, user._id.toString());
  }

  @Get('incidents')
  @ApiOperation({ summary: 'List incidents for a facility' })
  @ApiQuery({ name: 'facilityId', required: true })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getIncidents(
    @Query('facilityId') facilityId: string,
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.complianceService.getIncidents(facilityId, { type, severity, status, page, limit });
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Get an incident by ID' })
  getIncident(@Param('id') id: string) {
    return this.complianceService.getIncidentById(id);
  }

  @Patch('incidents/:id')
  @ApiOperation({ summary: 'Update an incident' })
  updateIncident(@Param('id') id: string, @Body() dto: UpdateIncidentDto) {
    return this.complianceService.updateIncident(id, dto);
  }

  @Delete('incidents/:id')
  @ApiOperation({ summary: 'Delete an incident' })
  deleteIncident(@Param('id') id: string) {
    return this.complianceService.deleteIncident(id);
  }

  // ─── CREDENTIALS ──────────────────────────────────────────────────────────

  @Post('credentials')
  @ApiOperation({ summary: 'Add a staff credential' })
  createCredential(@Body() dto: CreateCredentialDto) {
    return this.complianceService.createCredential(dto);
  }

  @Get('credentials')
  @ApiOperation({ summary: 'List staff credentials for a facility' })
  @ApiQuery({ name: 'facilityId', required: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'credentialType', required: false })
  @ApiQuery({ name: 'staffName', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getCredentials(
    @Query('facilityId') facilityId: string,
    @Query('status') status?: string,
    @Query('credentialType') credentialType?: string,
    @Query('staffName') staffName?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.complianceService.getCredentials(facilityId, { status, credentialType, staffName, page, limit });
  }

  @Get('credentials/:id')
  @ApiOperation({ summary: 'Get a credential by ID' })
  getCredential(@Param('id') id: string) {
    return this.complianceService.getCredentialById(id);
  }

  @Patch('credentials/:id')
  @ApiOperation({ summary: 'Update a credential' })
  updateCredential(@Param('id') id: string, @Body() dto: UpdateCredentialDto) {
    return this.complianceService.updateCredential(id, dto);
  }

  @Delete('credentials/:id')
  @ApiOperation({ summary: 'Delete a credential' })
  deleteCredential(@Param('id') id: string) {
    return this.complianceService.deleteCredential(id);
  }
}
