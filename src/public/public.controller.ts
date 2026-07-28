import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { PublicInquiryDto } from './dto/public-inquiry.dto';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post('inquiry')
  @HttpCode(201)
  @ApiOperation({ summary: 'Submit a care placement inquiry (no auth required)' })
  submitInquiry(@Body() dto: PublicInquiryDto) {
    return this.publicService.submitInquiry(dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search approved facilities (no auth required)' })
  @ApiQuery({ name: 'zipCode', required: false })
  @ApiQuery({ name: 'services', required: false, description: 'Comma-separated list of services' })
  @ApiQuery({ name: 'budgetMin', required: false, type: Number })
  @ApiQuery({ name: 'budgetMax', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max 50' })
  searchFacilities(
    @Query('zipCode') zipCode?: string,
    @Query('services') services?: string,
    @Query('budgetMin') budgetMin?: string,
    @Query('budgetMax') budgetMax?: string,
    @Query('limit') limit?: string,
  ) {
    return this.publicService.searchFacilities({
      zipCode,
      services,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
