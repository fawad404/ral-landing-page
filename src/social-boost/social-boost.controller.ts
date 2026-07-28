import {
  BadRequestException,
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
// ── Disk storage (commented out – kept for local fallback if needed) ──────────
// import { diskStorage } from 'multer';
// import * as path from 'path';
// import * as fs from 'fs';
//
// const socialBoostStorage = diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(process.cwd(), 'uploads', 'social-boost');
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
//   },
// });
// ─────────────────────────────────────────────────────────────────────────────
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { SocialBoostService } from './social-boost.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SocialBoostStatus } from './schemas/social-boost.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const mediaFileFilter = (req: any, file: any, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|mp4|mov)$/)) {
    return cb(new BadRequestException('Only image or video files are allowed'), false);
  }
  cb(null, true);
};

@ApiTags('Social Boost')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('social-boost')
export class SocialBoostController {
  constructor(
    private readonly service: SocialBoostService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: mediaFileFilter,
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        caption: { type: 'string' },
        category: { type: 'string' },
        channel: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['caption', 'category', 'channel'],
    },
  })
  @ApiOperation({ summary: 'Facility: Submit a social boost post for admin review' })
  async submit(
    @Body() dto: CreateSubmissionDto,
    @UploadedFile() file: any,
    @CurrentUser() user: any,
  ) {
    let fileUrl: string | undefined;

    if (file) {
      // Upload to Cloudinary under ral-connect/social-boost/
      const result = await this.cloudinaryService.uploadBuffer(file.buffer, 'social-boost');
      fileUrl = result.secure_url;
    }

    return this.service.submit(dto, fileUrl, user._id.toString());
  }

  @Get('my')
  @ApiOperation({ summary: 'Facility: Get own social boost submissions' })
  getMy(@CurrentUser() user: any) {
    return this.service.findMy(user._id.toString());
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'status', required: false, enum: SocialBoostStatus })
  @ApiOperation({ summary: 'Admin: List all social boost submissions' })
  findAll(@Query('status') status?: SocialBoostStatus) {
    return this.service.findAll({ status });
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update submission status (approve/post/reject)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.service.updateStatus(id, dto, user._id.toString());
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Facility: Delete own submission (admin can delete any)' })
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    // ── Disk storage cleanup (commented out – Cloudinary handles deletion now) ─
    // const filename = path.basename(submission.fileUrl);
    // const filePath = path.join(process.cwd(), 'uploads', 'social-boost', filename);
    // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    // ──────────────────────────────────────────────────────────────────────────
    return this.service.delete(id, user._id.toString(), user.role);
  }
}
