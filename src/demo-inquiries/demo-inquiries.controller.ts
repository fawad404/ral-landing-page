import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DemoInquiriesService } from './demo-inquiries.service';
import { CreateDemoInquiryDto } from './dto/create-demo-inquiry.dto';
import { UpdateDemoInquiryDto } from './dto/update-demo-inquiry.dto';
import { DemoInquiryType } from './schemas/demo-inquiry.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('demo-inquiries')
export class DemoInquiriesController {
  constructor(private readonly demoInquiriesService: DemoInquiriesService) {}

  @Post()
  create(@Body() dto: CreateDemoInquiryDto) {
    return this.demoInquiriesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(
    @Query('type') type?: DemoInquiryType,
    @Query('status') status?: string,
  ) {
    return this.demoInquiriesService.findAll(type, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findById(@Param('id') id: string) {
    return this.demoInquiriesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateDemoInquiryDto) {
    return this.demoInquiriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.demoInquiriesService.delete(id);
  }
}
