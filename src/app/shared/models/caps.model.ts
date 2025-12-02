export interface CapabilityItem {
  moduleKey: string;
  functionKey: string | null; // null = module-level
  type: 'unlimited' | 'count';
  quota: number | null;
  remaining: number | null;
  resetAt: string | null; // ISO
}
export interface CapabilitiesRes {
  defaultAction: 'allow' | 'block';
  items: CapabilityItem[];
}
