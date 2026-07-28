import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto, ResetPasswordDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(filters?: { role?: string; isActive?: boolean; isApproved?: boolean }) {
    const query: Record<string, any> = {};
    if (filters?.role) query.role = filters.role;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;
    if (filters?.isApproved !== undefined) query.isApproved = filters.isApproved;
    return this.userModel.find(query).select('-password').sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('-password').exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    if (dto.password) {
      (dto as any).password = await bcrypt.hash(dto.password, 12);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async resetPassword(id: string, dto: ResetPasswordDto): Promise<{ temporaryPassword: string }> {
    const newPassword = dto.newPassword ?? this.generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const user = await this.userModel.findByIdAndUpdate(id, { password: hashedPassword }).exec();
    if (!user) throw new NotFoundException('User not found');
    return { temporaryPassword: newPassword };
  }

  async activate(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive: true }, { new: true })
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deactivate(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async approve(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isApproved: true }, { new: true })
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getActivity(limit = 20) {
    return this.userModel
      .find({ lastLogin: { $ne: null } })
      .select('email role firstName lastName lastLogin isActive isApproved')
      .sort({ lastLogin: -1 })
      .limit(limit)
      .exec();
  }

  async getPendingApproval() {
    return this.userModel
      .find({ isApproved: false, isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }

  private generatePassword(): string {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefghjkmnpqrstwxyz23456789@#$%';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}
