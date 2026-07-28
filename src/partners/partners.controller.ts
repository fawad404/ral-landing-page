import {
  Body, Controller, Delete, Get, Param, Patch, Post,
  Query, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@ApiTags('Partners (Vendors)')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  // ── Vendor: create own profile ────────────────────────────────────────────
  @Post('my')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @ApiOperation({ summary: 'Vendor: Create my partner profile' })
  createMy(@Body() dto: CreatePartnerDto, @CurrentUser() user: any) {
    return this.partnersService.createByVendor(dto, user._id.toString());
  }

  // ── Vendor: get own profile ────────────────────────────────────────────────
  @Get('my')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @ApiOperation({ summary: 'Vendor: Get my partner profile' })
  findMy(@CurrentUser() user: any) {
    return this.partnersService.findByUserId(user._id.toString());
  }

  // ── Vendor: update own profile ────────────────────────────────────────────
  @Patch('my/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @ApiOperation({ summary: 'Vendor: Update my partner profile' })
  updateMy(@Param('id') id: string, @Body() dto: UpdatePartnerDto, @CurrentUser() user: any) {
    return this.partnersService.updateByVendor(id, dto, user._id.toString());
  }

  // ── Vendor: upload logo ───────────────────────────────────────────────────
  @Post('my/:id/logo')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Vendor: Upload partner logo' })
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.partnersService.uploadLogo(id, file.buffer, user._id.toString());
  }

  // ── Admin: list all partners ──────────────────────────────────────────────
  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiOperation({ summary: 'Admin: List all partner profiles' })
  findAll(@Query('status') status?: string, @Query('category') category?: string) {
    return this.partnersService.findAll({ status, category });
  }

  // ── Admin: approve ────────────────────────────────────────────────────────
  @Patch(':id/approve')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Approve a partner profile' })
  approve(@Param('id') id: string) {
    return this.partnersService.approve(id);
  }

  // ── Admin: reject ─────────────────────────────────────────────────────────
  @Patch(':id/reject')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Reject a partner profile' })
  reject(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.partnersService.reject(id, reason);
  }

  // ── Admin: toggle visibility ──────────────────────────────────────────────
  @Patch(':id/visibility')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Toggle partner visibility' })
  toggleVisibility(@Param('id') id: string) {
    return this.partnersService.toggleVisibility(id);
  }

  // ── Admin: update (category, orderWeight) ────────────────────────────────
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update partner details' })
  adminUpdate(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.partnersService.adminUpdate(id, body);
  }

  // ── Admin: delete ─────────────────────────────────────────────────────────
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Remove a partner' })
  delete(@Param('id') id: string) {
    return this.partnersService.delete(id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all partner categories' })
  getCategories() {
    return this.partnersService.getCategories();
  }

  // ── Facility/any auth: get visible partners only ──────────────────────────
  @Get('visible')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Any authenticated user: List visible partners for Support Network' })
  findVisible() {
    return this.partnersService.findVisible();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a partner by ID' })
  findOne(@Param('id') id: string) {
    return this.partnersService.findById(id);
  }
}
