export const ROLE_CONSTANTS = {
  ADMIN: 'admin',
  TENANT: 'tenant',
  TENANT_OPERATOR: 'tenant-operator',
  POS: 'pos',
  DRIVER: 'driver',
  CLIENT: 'client',
};

export const ROLE_LABELS: Record<string, string> = {
  [ROLE_CONSTANTS.ADMIN]: 'Quản trị hệ thống',
  [ROLE_CONSTANTS.TENANT]: 'Vận hành',
  [ROLE_CONSTANTS.TENANT_OPERATOR]: 'Nhân viên vận hành',
  [ROLE_CONSTANTS.POS]: 'Pos',
  [ROLE_CONSTANTS.DRIVER]: 'Tài xế',
  [ROLE_CONSTANTS.CLIENT]: 'Khách hàng',
};

export const ROLE_CLASSES: Record<string, string> = {
  [ROLE_CONSTANTS.ADMIN]: 'bg-red-100 text-red-800',
  [ROLE_CONSTANTS.TENANT]: 'bg-green-100 text-green-800',
  [ROLE_CONSTANTS.TENANT_OPERATOR]: 'bg-purple-100 text-purple-800',
  [ROLE_CONSTANTS.POS]: 'bg-blue-100 text-blue-800',
  [ROLE_CONSTANTS.DRIVER]: 'bg-yellow-100 text-yellow-800',
  [ROLE_CONSTANTS.CLIENT]: 'bg-indigo-100 text-indigo-800',
};
export const DEFAULT_TENANT_USER_ROLES = [ROLE_CONSTANTS.TENANT];
