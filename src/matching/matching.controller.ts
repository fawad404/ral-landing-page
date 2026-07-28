import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { MatchingService } from './matching.service';
import { ManualAssignDto } from './dto/manual-assign.dto';
import { UpdateAdminConfigDto } from '../admin/dto/update-admin-config.dto';

@ApiTags('Matching Engine')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('run/:inquiryId')
  @ApiOperation({
    summary: 'Run the matching algorithm for an inquiry',
    description:
      'Scores all approved+available facilities against the inquiry requirements using configurable weights. Stores matchReason on the inquiry.',
  })
  @ApiResponse({ status: 201, description: 'Returns matched facilities with scores and reasons.' })
  runMatching(@Param('inquiryId') inquiryId: string) {
    return this.matchingService.runMatching(inquiryId);
  }

  @Post(':inquiryId/manual-assign')
  @ApiOperation({
    summary: 'Manual override: assign a specific facility to an inquiry',
    description:
      'Bypasses the algorithm. The assigned facility is appended to existing matches and flagged as a manual override in matchHistory.',
  })
  manualAssign(
    @Param('inquiryId') inquiryId: string,
    @Body() dto: ManualAssignDto,
  ) {
    return this.matchingService.manualAssign(inquiryId, dto);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get current matching configuration (weights, max results)' })
  getConfig() {
    return this.matchingService.getConfig();
  }
}
