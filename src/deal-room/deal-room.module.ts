import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealRoomRequest, DealRoomRequestSchema } from './schemas/deal-room.schema';
import { DealRoomListing, DealRoomListingSchema } from './schemas/deal-room-listing.schema';
import { DealRoomService } from './deal-room.service';
import { DealRoomController } from './deal-room.controller';
import { DealRoomListingService } from './deal-room-listing.service';
import { DealRoomListingController } from './deal-room-listing.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { FacilitiesModule } from '../facilities/facilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DealRoomRequest.name, schema: DealRoomRequestSchema },
      { name: DealRoomListing.name, schema: DealRoomListingSchema },
    ]),
    NotificationsModule,
    FacilitiesModule,
  ],
  controllers: [DealRoomController, DealRoomListingController],
  providers: [DealRoomService, DealRoomListingService],
})
export class DealRoomModule {}
