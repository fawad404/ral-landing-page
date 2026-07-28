import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminConfig, AdminConfigDocument } from './schemas/admin-config.schema';
import { UpdateAdminConfigDto } from './dto/update-admin-config.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(AdminConfig.name)
    private adminConfigModel: Model<AdminConfigDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureConfigExists();
  }

  private async ensureConfigExists(): Promise<void> {
    const existing = await this.adminConfigModel.findOne({ configKey: 'default' }).exec();
    if (!existing) {
      await this.adminConfigModel.create({
        configKey: 'default',
        categoryLimits: {},
        defaultCategoryLimit: 5,
        matchingWeights: { distance: 0.4, services: 0.4, budget: 0.2 },
        maxMatchResults: 10,
      });
    }
  }

  async getConfig(): Promise<AdminConfigDocument> {
    const config = await this.adminConfigModel.findOne({ configKey: 'default' }).exec();
    if (!config) {
      await this.ensureConfigExists();
      return (await this.adminConfigModel.findOne({ configKey: 'default' }).exec())!;
    }
    return config;
  }

  async updateConfig(dto: UpdateAdminConfigDto): Promise<AdminConfigDocument> {
    const updateFields: Record<string, any> = {};

    if (dto.categoryLimits !== undefined) updateFields.categoryLimits = dto.categoryLimits;
    if (dto.defaultCategoryLimit !== undefined) updateFields.defaultCategoryLimit = dto.defaultCategoryLimit;
    if (dto.maxMatchResults !== undefined) updateFields.maxMatchResults = dto.maxMatchResults;

    if (dto.matchingWeights) {
      const current = await this.getConfig();
      updateFields.matchingWeights = {
        ...current.matchingWeights,
        ...dto.matchingWeights,
      };
    }

    return this.adminConfigModel
      .findOneAndUpdate(
        { configKey: 'default' },
        { $set: updateFields },
        { new: true, upsert: true },
      )
      .exec();
  }

  async getPartnerLimitForCategory(category: string): Promise<number> {
    const config = await this.getConfig();
    return config.categoryLimits[category] ?? config.defaultCategoryLimit;
  }

  async getMatchingWeights() {
    const config = await this.getConfig();
    return config.matchingWeights;
  }

  async getMaxMatchResults(): Promise<number> {
    const config = await this.getConfig();
    return config.maxMatchResults;
  }
}
