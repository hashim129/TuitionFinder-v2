import { PricingBreakdown, PricingConfig } from '../types';

/**
 * Centralized pricing service.
 *
 * Business model:
 * - Platform commission: 15% of base tuition
 * - Operating Fee: 8% of base tuition, paid by parent/student
 * - Operating Fee is platform revenue (not split)
 * - Tutor receives base tuition minus platform commission (85%)
 * - Parent pays base tuition plus operating fee
 *
 * Example (base = 20,000):
 *   Platform fee:  3,000 (15%)
 *   Operating fee: 1,600 (8%)
 *   Parent pays:  21,600 (base + operating fee)
 *   Tutor net:    17,000 (base - commission)
 */
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  platformCommissionRate: 0.15,
  operatingFeeRate: 0.08,
  currency: 'PKR',
};

export function calculatePricing(
  baseTuition: number,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): PricingBreakdown {
  if (!Number.isFinite(baseTuition) || baseTuition < 0) {
    throw new Error('Base tuition must be a non-negative number');
  }

  const baseTuitionI = Math.round(baseTuition);
  const platformFee = Math.round(baseTuitionI * config.platformCommissionRate);
  const operatingFee = Math.round(baseTuitionI * config.operatingFeeRate);
  const totalParentPays = baseTuitionI + operatingFee;
  const tutorNet = baseTuitionI - platformFee;

  return {
    baseTuition: baseTuitionI,
    platformFee,
    operatingFee,
    totalParentPays,
    tutorNet,
    config: { ...config },
  };
}

export const SPEC_EXAMPLE = calculatePricing(20000);
