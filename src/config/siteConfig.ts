/**
 * TEMBO PAGE — Global Site Configuration & Single Source of Truth
 *
 * All pricing plans, statistics, discount rates, and brand metadata
 * MUST be imported from this file to ensure zero contradictions across
 * the Landing page, Dedicated Pricing page, About page, and Contact portals.
 */

export interface PricingPlan {
  id: 'free' | 'creator' | 'pro' | 'growth';
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  subtitle: string;
  badge?: string;
  popular: boolean;
  features: string[];
  cta: string;
}

export const ANNUAL_DISCOUNT_PERCENT = 20;
export const ANNUAL_DISCOUNT_LABEL = 'Save 20%';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    subtitle: 'The essentials to start your journey',
    popular: false,
    features: [
      'Basic bio link profile',
      'Up to 8 link cards',
      'Standard analytics (30 days)',
      'Standard savannah templates',
      'Tembo branding on page',
      'Community support',
    ],
    cta: 'Start Free',
  },
  {
    id: 'creator',
    name: 'Creator',
    monthlyPrice: 9,
    annualPrice: 7.2,
    subtitle: 'For growing voices needing more tools',
    popular: false,
    features: [
      'Everything in Free',
      'Unlimited link cards',
      'Custom theme selection',
      'Smart Pixel tracking (basic)',
      'Remove Tembo branding',
      'Priority email support',
    ],
    cta: 'Start Creator',
  },
  {
    id: 'pro',
    name: 'Creator Pro',
    monthlyPrice: 19,
    annualPrice: 15.2,
    subtitle: 'The full Tembo intelligence stack',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Everything in Creator',
      '1 custom domain mapping',
      'Traffic-based personalization',
      'AI link recommendations',
      'A/B split testing (2 variants)',
      'Full analytics suite',
    ],
    cta: 'Get Creator Pro',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 39,
    annualPrice: 31.2,
    subtitle: 'Advanced features for scaling empires',
    popular: false,
    features: [
      'Everything in Creator Pro',
      'Advanced AI advisor insights',
      'Unlimited workspaces',
      'White-label pages',
      'Campaign manager',
      'Tembo Chat setup',
      'API access & 24/7 priority support',
    ],
    cta: 'Start Growth',
  },
];

export const AGENCY_PLAN = {
  name: 'Agency Herd',
  startingPrice: '$99/mo',
  description: 'Need to manage multiple creator profiles, A/B variant branches, and team accesses? Plans start at $99/mo.',
  cta: 'Contact Sales',
};

/**
 * Single source of truth for platform proof statistics.
 */
export const SITE_STATS = {
  creators: {
    raw: 14200,
    display: '14,200+',
    label: 'Creators Active',
  },
  clicks: {
    raw: 38,
    display: '38M+',
    label: 'Clicks Tracked',
  },
  uptime: {
    raw: 99.9,
    display: '99.9%',
    label: 'Uptime SLA',
  },
  countries: {
    raw: 80,
    display: '80+',
    label: 'Countries Reached',
  },
  conversionLift: {
    display: '+34%',
    label: 'Conversion Lift',
  },
  revenueAttributed: {
    display: '$4.2M+',
    label: 'Revenue Attributed',
  },
};

export const MARQUEE_STATS = [
  { value: SITE_STATS.creators.display, label: SITE_STATS.creators.label },
  { value: SITE_STATS.clicks.display, label: SITE_STATS.clicks.label },
  { value: SITE_STATS.conversionLift.display, label: SITE_STATS.conversionLift.label },
  { value: SITE_STATS.countries.display, label: SITE_STATS.countries.label },
  { value: SITE_STATS.revenueAttributed.display, label: SITE_STATS.revenueAttributed.label },
  { value: SITE_STATS.uptime.display, label: SITE_STATS.uptime.label },
];

export const CURRENT_YEAR = new Date().getFullYear();
