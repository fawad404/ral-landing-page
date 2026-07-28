import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailabilityBroadcastController } from './availability-broadcast.controller';
import { AvailabilityBroadcastService } from './availability-broadcast.service';
import { AvailabilityRequest, AvailabilityRequestSchema } from './schemas/availability-request.schema';
import { AvailabilityResponse, AvailabilityResponseSchema } from './schemas/availability-response.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AvailabilityRequest.name, schema: AvailabilityRequestSchema },
      { name: AvailabilityResponse.name, schema: AvailabilityResponseSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AvailabilityBroadcastController],
  providers: [AvailabilityBroadcastService],
})
export class AvailabilityBroadcastModule {}
