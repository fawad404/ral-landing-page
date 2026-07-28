import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AdminService } from './admin.service';
import { UpdateAdminConfigDto } from './dto/update-admin-config.dto';

@ApiTags('Admin Config')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/config')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get admin platform configuration' })
  getConfig() {
    return this.adminService.getConfig();
  }

  @Patch()
  @ApiOperation({ summary: 'Update admin platform configuration (category limits, matching weights, etc.)' })
  updateConfig(@Body() dto: UpdateAdminConfigDto) {
    return this.adminService.updateConfig(dto);
  }
}
