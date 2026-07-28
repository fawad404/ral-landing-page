import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ReportsService } from './reports.service';

@ApiTags('Reports & Analytics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Admin Dashboard: aggregated platform statistics',
    description:
      'Returns totals for facilities (active/inactive/flagged), inquiries (by status), partners, and recent activity.',
  })
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('facilities')
  @ApiOperation({ summary: 'Facility statistics (by status, services, availability)' })
  getFacilityStats() {
    return this.reportsService.getFacilityStats();
  }

  @Get('inquiries')
  @ApiOperation({ summary: 'Inquiry statistics (placement rate, by status, 30-day trend)' })
  getInquiryStats() {
    return this.reportsService.getInquiryStats();
  }

  @Get('partners')
  @ApiOperation({ summary: 'Partner performance stats (by category, visibility)' })
  getPartnerStats() {
    return this.reportsService.getPartnerStats();
  }
}
