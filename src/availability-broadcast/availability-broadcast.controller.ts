import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AvailabilityBroadcastService } from './availability-broadcast.service';
import { SubmitRequestDto } from './dto/submit-request.dto';
import { SubmitInterestedDto, SubmitResponseDto } from './dto/submit-response.dto';

@Controller('availability-broadcast')
export class AvailabilityBroadcastController {
  constructor(private readonly service: AvailabilityBroadcastService) {}

  @Post('request')
  submitRequest(@Body() dto: SubmitRequestDto) {
    return this.service.submitRequest(dto);
  }

  @Get('request/:requestId')
  getRequest(@Param('requestId') requestId: string) {
    return this.service.getRequest(requestId);
  }

  @Post('respond/:requestId')
  recordResponse(
    @Param('requestId') requestId: string,
    @Body() dto: SubmitResponseDto,
  ) {
    return this.service.recordResponse(requestId, dto);
  }

  @Post('respond/:requestId/interested')
  recordInterestedResponse(
    @Param('requestId') requestId: string,
    @Body() dto: SubmitInterestedDto,
  ) {
    return this.service.recordInterestedResponse(requestId, dto);
  }
}
