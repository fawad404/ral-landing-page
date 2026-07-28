import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DealRoomListing,
  DealRoomListingDocument,
} from './schemas/deal-room-listing.schema';
import {
  DealRoomRequest,
  DealRoomRequestDocument,
  DealRoomStatus,
} from './schemas/deal-room.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { FacilitiesService } from '../facilities/facilities.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class DealRoomListingService {
  constructor(
    @InjectModel(DealRoomListing.name) private listingModel: Model<DealRoomListingDocument>,
    @InjectModel(DealRoomRequest.name) private requestModel: Model<DealRoomRequestDocument>,
    private readonly facilitiesService: FacilitiesService,
  ) {}

  /** Check that the user has an approved deal room request */
  private async assertApproved(userId: string): Promise<void> {
    const facilities = await this.facilitiesService.findByOwner(userId);
    if (!facilities.length) throw new ForbiddenException('No facility found for this account');

    const facilityId = facilities[0]._id;
    const request = await this.requestModel
      .findOne({ facilityId, status: DealRoomStatus.APPROVED })
      .exec();

    if (!request) {
      throw new ForbiddenException('Deal Room access not approved. Please request access first.');
    }
  }

  async create(dto: CreateListingDto, imageUrl: string | undefined, imagePublicId: string | undefined, userId: string): Promise<DealRoomListingDocument> {
    await this.assertApproved(userId);

    const facilities = await this.facilitiesService.findByOwner(userId);
    const facility = facilities[0];

    return this.listingModel.create({
      ...dto,
      imageUrl,
      imagePublicId,
      facilityId: facility._id,
      facilityName: facility.name,
      ownerId: userId,
    });
  }

  async findAll(userId: string): Promise<DealRoomListingDocument[]> {
    await this.assertApproved(userId);
    return this.listingModel
      .find({ isActive: true })
      .populate('ownerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findMy(userId: string): Promise<DealRoomListingDocument[]> {
    const facilities = await this.facilitiesService.findByOwner(userId);
    if (!facilities.length) return [];
    return this.listingModel
      .find({ facilityId: facilities[0]._id })
      .sort({ createdAt: -1 })
      .exec();
  }

  async delete(id: string, userId: string, userRole: Role): Promise<void> {
    const listing = await this.listingModel.findById(id).exec();
    if (!listing) throw new NotFoundException('Listing not found');

    if (userRole !== Role.ADMIN && listing.ownerId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this listing');
    }

    await this.listingModel.findByIdAndDelete(id).exec();
  }
}
