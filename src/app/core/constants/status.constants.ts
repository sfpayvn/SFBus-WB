// Common Status
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
  [COMMON_STATUS.ACTIVE]: 'border-green-500 bg-green-200',
  [COMMON_STATUS.INACTIVE]: 'border-indigo-500 bg-indigo-200',
  [COMMON_STATUS.SUSPENDED]: 'border-red-500 bg-red-200',
  [COMMON_STATUS.EXPIRED]: 'border-gray-500 bg-gray-200',
};

export const COMMON_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: COMMON_STATUS.ACTIVE, label: COMMON_STATUS_LABELS[COMMON_STATUS.ACTIVE] },
  { value: COMMON_STATUS.INACTIVE, label: COMMON_STATUS_LABELS[COMMON_STATUS.INACTIVE] },
  { value: COMMON_STATUS.SUSPENDED, label: COMMON_STATUS_LABELS[COMMON_STATUS.SUSPENDED] },
  { value: COMMON_STATUS.EXPIRED, label: COMMON_STATUS_LABELS[COMMON_STATUS.EXPIRED] },
];

export type CommonStatus = typeof COMMON_STATUS[keyof typeof COMMON_STATUS];

// ==================== BOOKING STATUS ====================
export const BOOKING_STATUS = {
  RESERVED: 'reserved',
  PAID: 'paid',
  DEPOSITED: 'deposited',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const BOOKING_STATUS_CLASSES: { [key: string]: string } = {
  [BOOKING_STATUS.RESERVED]: 'border-yellow-500 bg-yellow-200',
  [BOOKING_STATUS.PAID]: 'border-green-500 bg-green-200',
  [BOOKING_STATUS.DEPOSITED]: 'border-red-500 bg-red-200',
  [BOOKING_STATUS.COMPLETED]: 'border-purple-500 bg-purple-200',
  [BOOKING_STATUS.CANCELLED]: 'border-indigo-500 bg-indigo-200',
};

export const BOOKING_STATUS_LABELS: { [key: string]: string } = {
  [BOOKING_STATUS.RESERVED]: 'Đã đặt',
  [BOOKING_STATUS.PAID]: 'Đã thanh toán',
  [BOOKING_STATUS.DEPOSITED]: 'Đã đặt cọc',
  [BOOKING_STATUS.COMPLETED]: 'Hoàn thành',
  [BOOKING_STATUS.CANCELLED]: 'Đã hủy',
};

export const BOOKING_STATUS_OPTIONS = [
  { value: BOOKING_STATUS.RESERVED, label: BOOKING_STATUS_LABELS[BOOKING_STATUS.RESERVED] },
  { value: BOOKING_STATUS.DEPOSITED, label: BOOKING_STATUS_LABELS[BOOKING_STATUS.DEPOSITED] },
  { value: BOOKING_STATUS.PAID, label: BOOKING_STATUS_LABELS[BOOKING_STATUS.PAID] },
  { value: BOOKING_STATUS.COMPLETED, label: BOOKING_STATUS_LABELS[BOOKING_STATUS.COMPLETED] },
  { value: BOOKING_STATUS.CANCELLED, label: BOOKING_STATUS_LABELS[BOOKING_STATUS.CANCELLED] },
];

export type BookingStatusType = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// ==================== PAYMENT STATUS ====================
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS_CLASSES: { [key: string]: string } = {
  [PAYMENT_STATUS.PENDING]: 'border-yellow-500 bg-yellow-200',
  [PAYMENT_STATUS.COMPLETED]: 'border-green-500 bg-green-200',
  [PAYMENT_STATUS.FAILED]: 'border-red-500 bg-red-200',
  [PAYMENT_STATUS.REFUNDED]: 'border-purple-500 bg-purple-200',
};

export const PAYMENT_STATUS_LABELS: { [key: string]: string } = {
  [PAYMENT_STATUS.PENDING]: 'Đang xử lý',
  [PAYMENT_STATUS.COMPLETED]: 'Thành công',
  [PAYMENT_STATUS.FAILED]: 'Thất bại',
  [PAYMENT_STATUS.REFUNDED]: 'Đã hoàn tiền',
};

export type PaymentStatusType = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
// ==================== PAYMENT METHODS ====================
export const PAYMENT_METHOD_TYPES = {
  card: 'Card',
  banking: 'Banking',
  cash: 'Cash',
} as const;

// ==================== SEAT STATUS ====================
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
  [SEAT_STATUS.NOT_PICKED_UP]: 'border-orange-600 bg-orange-200',
  [SEAT_STATUS.PICKED_UP]: 'border-blue-600 bg-blue-200',
  [SEAT_STATUS.ON_BOARD]: 'border-green-600 bg-green-200',
  [SEAT_STATUS.DROPPED_OFF]: 'border-purple-600 bg-purple-200',
};

export const SEAT_STATUS_OPTIONS = [
  { value: SEAT_STATUS.NOT_PICKED_UP, label: SEAT_STATUS_LABELS[SEAT_STATUS.NOT_PICKED_UP] },
  { value: SEAT_STATUS.PICKED_UP, label: SEAT_STATUS_LABELS[SEAT_STATUS.PICKED_UP] },
  { value: SEAT_STATUS.ON_BOARD, label: SEAT_STATUS_LABELS[SEAT_STATUS.ON_BOARD] },
  { value: SEAT_STATUS.DROPPED_OFF, label: SEAT_STATUS_LABELS[SEAT_STATUS.DROPPED_OFF] },
];

export type SeatStatusType = typeof SEAT_STATUS[keyof typeof SEAT_STATUS];

// ==================== GOODS STATUS ====================
export const GOODS_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  ON_BOARD: 'on_board',
  DROPPED_OFF: 'dropped_off',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const GOODS_STATUS_LABELS: { [key: string]: string } = {
  [GOODS_STATUS.NEW]: 'Nhập hàng',
  [GOODS_STATUS.PENDING]: 'Chờ vận chuyển',
  [GOODS_STATUS.ON_BOARD]: 'Đang vận chuyển',
  [GOODS_STATUS.DROPPED_OFF]: 'Đã tới nơi',
  [GOODS_STATUS.COMPLETED]: 'Hoàn thành',
  [GOODS_STATUS.CANCELLED]: 'Đã hủy',
};

export const GOODS_STATUS_CLASSES: { [key: string]: string } = {
  [GOODS_STATUS.NEW]: 'border-orange-500 bg-orange-200',
  [GOODS_STATUS.PENDING]: 'border-yellow-500 bg-yellow-200 ',
  [GOODS_STATUS.ON_BOARD]: 'border-blue-500 bg-blue-200',
  [GOODS_STATUS.DROPPED_OFF]: 'border-purple-500 bg-purple-200',
  [GOODS_STATUS.COMPLETED]: 'border-green-500 bg-green-200',
  [GOODS_STATUS.CANCELLED]: 'border-red-500 bg-red-200',
};

export const GOODS_STATUS_LABELS_UPPERCASE: { [key: string]: string } = {
  [GOODS_STATUS.NEW]: 'NHẬP HÀNG',
  [GOODS_STATUS.PENDING]: 'CHỜ VẬN CHUYỂN',
  [GOODS_STATUS.ON_BOARD]: 'ĐANG TRÊN ĐƯỜNG',
  [GOODS_STATUS.DROPPED_OFF]: 'ĐÃ TỚI NƠI',
  [GOODS_STATUS.COMPLETED]: 'HOÀN THÀNH',
  [GOODS_STATUS.CANCELLED]: 'ĐÃ HỦY',
};

export const GOODS_PAYMENT_STATUS = {
  NEW: 'new',
  DEPOSITED: 'deposited',
  PAID: 'paid',
  READY_REFUND: 'ready_refund',
  REFUNDED: 'refunded',
} as const;

export const GOODS_PAYMENT_STATUS_LABELS: { [key: string]: string } = {
  [GOODS_PAYMENT_STATUS.NEW]: 'Chưa thanh toán',
  [GOODS_PAYMENT_STATUS.DEPOSITED]: 'Thanh toán 1 phần',
  [GOODS_PAYMENT_STATUS.READY_REFUND]: 'Chờ hoàn tiền',
  [GOODS_PAYMENT_STATUS.PAID]: 'Đã thanh toán',
  [GOODS_PAYMENT_STATUS.REFUNDED]: 'Đã hoàn tiền',
};

export const GOODS_PAYMENT_STATUS_CLASSES: { [key: string]: string } = {
  [GOODS_PAYMENT_STATUS.NEW]: 'border-yellow-500 bg-yellow-200',
  [GOODS_PAYMENT_STATUS.DEPOSITED]: 'border-orange-500 bg-orange-200',
  [GOODS_PAYMENT_STATUS.PAID]: 'border-green-500 bg-green-200',
  [GOODS_PAYMENT_STATUS.READY_REFUND]: 'border-indigo-500 bg-indigo-200',
  [GOODS_PAYMENT_STATUS.REFUNDED]: 'border-purple-500 bg-purple-200',
};

export const GOODS_PAYMENT_STATUS_OPTIONS = [
  { value: GOODS_PAYMENT_STATUS.NEW, label: GOODS_PAYMENT_STATUS_LABELS[GOODS_PAYMENT_STATUS.NEW] },
  { value: GOODS_PAYMENT_STATUS.DEPOSITED, label: GOODS_PAYMENT_STATUS_LABELS[GOODS_PAYMENT_STATUS.DEPOSITED] },
  { value: GOODS_PAYMENT_STATUS.PAID, label: GOODS_PAYMENT_STATUS_LABELS[GOODS_PAYMENT_STATUS.PAID] },
  { value: GOODS_PAYMENT_STATUS.READY_REFUND, label: GOODS_PAYMENT_STATUS_LABELS[GOODS_PAYMENT_STATUS.READY_REFUND] },
  { value: GOODS_PAYMENT_STATUS.REFUNDED, label: GOODS_PAYMENT_STATUS_LABELS[GOODS_PAYMENT_STATUS.REFUNDED] },
];

export const GOODS_STATUS_OPTIONS = [
  { value: GOODS_STATUS.NEW, label: GOODS_STATUS_LABELS_UPPERCASE[GOODS_STATUS.NEW] },
  { value: GOODS_STATUS.PENDING, label: GOODS_STATUS_LABELS_UPPERCASE[GOODS_STATUS.PENDING] },
  { value: GOODS_STATUS.ON_BOARD, label: GOODS_STATUS_LABELS_UPPERCASE[GOODS_STATUS.ON_BOARD] },
  { value: GOODS_STATUS.DROPPED_OFF, label: GOODS_STATUS_LABELS_UPPERCASE[GOODS_STATUS.DROPPED_OFF] },
  { value: GOODS_STATUS.COMPLETED, label: GOODS_STATUS_LABELS_UPPERCASE[GOODS_STATUS.COMPLETED] },
  { value: GOODS_STATUS.CANCELLED, label: GOODS_STATUS_LABELS_UPPERCASE[GOODS_STATUS.CANCELLED] },
];

export type GoodsStatusType = typeof GOODS_STATUS[keyof typeof GOODS_STATUS];

// ==================== EVENT STATUS ====================
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
  [EVENT_STATUS.IN_PROGRESS]: 'Đang diễn ra',
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

export const EVENT_STATUS_OPTIONS = [
  { value: EVENT_STATUS.UN_PUBLISHED, label: EVENT_STATUS_LABELS[EVENT_STATUS.UN_PUBLISHED] },
  { value: EVENT_STATUS.SCHEDULED, label: EVENT_STATUS_LABELS[EVENT_STATUS.SCHEDULED] },
  { value: EVENT_STATUS.IN_PROGRESS, label: EVENT_STATUS_LABELS[EVENT_STATUS.IN_PROGRESS] },
  { value: EVENT_STATUS.COMPLETED, label: EVENT_STATUS_LABELS[EVENT_STATUS.COMPLETED] },
  { value: EVENT_STATUS.CANCELLED, label: EVENT_STATUS_LABELS[EVENT_STATUS.CANCELLED] },
  { value: EVENT_STATUS.OVERDUE, label: EVENT_STATUS_LABELS[EVENT_STATUS.OVERDUE] },
];

export type EventStatusType = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];

// ==================== Priority ====================

export const PRIORITYCLASSES = {
  1: 'border-gray-500 bg-gray-200 text-gray-800',
  2: 'border-blue-500 bg-blue-200 text-blue-800',
  3: 'border-green-500 bg-green-200 text-green-800',
  4: 'border-yellow-500 bg-yellow-200 text-yellow-800',
  5: 'border-red-500 bg-red-200 text-red-800',
  6: 'border-purple-500 bg-purple-200 text-purple-800',
  7: 'border-pink-500 bg-pink-200 text-pink-800',
  8: 'border-indigo-500 bg-indigo-200 text-indigo-800',
  9: 'border-teal-500 bg-teal-200 text-teal-800',
  10: 'border-cyan-500 bg-cyan-200 text-cyan-800',
};

/// ==================== Duration Status ====================
export const DURATION_STATUS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  LIFETIME: 'lifetime',
} as const;

export const DURATION_STATUS_LABELS: { [key: string]: string } = {
  [DURATION_STATUS.DAY]: 'Ngày',
  [DURATION_STATUS.WEEK]: 'Tuần',
  [DURATION_STATUS.MONTH]: 'Tháng',
  [DURATION_STATUS.YEAR]: 'Năm',
  [DURATION_STATUS.LIFETIME]: 'Không bao giờ hết hạn',
};

export const DURATION_STATUS_OPTIONS = [
  { value: DURATION_STATUS.DAY, label: DURATION_STATUS_LABELS[DURATION_STATUS.DAY] },
  { value: DURATION_STATUS.WEEK, label: DURATION_STATUS_LABELS[DURATION_STATUS.WEEK] },
  { value: DURATION_STATUS.MONTH, label: DURATION_STATUS_LABELS[DURATION_STATUS.MONTH] },
  { value: DURATION_STATUS.YEAR, label: DURATION_STATUS_LABELS[DURATION_STATUS.YEAR] },
  { value: DURATION_STATUS.LIFETIME, label: DURATION_STATUS_LABELS[DURATION_STATUS.LIFETIME] },
];

export type DurationStatusType = typeof DURATION_STATUS[keyof typeof DURATION_STATUS];
