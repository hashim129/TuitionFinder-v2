import { PricingBreakdown, PricingConfig } from '../types';

/**
 * Centralized pricing service.
 *
 * Business model:
 * - Platform commission: 15% of base tuition
 * - GST: 16% of base tuition, shown to customers as "Operating Fee & Taxes"
 * - GST is platform revenue (not split)
 * - Tutor receives base tuition minus platform commission (85%)
 * - Parent pays base tuition plus GST
 *
 * Example (base = 20,000):
 *   Platform fee:  3,000 (15%)
 *   GST:           3,200 (16%) -> shown as "Operating Fee & Taxes"
 *   Parent pays:  23,200 (base + GST)
 *   Tutor net:    17,000 (base - commission)
 */
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  platformCommissionRate: 0.15,
  gstRate: 0.16,
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
  const operatingFeeAndTaxes = Math.round(baseTuitionI * config.gstRate);
  const totalParentPays = baseTuitionI + operatingFeeAndTaxes;
  const tutorNet = baseTuitionI - platformFee;

  return {
    baseTuition: baseTuitionI,
    platformFee,
    operatingFeeAndTaxes,
    totalParentPays,
    tutorNet,
    config: { ...config },
  };
}

export const SPEC_EXAMPLE = calculatePricing(20000);
