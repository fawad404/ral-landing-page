import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { DealRoomService } from './deal-room.service';
import { RejectRequestDto } from './dto/reject-request.dto';
import { DealRoomStatus } from './schemas/deal-room.schema';

@ApiTags('Deal Room')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('deal-room')
export class DealRoomController {
  constructor(private readonly service: DealRoomService) {}

  @Post('request')
  @ApiOperation({ summary: 'Facility: Request deal room access' })
  requestAccess(@CurrentUser() user: any) {
    return this.service.requestAccess(user._id.toString());
  }

  @Get('my-request')
  @ApiOperation({ summary: 'Facility: Get own deal room access request status' })
  getMyRequest(@CurrentUser() user: any) {
    return this.service.findMyRequest(user._id.toString());
  }

  @Get('requests')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'status', required: false, enum: DealRoomStatus })
  @ApiOperation({ summary: 'Admin: List all deal room access requests' })
  findAll(@Query('status') status?: DealRoomStatus) {
    return this.service.findAll({ status });
  }

  @Patch('requests/:id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Approve a deal room access request' })
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.approve(id, user._id.toString());
  }

  @Patch('requests/:id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Reject a deal room access request' })
  reject(
    @Param('id') id: string,
    @Body() dto: RejectRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.service.reject(id, dto, user._id.toString());
  }
}
