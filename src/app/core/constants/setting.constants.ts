export const SETTING_CONSTANTS = {
  //Bus Schedule Settings
  TRANSIT_POLICY: 'transit_policy',
  BOOKING_CANCELLATION_POLICY: 'booking_cancellation_policy',
  BOARDING_REQUIREMENTS_POLICY: 'boarding_requirements_policy',
  CARRY_ON_BAGGAGE_POLICY: 'carry_on_baggage_policy',
  CHILD_AND_PREGNANCY_POLICY: 'child_and_pregnancy_policy',
  ROADSIDE_PICKUP_POLICY: 'roadside_pickup_policy',
  OTHER_POLICY: 'other_policy',
  BUS_SCHEDULE_AVAILABILITY_CUTOFF: 'bus_schedule_availability_cutoff',

  //Theme Settings
  TENANT_NAME: 'tenantName',
  PRIMARY_COLOR: 'primaryColor',
  SECONDARY_COLOR: 'secondaryColor',
  TENANT_LOGO: 'tenantLogo',
} as const;

export type SettingConstantKeys = keyof typeof SETTING_CONSTANTS;
export type SettingConstantValues = typeof SETTING_CONSTANTS[SettingConstantKeys];

export const SETTING_CONSTANTS_GROUPS = {
  BUS_SCHEDULE: 'bus_schedule',
  THEME: 'theme',
} as const;
