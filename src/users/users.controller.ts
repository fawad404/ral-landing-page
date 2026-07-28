import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';
import { UpdateUserDto, ResetPasswordDto } from './dto/update-user.dto';

@ApiTags('Users (Admin)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  findAll(
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('isApproved') isApproved?: string,
  ) {
    return this.usersService.findAll({
      role,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      isApproved: isApproved !== undefined ? isApproved === 'true' : undefined,
    });
  }

  @Get('activity')
  @ApiOperation({ summary: 'Track user login activity (most recent logins)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getActivity(@Query('limit') limit?: number) {
    return this.usersService.getActivity(limit ? Number(limit) : 20);
  }

  @Get('pending-approval')
  @ApiOperation({ summary: 'List users awaiting admin approval' })
  getPendingApproval() {
    return this.usersService.getPendingApproval();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user profile' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/reset-password')
  @ApiOperation({ summary: 'Reset a user password (returns temporary password)' })
  @ApiResponse({ status: 200, description: 'Returns { temporaryPassword }' })
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(id, dto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user account' })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user account' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a user account' })
  approve(@Param('id') id: string) {
    return this.usersService.approve(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
