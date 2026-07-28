import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DealRoomListingService } from './deal-room-listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
  cb(null, true);
};

@ApiTags('Deal Room – Listings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('deal-room/listings')
export class DealRoomListingController {
  constructor(
    private readonly service: DealRoomListingService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
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
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: ['equipment', 'real-estate', 'supplies', 'other'] },
        condition: { type: 'string', enum: ['new', 'used', 'as-is'] },
        price: { type: 'number' },
        priceNegotiable: { type: 'boolean' },
        contactEmail: { type: 'string' },
        contactPhone: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['title', 'description', 'type'],
    },
  })
  @ApiOperation({ summary: 'Approved member: Create a deal room listing' })
  async create(
    @Body() dto: CreateListingDto,
    @UploadedFile() image: any,
    @CurrentUser() user: any,
  ) {
    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (image) {
      const result = await this.cloudinaryService.uploadBuffer(image.buffer, 'deal-room');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    return this.service.create(dto, imageUrl, imagePublicId, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Approved member: Browse all active listings' })
  findAll(@CurrentUser() user: any) {
    return this.service.findAll(user._id.toString());
  }

  @Get('my')
  @ApiOperation({ summary: 'Get own listings' })
  findMy(@CurrentUser() user: any) {
    return this.service.findMy(user._id.toString());
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete own listing (admin can delete any)' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    // Get listing to delete image from Cloudinary if exists
    const listings = await this.service.findMy(user._id.toString());
    const listing = listings.find((l) => (l._id as any).toString() === id);
    if (listing?.imagePublicId) {
      await this.cloudinaryService.deleteByPublicId(listing.imagePublicId);
    }
    return this.service.delete(id, user._id.toString(), user.role);
  }
}
