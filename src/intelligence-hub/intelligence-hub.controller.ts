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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { IntelligenceHubService } from './intelligence-hub.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { QueryContentDto } from './dto/query-content.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';
import { QueryScanLogDto } from './dto/query-scan-log.dto';

@ApiTags('Intelligence Hub (Admin)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('intelligence-hub')
export class IntelligenceHubController {
  constructor(private readonly service: IntelligenceHubService) {}

  // ─── STATS & CATEGORIES ───────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get content stats (totals by status)' })
  getStats() {
    return this.service.getStats();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get list of all content categories' })
  getCategories() {
    return this.service.getCategories();
  }

  // ─── MANUAL INGEST ────────────────────────────────────────────────────────

  @Post('ingest')
  @ApiOperation({ summary: 'Manually trigger feed ingestion across all active sources' })
  triggerIngest() {
    return this.service.triggerIngest();
  }

  // ─── SCAN LOGS ────────────────────────────────────────────────────────────

  @Get('scan-logs')
  @ApiOperation({ summary: 'List scan history — which sources were scanned, which failed, which produced new content' })
  getScanLogs(@Query() query: QueryScanLogDto) {
    return this.service.getScanLogs(query);
  }

  // ─── SOURCES ──────────────────────────────────────────────────────────────

  @Get('sources')
  @ApiOperation({ summary: 'List all RSS sources' })
  getSources() {
    return this.service.getSources();
  }

  @Post('sources')
  @ApiOperation({ summary: 'Add a new RSS source' })
  createSource(@Body() dto: CreateSourceDto) {
    return this.service.createSource(dto);
  }

  @Patch('sources/:id')
  @ApiOperation({ summary: 'Update a source (edit, activate/deactivate)' })
  updateSource(@Param('id') id: string, @Body() dto: UpdateSourceDto) {
    return this.service.updateSource(id, dto);
  }

  @Delete('sources/:id')
  @ApiOperation({ summary: 'Delete a source' })
  deleteSource(@Param('id') id: string) {
    return this.service.deleteSource(id);
  }

  // ─── CONTENT ITEMS ────────────────────────────────────────────────────────

  @Get('items')
  @ApiOperation({ summary: 'List content items with filtering and pagination' })
  getItems(@Query() query: QueryContentDto) {
    return this.service.getContentItems(query);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get a single content item' })
  getItem(@Param('id') id: string) {
    return this.service.getContentItemById(id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update content item (edit AI fields, approve/reject, mark priority)' })
  updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateContentItemDto,
    @CurrentUser() user: any,
  ) {
    return this.service.updateContentItem(id, dto, user?.email);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a content item' })
  deleteItem(@Param('id') id: string) {
    return this.service.deleteContentItem(id);
  }

  @Post('items/:id/reprocess')
  @ApiOperation({ summary: 'Re-run AI processing on a content item' })
  reprocessItem(@Param('id') id: string) {
    return this.service.reprocessItem(id);
  }
}
