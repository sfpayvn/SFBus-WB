// Booking Status
export const BOOKING_STATUS = {
  RESERVED: 'reserved',
  PAID: 'paid',
  DEPOSITED: 'deposited',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const BOOKING_STATUS_LABELS: { [key: string]: string } = {
  [BOOKING_STATUS.RESERVED]: 'Đã đặt',
  [BOOKING_STATUS.PAID]: 'Đã thanh toán',
  [BOOKING_STATUS.DEPOSITED]: 'Đã đặt cọc',
  [BOOKING_STATUS.COMPLETED]: 'Hoàn thành',
  [BOOKING_STATUS.CANCELLED]: 'Đã hủy',
};

export const BOOKING_STATUS_CLASSES: { [key: string]: string } = {
  [BOOKING_STATUS.RESERVED]: 'border-yellow-500 bg-yellow-200 text-yellow-800',
  [BOOKING_STATUS.PAID]: 'border-green-500 bg-green-200 text-green-800',
  [BOOKING_STATUS.DEPOSITED]: 'border-red-500 bg-red-200 text-red-800',
  [BOOKING_STATUS.COMPLETED]: 'border-blue-500 bg-blue-200 text-blue-800',
  [BOOKING_STATUS.CANCELLED]: 'border-gray-500 bg-gray-200 text-gray-800',
};

// Event Status
export const EVENT_STATUS = {
  UN_PUBLISHED: 'un_published',
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
} as const;

export const EVENT_STATUS_LABELS: { [key: string]: string } = {
  [EVENT_STATUS.UN_PUBLISHED]: 'Chưa xuất bản',
  [EVENT_STATUS.SCHEDULED]: 'Đã lên lịch',
  [EVENT_STATUS.CANCELLED]: 'Đã hủy',
  [EVENT_STATUS.IN_PROGRESS]: 'Đang tiến hành',
  [EVENT_STATUS.COMPLETED]: 'Hoàn thành',
  [EVENT_STATUS.OVERDUE]: 'Quá hạn',
};

export const EVENT_STATUS_CLASSES: { [key: string]: string } = {
  [EVENT_STATUS.UN_PUBLISHED]: 'border-gray-500 bg-gray-200 text-gray-800',
  [EVENT_STATUS.SCHEDULED]: 'border-blue-500 bg-blue-200 text-blue-800',
  [EVENT_STATUS.CANCELLED]: 'border-red-500 bg-red-200 text-red-800',
  [EVENT_STATUS.IN_PROGRESS]: 'border-indigo-500 bg-indigo-200 text-indigo-800',
  [EVENT_STATUS.COMPLETED]: 'border-green-500 bg-green-200 text-green-800',
  [EVENT_STATUS.OVERDUE]: 'border-orange-500 bg-orange-200 text-orange-800',
};

// Goods Status
export const GOODS_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  COMPLETED: 'completed',
  ON_BOARD: 'on_board',
  DROPPED_OFF: 'dropped_off',
  CANCELLED: 'cancelled',
} as const;

export const GOODS_STATUS_LABELS: { [key: string]: string } = {
  [GOODS_STATUS.NEW]: 'Mới tạo',
  [GOODS_STATUS.PENDING]: 'Nhập hàng',
  [GOODS_STATUS.COMPLETED]: 'Hoàn thành',
  [GOODS_STATUS.ON_BOARD]: 'Đang trên đường',
  [GOODS_STATUS.DROPPED_OFF]: 'Đã Tới',
  [GOODS_STATUS.CANCELLED]: 'Đã hủy',
};

export const GOODS_STATUS_CLASSES: { [key: string]: string } = {
  [GOODS_STATUS.NEW]: 'border-blue-500 bg-blue-200 text-blue-800',
  [GOODS_STATUS.PENDING]: 'border-yellow-500 bg-yellow-200 text-yellow-800',
  [GOODS_STATUS.COMPLETED]: 'border-green-500 bg-green-200 text-green-800',
  [GOODS_STATUS.ON_BOARD]: 'border-indigo-500 bg-indigo-200 text-indigo-800',
  [GOODS_STATUS.DROPPED_OFF]: 'border-purple-500 bg-purple-200 text-purple-800',
  [GOODS_STATUS.CANCELLED]: 'border-red-500 bg-red-200 text-red-800',
};

// Seat Status
export const SEAT_STATUS = {
  NOT_PICKED_UP: 'not_picked_up',
  PICKED_UP: 'picked_up',
  ON_BOARD: 'on_board',
  DROPPED_OFF: 'dropped_off',
} as const;

export const SEAT_STATUS_LABELS: { [key: string]: string } = {
  [SEAT_STATUS.NOT_PICKED_UP]: 'Chưa đón',
  [SEAT_STATUS.PICKED_UP]: 'Đã đón',
  [SEAT_STATUS.ON_BOARD]: 'Đã lên xe',
  [SEAT_STATUS.DROPPED_OFF]: 'Đã trả khách',
};

export const SEAT_STATUS_CLASSES: { [key: string]: string } = {
  [SEAT_STATUS.NOT_PICKED_UP]: 'bg-yellow-100 border-yellow-300',
  [SEAT_STATUS.PICKED_UP]: 'bg-blue-100 border-blue-300',
  [SEAT_STATUS.ON_BOARD]: 'bg-green-100 border-green-300',
  [SEAT_STATUS.DROPPED_OFF]: 'bg-purple-100 border-purple-300',
};

// Common Status (for tenant, subscription, promotion, payment-method, goods-categories, etc.)
export const COMMON_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
} as const;

export const COMMON_STATUS_LABELS: { [key: string]: string } = {
  [COMMON_STATUS.ACTIVE]: 'Hoạt động',
  [COMMON_STATUS.INACTIVE]: 'Không hoạt động',
  [COMMON_STATUS.SUSPENDED]: 'Tạm dừng',
  [COMMON_STATUS.EXPIRED]: 'Hết hạn',
};

export const COMMON_STATUS_CLASSES: { [key: string]: string } = {
  [COMMON_STATUS.ACTIVE]: 'border-green-500 bg-green-200 text-green-800',
  [COMMON_STATUS.INACTIVE]: 'border-indigo-500 bg-indigo-200 text-indigo-800',
  [COMMON_STATUS.SUSPENDED]: 'border-red-500 bg-red-200 text-red-800',
  [COMMON_STATUS.EXPIRED]: 'border-gray-500 bg-gray-200 text-gray-800',
};

// payment-method uses common status constants
export const PAYMENT_METHOD_TYPES = {
  card: 'Card',
  banking: 'Banking',
  cash: 'Cash',
} as const;

// Type definitions
export type BookingStatusType = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
export type EventStatusType = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];
export type GoodsStatusType = typeof GOODS_STATUS[keyof typeof GOODS_STATUS];
export type SeatStatusType = typeof SEAT_STATUS[keyof typeof SEAT_STATUS];
export type CommonStatusType = typeof COMMON_STATUS[keyof typeof COMMON_STATUS];
