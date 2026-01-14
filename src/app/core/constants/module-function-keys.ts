/**
 * Centralized constants for module keys and function keys
 * Used for capability-based access control, menu filtering, and quota tracking
 */

// Common CRUD function values (reusable)
const CRUD_OPERATIONS = {
  LIST: 'list',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
} as const;

export const MODULE_KEYS = {
  // Management modules (Admin)
  USERS_MANAGEMENT: 'users-management',
  FILES_CENTER_MANAGEMENT: 'files-center-management',
  GOODS_MANAGEMENT: 'goods-management',
  BUS_MANAGEMENT: 'bus-management',
  TENANT_MANAGEMENT: 'tenant-management',
  SUBSCRIPTION_MANAGEMENT: 'subscription-management',
  PROMOTION_MANAGEMENT: 'promotion-management',
  PAYMENT_MANAGEMENT: 'payment-management',
  BOOKING_MANAGEMENT: 'booking-management',

  SETTING_MANAGEMENT: 'setting-management',

  //User Management sub-modules
  USER_CLIENT: 'user-client',
  USER_TENANT: 'user-tenant',
  USER_TENANT_OPERATOR: 'user-tenant-operator',
  USER_DRIVER: 'user-driver',
  USER_POS: 'user-pos',

  // Bus Management sub-modules
  BUS_SCHEDULE: 'bus-schedule',
  BUS_SCHEDULE_CALENDAR: 'bus-schedule-calendar',
  BUS_DESIGN: 'bus-design',
  BUS_SETTING: 'bus-setting',
  BUS_TEMPLATES: 'bus-templates',
  BUS_SCHEDULE_TEMPLATES: 'bus-schedule-templates',
  BUS_ROUTES: 'bus-routes',
  BUS_LAYOUT_TEMPLATES: 'bus-layout-templates',
  BUS_STATIONS: 'bus-stations',
  BUS_PROVINCES: 'bus-provinces',
  BUS_TYPES: 'bus-types',
  BUS_SERVICES: 'bus-services',
  SEAT_TYPES: 'seat-types',
  BUS_SCHEDULE_AUTOGENERATORS: 'bus-schedule-autogenerators',

  THEME_SETTINGS: 'theme-settings',
  BUS_SCHEDULE_SETTINGS: 'bus-schedule-settings',
  ORGANIZATION_SETTINGS: 'organization-settings',
  DEFAULT_SETTINGS: 'default-settings',

  // Tenant modules
  GOODS: 'goods',
  GOODS_CATEGORIES: 'goods-categories',
  BUSES: 'buses',
  BUS_SCHEDULES: 'bus-schedules',
} as const;

export const FUNCTION_KEYS = {
  // Goods Management functions
  GOODS: CRUD_OPERATIONS,
  GOODS_CATEGORIES: CRUD_OPERATIONS,

  // user Management functions
  USER_CLIENT: CRUD_OPERATIONS,
  USER_DRIVER: CRUD_OPERATIONS,
  USER_POS: CRUD_OPERATIONS,
  USER_TENANT: CRUD_OPERATIONS,
  USER_TENANT_OPERATOR: CRUD_OPERATIONS,

  // Bus Management functions
  BUS_SCHEDULE: CRUD_OPERATIONS,
  BUS_TEMPLATES: CRUD_OPERATIONS,
  BUS_ROUTES: CRUD_OPERATIONS,
  BUS_SCHEDULE_TEMPLATES: CRUD_OPERATIONS,
  BUS_LAYOUT_TEMPLATES: CRUD_OPERATIONS,
  BUS_SCHEDULE_AUTOGENERATORS: CRUD_OPERATIONS,

  BUS_STATIONS: CRUD_OPERATIONS,
  BUS_PROVINCES: CRUD_OPERATIONS,
  BUS_TYPES: CRUD_OPERATIONS,
  BUS_SERVICES: CRUD_OPERATIONS,
  SEAT_TYPES: CRUD_OPERATIONS,

  // Users Management functions
  USERS_MANAGEMENT: CRUD_OPERATIONS,

  //

  // Tenant Management functions
  TENANT_MANAGEMENT: CRUD_OPERATIONS,

  // Payment Management functions
  PAYMENT_MANAGEMENT: CRUD_OPERATIONS,

  // Files Management functions
  FILES_CENTER_MANAGEMENT: CRUD_OPERATIONS,

  // Booking Management functions
  BOOKING_MANAGEMENT: CRUD_OPERATIONS,

  // Subscription Management functions
  SUBSCRIPTION_MANAGEMENT: CRUD_OPERATIONS,

  // Promotion Management functions
  PROMOTION_MANAGEMENT: CRUD_OPERATIONS,

  // Bus Design functions
  BUS_DESIGN: CRUD_OPERATIONS,

  // Bus Setting functions
  BUS_SETTING: CRUD_OPERATIONS,
} as const;

/**
 * Type definitions for better IDE support and type safety
 */
export type ModuleKey = typeof MODULE_KEYS[keyof typeof MODULE_KEYS];
export type FunctionKey = string; // Can be extended based on usage

/**
 * Helper function to build feature object for API quota tracking
 * Usage: buildFeature(MODULE_KEYS.BUS_MANAGEMENT, FUNCTION_KEYS.BUS_SCHEDULE.LIST_BUSES)
 */
export function buildFeature(moduleKey: ModuleKey, functionKey?: FunctionKey) {
  return {
    module: moduleKey,
    function: functionKey || 'default',
  };
}
