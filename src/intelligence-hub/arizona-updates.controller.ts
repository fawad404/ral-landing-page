import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { IntelligenceHubService } from './intelligence-hub.service';

// Owner-facing, read-only view of the Intelligence Hub: only items an admin has
// approved (approved / scheduled / published), newest first.
@ApiTags('Arizona Updates (Facility)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.FACILITY, Role.ADMIN)
@Controller('arizona-updates')
export class ArizonaUpdatesController {
  constructor(private readonly service: IntelligenceHubService) {}

  @Get()
  @ApiOperation({ summary: 'List admin-approved Arizona updates for facility owners' })
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.getOwnerUpdates(Number(page) || 1, Number(limit) || 20);
  }
}
