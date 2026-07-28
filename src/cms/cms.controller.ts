import {
  Body,
  Controller,
  Delete,
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
import { CmsService } from './cms.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceType } from './schemas/resource.schema';

@ApiTags('CMS (Content)')
@Controller('cms/resources')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Create a new resource (blog/guidance/directory)' })
  create(@Body() dto: CreateResourceDto, @CurrentUser() user: any) {
    return this.cmsService.create(dto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'List published resources (public)' })
  @ApiQuery({ name: 'type', required: false, enum: ResourceType })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean })
  @ApiQuery({ name: 'tag', required: false })
  findAll(
    @Query('type') type?: ResourceType,
    @Query('isPublished') isPublished?: string,
    @Query('tag') tag?: string,
  ) {
    return this.cmsService.findAll({
      type,
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
      tag,
    });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a published resource by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a resource by ID' })
  findOne(@Param('id') id: string) {
    return this.cmsService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update a resource' })
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.cmsService.update(id, dto);
  }

  @Patch(':id/publish')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Toggle publish/unpublish a resource' })
  togglePublish(@Param('id') id: string) {
    return this.cmsService.togglePublish(id);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete a resource' })
  delete(@Param('id') id: string) {
    return this.cmsService.delete(id);
  }
}
