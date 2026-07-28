import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CaregiversService } from './caregivers.service';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateCaregiverDto } from './dto/update-caregiver.dto';

@ApiTags('Caregivers')
@Controller('caregivers')
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  // ── PUBLIC: browse active caregivers (no auth — public landing page directory) ──
  @Get('visible')
  @ApiOperation({ summary: 'Public: Browse active caregivers with pagination' })
  @ApiQuery({ name: 'workArea', required: false })
  @ApiQuery({ name: 'availableNow', required: false })
  @ApiQuery({ name: 'shift', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findVisible(
    @Query('workArea') workArea?: string,
    @Query('availableNow') availableNow?: string,
    @Query('shift') shift?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.caregiversService.findVisible({ workArea, availableNow, shift, search, page, limit });
  }

  // ── Admin: list all caregivers ────────────────────────────────────────────
  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: List all caregivers' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'certification', required: false })
  @ApiQuery({ name: 'availability', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('status') status?: string,
    @Query('city') city?: string,
    @Query('certification') certification?: string,
    @Query('availability') availability?: string,
    @Query('search') search?: string,
  ) {
    return this.caregiversService.findAll({ status, city, certification, availability, search });
  }

  // ── PUBLIC: caregiver self-apply / update via confirmUpdate ──────────────
  @Post('apply')
  @ApiOperation({ summary: 'Public: Caregiver submits application or updates existing profile' })
  apply(@Body() dto: CreateCaregiverDto) {
    return this.caregiversService.apply(dto);
  }

  // ── Admin: create caregiver ───────────────────────────────────────────────
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Add a caregiver to the directory' })
  create(@Body() dto: CreateCaregiverDto) {
    return this.caregiversService.create(dto);
  }

  // ── Admin: approve ────────────────────────────────────────────────────────
  @Patch(':id/approve')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Approve a caregiver application' })
  approve(@Param('id') id: string) {
    return this.caregiversService.approve(id);
  }

  // ── Admin: reject ─────────────────────────────────────────────────────────
  @Patch(':id/reject')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Reject a caregiver application' })
  reject(@Param('id') id: string) {
    return this.caregiversService.reject(id);
  }

  // ── Admin: update caregiver ───────────────────────────────────────────────
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update a caregiver' })
  update(@Param('id') id: string, @Body() dto: UpdateCaregiverDto) {
    return this.caregiversService.update(id, dto);
  }

  // ── Admin: toggle visibility ──────────────────────────────────────────────
  @Patch(':id/visibility')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Toggle caregiver visibility' })
  toggleVisibility(@Param('id') id: string) {
    return this.caregiversService.toggleVisibility(id);
  }

  // ── Admin: delete caregiver ───────────────────────────────────────────────
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Remove a caregiver' })
  delete(@Param('id') id: string) {
    return this.caregiversService.delete(id);
  }

  // ── Get by ID ─────────────────────────────────────────────────────────────
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get caregiver by ID' })
  findOne(@Param('id') id: string) {
    return this.caregiversService.findById(id);
  }
}
