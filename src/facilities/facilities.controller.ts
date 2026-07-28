import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
// ── Disk storage (commented out – kept for local fallback if needed) ──────────
// import { diskStorage } from 'multer';
// import * as path from 'path';
// import * as fs from 'fs';
//
// const photoStorage = diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(process.cwd(), 'uploads', 'facilities', req.params.id);
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
//     cb(null, unique);
//   },
// });
// ─────────────────────────────────────────────────────────────────────────────
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto, UpdateAvailabilityDto } from './dto/update-facility.dto';
import { FacilityStatus } from './schemas/facility.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('Only image files are allowed (jpg, jpeg, png, gif, webp)'), false);
  }
  cb(null, true);
};

@ApiTags('Facilities')
@Controller('facilities')
export class FacilitiesController {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FACILITY, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new facility listing' })
  create(@Body() dto: CreateFacilityDto, @CurrentUser() user: any) {
    return this.facilitiesService.create(dto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'List facilities (public; filters optional)' })
  @ApiQuery({ name: 'status', required: false, enum: FacilityStatus })
  @ApiQuery({ name: 'isVisible', required: false, type: Boolean })
  @ApiQuery({ name: 'isFlagged', required: false, type: Boolean })
  @ApiQuery({ name: 'services', required: false, type: String })
  @ApiQuery({ name: 'zipCode', required: false, type: String })
  findAll(
    @Query('status') status?: FacilityStatus,
    @Query('isVisible') isVisible?: string,
    @Query('isFlagged') isFlagged?: string,
    @Query('services') services?: string,
    @Query('zipCode') zipCode?: string,
  ) {
    return this.facilitiesService.findAll({
      status,
      isVisible: isVisible !== undefined ? isVisible === 'true' : undefined,
      isFlagged: isFlagged !== undefined ? isFlagged === 'true' : undefined,
      services,
      zipCode,
    });
  }

  @Get('flagged')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get facilities flagged for inactivity (>24h no update)' })
  getFlagged() {
    return this.facilitiesService.getFlagged();
  }

  @Get('my')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get facilities owned by the logged-in user' })
  getMyFacilities(@CurrentUser() user: any) {
    return this.facilitiesService.findByOwner(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a facility by ID' })
  findOne(@Param('id') id: string) {
    return this.facilitiesService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update facility profile (admin or owner)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFacilityDto,
    @CurrentUser() user: any,
  ) {
    return this.facilitiesService.update(id, dto, user._id.toString(), user.role);
  }

  @Patch(':id/availability')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update facility availability count (owner or admin)' })
  updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
    @CurrentUser() user: any,
  ) {
    return this.facilitiesService.updateAvailability(id, dto, user._id.toString(), user.role);
  }

  @Post(':id/photos')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        label: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a facility photo to Cloudinary (ral-connect/facilities)' })
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body('label') label: string,
    @CurrentUser() user: any,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const result = await this.cloudinaryService.uploadBuffer(file.buffer, 'facilities');
    // result.secure_url  → Cloudinary CDN URL
    // result.public_id   → used later for deletion

    return this.facilitiesService.addPhoto(
      id,
      result.secure_url,
      result.public_id,
      label,
      user._id.toString(),
      user.role,
    );
  }

  @Delete(':id/photos')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a facility photo from Cloudinary (pass publicId as query param)' })
  async removePhoto(
    @Param('id') id: string,
    @Query('publicId') publicId: string,
    @CurrentUser() user: any,
  ) {
    if (!publicId) throw new BadRequestException('publicId query param is required');
    await this.cloudinaryService.deleteByPublicId(publicId);
    return this.facilitiesService.removePhoto(id, publicId, user._id.toString(), user.role);
  }

  @Patch(':id/approve')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Approve a facility listing' })
  approve(@Param('id') id: string) {
    return this.facilitiesService.approve(id);
  }

  @Patch(':id/reject')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Reject a facility listing' })
  reject(@Param('id') id: string) {
    return this.facilitiesService.reject(id);
  }

  @Patch(':id/activate')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Activate (make visible) a facility listing' })
  activate(@Param('id') id: string) {
    return this.facilitiesService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Deactivate (hide) a facility listing' })
  deactivate(@Param('id') id: string) {
    return this.facilitiesService.deactivate(id);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete a facility' })
  delete(@Param('id') id: string) {
    return this.facilitiesService.delete(id);
  }
}
