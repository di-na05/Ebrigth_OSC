import type { Platform } from '../data/mockData';

/**
 * Normalize a platform string to its canonical Platform type value.
 * Handles case variations and slug formats (e.g. "process-street" → "Process Street").
 */
export function normalizePlatformName(platform: string): Platform {
  const lower = platform.toLowerCase().trim();
  if (lower === 'aone') return 'Aone';
  if (lower === 'clickup') return 'ClickUp';
  if (lower === 'ghl') return 'GHL';
  if (lower === 'process street' || lower === 'processstreet' || lower === 'process-street') return 'Process Street';
  if (lower === 'other') return 'Other';
  return platform as Platform;
}
