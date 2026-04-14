export type PlatformSlug = 'aone' | 'ghl' | 'process-street' | 'clickup' | 'other';

export interface PlatformConfig {
  slug: PlatformSlug;
  name: string;
  accent: string; // hex color
}

export const PLATFORM_CONFIGS: Record<PlatformSlug, PlatformConfig> = {
  aone: {
    slug: 'aone',
    name: 'Aone',
    accent: '#dc2626',
  },
  ghl: {
    slug: 'ghl',
    name: 'GHL',
    accent: '#2563eb',
  },
  'process-street': {
    slug: 'process-street',
    name: 'Process Street',
    accent: '#7c3aed',
  },
  clickup: {
    slug: 'clickup',
    name: 'ClickUp',
    accent: '#0891b2',
  },
  other: {
    slug: 'other',
    name: 'Other',
    accent: '#dc2626',
  },
};

export const PLATFORM_ENTRIES = Object.entries(PLATFORM_CONFIGS);

export function getPlatformConfig(slug: string | undefined): PlatformConfig | null {
  if (!slug) return null;
  return PLATFORM_CONFIGS[slug as PlatformSlug] || null;
}

export function getPlatformSlugFromName(name: string): PlatformSlug {
  const config = PLATFORM_ENTRIES.find(([_slug, config]) => config.name === name);
  return (config ? config[0] : 'other') as PlatformSlug;
}
