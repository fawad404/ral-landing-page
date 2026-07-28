import { Injectable, NotFoundException } from '@nestjs/common';
import { FacilitiesService } from '../facilities/facilities.service';
import { InquiriesService } from '../inquiries/inquiries.service';
import { AdminService } from '../admin/admin.service';
import { FacilityDocument } from '../facilities/schemas/facility.schema';
import { ManualAssignDto } from './dto/manual-assign.dto';

interface FacilityScore {
  facility: FacilityDocument;
  score: number;
  reasons: string[];
}

@Injectable()
export class MatchingService {
  constructor(
    private facilitiesService: FacilitiesService,
    private inquiriesService: InquiriesService,
    private adminService: AdminService,
  ) {}

  async runMatching(inquiryId: string) {
    const inquiry = await this.inquiriesService.findById(inquiryId);
    const weights = await this.adminService.getMatchingWeights();
    const maxResults = await this.adminService.getMaxMatchResults();

    const facilities = await this.facilitiesService.findApprovedWithAvailability();
    if (facilities.length === 0) {
      return { message: 'No available facilities found', matches: [] };
    }

    const scores: FacilityScore[] = [];

    for (const facility of facilities) {
      const reasons: string[] = [];
      let rawScore = 0;

      // --- Location / Distance Score ---
      const reqZip = inquiry.requirements?.zipCode;
      const facZip = facility.address?.zipCode;
      if (reqZip && facZip) {
        if (reqZip === facZip) {
          rawScore += weights.distance;
          reasons.push(`Exact zip code match (${facZip})`);
        } else if (reqZip.substring(0, 3) === facZip.substring(0, 3)) {
          rawScore += weights.distance * 0.5;
          reasons.push(`Nearby area match (zip prefix: ${facZip.substring(0, 3)})`);
        }
      } else if (!reqZip) {
        rawScore += weights.distance * 0.3;
        reasons.push('No location preference specified');
      }

      // --- Services Score ---
      const reqServices: string[] = inquiry.requirements?.services ?? [];
      const facServices: string[] = facility.services ?? [];
      if (reqServices.length > 0 && facServices.length > 0) {
        const normalizeService = (s: string) => s.toLowerCase().trim();
        const reqNorm = reqServices.map(normalizeService);
        const facNorm = facServices.map(normalizeService);
        const matchedServices = reqNorm.filter((s) =>
          facNorm.some((fs) => fs.includes(s) || s.includes(fs)),
        );
        const serviceScore = matchedServices.length / reqServices.length;
        rawScore += weights.services * serviceScore;
        if (matchedServices.length > 0) {
          reasons.push(
            `Matched ${matchedServices.length}/${reqServices.length} required services: ${matchedServices.join(', ')}`,
          );
        }
      } else if (reqServices.length === 0) {
        rawScore += weights.services * 0.5;
        reasons.push('No specific services required');
      }

      // --- Budget Score ---
      const reqBudget = inquiry.requirements?.budget;
      const facPricing = facility.pricing;
      if (reqBudget && facPricing && facPricing.min !== undefined && facPricing.max !== undefined) {
        const reqMin = reqBudget.min ?? 0;
        const reqMax = reqBudget.max ?? Number.MAX_SAFE_INTEGER;
        const priceMin = facPricing.min ?? 0;
        const priceMax = facPricing.max ?? 0;

        if (priceMin <= reqMax && priceMax >= reqMin) {
          rawScore += weights.budget;
          reasons.push(`Pricing within budget range ($${priceMin}–$${priceMax})`);
        } else if (priceMin <= reqMax * 1.1) {
          rawScore += weights.budget * 0.5;
          reasons.push(`Pricing slightly above budget ($${priceMin}–$${priceMax})`);
        }
      } else {
        rawScore += weights.budget * 0.3;
        reasons.push('No budget constraints applied');
      }

      // --- Availability bonus ---
      if (facility.availabilityCount > 0) {
        rawScore *= 1 + Math.min(facility.availabilityCount / 10, 0.2);
        reasons.push(`${facility.availabilityCount} bed(s)/room(s) available`);
      }

      if (reasons.length > 0) {
        scores.push({ facility, score: Math.min(rawScore, 1), reasons });
      }
    }

    scores.sort((a, b) => b.score - a.score);
    const topMatches = scores.slice(0, maxResults);

    if (topMatches.length === 0) {
      return { message: 'No matching facilities found for the given requirements', matches: [] };
    }

    const facilityIds = topMatches.map((m) => m.facility._id.toString());
    const matchReason = topMatches
      .map(
        (m, i) =>
          `#${i + 1} ${m.facility.name}: ${m.reasons.join('; ')} (score: ${(m.score * 100).toFixed(0)}%)`,
      )
      .join(' | ');

    const matchHistory = topMatches.map((m) => ({
      facilityId: m.facility._id.toString(),
      reason: m.reasons.join('; '),
      score: m.score,
      isManualOverride: false,
    }));

    const updatedInquiry = await this.inquiriesService.assignFacilities(
      inquiryId,
      facilityIds,
      matchReason,
      matchHistory,
    );

    return {
      message: `Matched ${topMatches.length} facilities`,
      inquiry: updatedInquiry,
      matches: topMatches.map((m) => ({
        facilityId: m.facility._id,
        facilityName: m.facility.name,
        score: m.score,
        scorePercent: `${(m.score * 100).toFixed(0)}%`,
        matchReasons: m.reasons,
        availabilityCount: m.facility.availabilityCount,
        address: m.facility.address,
        services: m.facility.services,
      })),
    };
  }

  async manualAssign(inquiryId: string, dto: ManualAssignDto) {
    const inquiry = await this.inquiriesService.findById(inquiryId);
    const facility = await this.facilitiesService.findById(dto.facilityId);

    const reason = dto.reason ?? `Manually assigned by admin to "${facility.name}"`;

    const existingIds = (inquiry.assignedFacilityIds ?? []).map((id) => id.toString());
    if (!existingIds.includes(dto.facilityId)) {
      existingIds.push(dto.facilityId);
    }

    const updatedMatchReason = inquiry.matchReason
      ? `${inquiry.matchReason} | MANUAL: ${reason}`
      : `MANUAL: ${reason}`;

    return this.inquiriesService.assignFacilities(
      inquiryId,
      existingIds,
      updatedMatchReason,
      [{ facilityId: dto.facilityId, reason, score: 1, isManualOverride: true }],
    );
  }

  async getConfig() {
    const weights = await this.adminService.getMatchingWeights();
    const maxResults = await this.adminService.getMaxMatchResults();
    return { matchingWeights: weights, maxMatchResults: maxResults };
  }
}
