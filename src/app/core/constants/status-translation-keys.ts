/**
 * Status Translation Keys Utility
 * Functions that return translation keys for status values
 * Useful when you need the key itself for direct translation lookup
 */

// Common Status Translation Keys
export function getCommonStatusTranslationKey(status: string): string {
  const keyMap: { [key: string]: string } = {
    'active': 'status.common.active',
    'inactive': 'status.common.inactive',
    'suspended': 'status.common.suspended',
    'expired': 'status.common.expired',
  };
  return keyMap[status] || `status.common.${status}`;
}

// Booking Status Translation Keys
export function getBookingStatusTranslationKey(status: string, isShort?: boolean): string {
  const shortMap: { [key: string]: string } = {
    'reserved': 'status.booking.reserved.short',
    'paid': 'status.booking.paid.short',
    'deposited': 'status.booking.deposited.short',
    'completed': 'status.booking.completed.short',
    'cancelled': 'status.booking.cancelled.short',
  };

  const fullMap: { [key: string]: string } = {
    'reserved': 'status.booking.reserved',
    'paid': 'status.booking.paid',
    'deposited': 'status.booking.deposited',
    'completed': 'status.booking.completed',
    'cancelled': 'status.booking.cancelled',
  };

  const map = isShort ? shortMap : fullMap;
  return map[status] || `status.booking.${status}`;
}

// Payment Status Translation Keys
export function getPaymentStatusTranslationKey(status: string): string {
  const keyMap: { [key: string]: string } = {
    'pending': 'status.payment.pending',
    'completed': 'status.payment.completed',
    'failed': 'status.payment.failed',
    'refunded': 'status.payment.refunded',
  };
  return keyMap[status] || `status.payment.${status}`;
}

// Seat Status Translation Keys
export function getSeatStatusTranslationKey(status: string): string {
  const keyMap: { [key: string]: string } = {
    'not_picked_up': 'status.seat.not_picked_up',
    'picked_up': 'status.seat.picked_up',
    'on_board': 'status.seat.on_board',
    'dropped_off': 'status.seat.dropped_off',
  };
  return keyMap[status] || `status.seat.${status}`;
}

// Goods Status Translation Keys
export function getGoodsStatusTranslationKey(status: string): string {
  const keyMap: { [key: string]: string } = {
    'new': 'status.goods.new',
    'pending': 'status.goods.pending',
    'on_board': 'status.goods.on_board',
    'waiting_continue_delivery': 'status.goods.waiting_continue_delivery',
    'arrived_final_station': 'status.goods.arrived_final_station',
    'out_for_delivery': 'status.goods.out_for_delivery',
    'completed': 'status.goods.completed',
    'cancelled': 'status.goods.cancelled',
  };
  return keyMap[status] || `status.goods.${status}`;
}

// Goods Payment Status Translation Keys
export function getGoodsPaymentStatusTranslationKey(status: string): string {
  const keyMap: { [key: string]: string } = {
    'new': 'status.goodspayment.new',
    'deposited': 'status.goodspayment.deposited',
    'paid': 'status.goodspayment.paid',
    'ready_refund': 'status.goodspayment.ready_refund',
    'refunded': 'status.goodspayment.refunded',
  };
  return keyMap[status] || `status.goodspayment.${status}`;
}

// Delivery Type Translation Keys
export function getDeliveryTypeTranslationKey(type: string): string {
  const keyMap: { [key: string]: string } = {
    'STATION': 'status.delivery.station',
    'ADDRESS': 'status.delivery.address',
  };
  return keyMap[type] || `status.delivery.${type.toLowerCase()}`;
}

// Fulfillment Mode Translation Keys
export function getFulfillmentModeTranslationKey(mode: string): string {
  const keyMap: { [key: string]: string } = {
    'ROADSIDE': 'status.fulfillment.roadside',
    'STATION': 'status.fulfillment.station',
  };
  return keyMap[mode] || `status.fulfillment.${mode.toLowerCase()}`;
}

// Event Status Translation Keys
export function getEventStatusTranslationKey(status: string): string {
  const keyMap: { [key: string]: string } = {
    'un_published': 'status.event.un_published',
    'scheduled': 'status.event.scheduled',
    'cancelled': 'status.event.cancelled',
    'in_progress': 'status.event.in_progress',
    'completed': 'status.event.completed',
    'overdue': 'status.event.overdue',
  };
  return keyMap[status] || `status.event.${status}`;
}

// Bus Schedule Direction Translation Keys
export function getBusScheduleDirectionTranslationKey(direction: string): string {
  const keyMap: { [key: string]: string } = {
    'arrival': 'status.direction.arrival',
    'departure': 'status.direction.departure',
  };
  return keyMap[direction] || `status.direction.${direction}`;
}

// Duration Status Translation Keys
export function getDurationStatusTranslationKey(duration: string): string {
  const keyMap: { [key: string]: string } = {
    'day': 'status.duration.day',
    'week': 'status.duration.week',
    'month': 'status.duration.month',
    'year': 'status.duration.year',
    'lifetime': 'status.duration.lifetime',
  };
  return keyMap[duration] || `status.duration.${duration}`;
}
