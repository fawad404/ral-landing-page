import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Facility, FacilityDocument } from '../facilities/schemas/facility.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Facility.name) private facilityModel: Model<FacilityDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const isAdmin = dto.role === Role.ADMIN;

    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      isApproved: isAdmin,
    });

    // Auto-create a blank facility document for facility owners
    if (dto.role === Role.FACILITY) {
      const facilityName =
        dto.facilityName?.trim() ||
        `${dto.firstName ?? ''} ${dto.lastName ?? ''}`.trim() + "'s Facility";
      await this.facilityModel.create({
        ownerId: user._id,
        name: facilityName,
        capacity: 0,
        availabilityCount: 0,
        services: [],
      });
    }

    const token = this.signToken(user);
    return { token, user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password')
      .exec();

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (!user.isApproved) {
      throw new UnauthorizedException('Your account is pending admin approval. You will be able to log in once approved.');
    }

    await this.userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = this.signToken(user);
    return { token, user: this.sanitize(user) };
  }

  private signToken(user: UserDocument): string {
    return this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  private sanitize(user: UserDocument) {
    const obj = user.toObject();
    delete (obj as any).password;
    return obj;
  }

  async seedAdmin(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_SEED_EMAIL') ?? 'admin@ralconnect.com';
    const adminPassword = this.configService.get<string>('ADMIN_SEED_PASSWORD') ?? 'Admin@123456';

    const existing = await this.userModel.findOne({ role: Role.ADMIN }).exec();
    if (existing) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await this.userModel.create({
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      isApproved: true,
      isActive: true,
      firstName: 'Super',
      lastName: 'Admin',
    });

    console.log(`[Seed] Default admin created: ${adminEmail}`);
  }
}
