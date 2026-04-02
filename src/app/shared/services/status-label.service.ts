import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BOOKING_STATUS,
  GOODS_STATUS,
  GOODS_PAYMENT_STATUS,
  SEAT_STATUS,
} from '@rsApp/core/constants/status.constants';

@Injectable({
  providedIn: 'root',
})
export class StatusLabelService {
  constructor(private translateService: TranslateService) {}

  /**
   * Get booking status label
   */
  getBookingStatusLabel(status: string, shortForm: boolean = false): string {
    const prefix = shortForm ? 'status.booking.' + status + 'Short' : 'status.booking.' + status;
    return this.translateService.instant(prefix);
  }

  /**
   * Get payment status label
   */
  getPaymentStatusLabel(status: string): string {
    return this.translateService.instant('status.payment.' + status);
  }

  /**
   * Get seat status label
   */
  getSeatStatusLabel(status: string): string {
    const keyMap: { [key: string]: string } = {
      not_picked_up: 'notPickedUp',
      picked_up: 'pickedUp',
      on_board: 'onBoard',
      dropped_off: 'droppedOff',
      blocked: 'blocked',
    };
    const key = keyMap[status] || status;
    return this.translateService.instant('status.seat.' + key);
  }

  /**
   * Get goods status label
   */
  getGoodsStatusLabel(status: string, uppercase: boolean = false): string {
    const keyMap: { [key: string]: string } = {
      new: 'new',
      pending: 'pending',
      on_board: 'onBoard',
      waiting_continue_delivery: 'waitingContinueDelivery',
      arrived_final_station: 'arrivedFinalStation',
      out_for_delivery: 'outForDelivery',
      completed: 'completed',
      cancelled: 'cancelled',
    };
    const key = keyMap[status] || status;
    const prefix = uppercase ? 'status.goods.' + key + 'Upper' : 'status.goods.' + key;
    return this.translateService.instant(prefix);
  }

  /**
   * Get goods payment status label
   */
  getGoodsPaymentStatusLabel(status: string): string {
    const keyMap: { [key: string]: string } = {
      new: 'new',
      deposited: 'deposited',
      paid: 'paid',
      ready_refund: 'readyRefund',
      refunded: 'refunded',
    };
    const key = keyMap[status] || status;
    return this.translateService.instant('status.goodsPayment.' + key);
  }

  /**
   * Get event status label
   */
  getEventStatusLabel(status: string): string {
    const keyMap: { [key: string]: string } = {
      un_published: 'unPublished',
      scheduled: 'scheduled',
      cancelled: 'cancelled',
      in_progress: 'inProgress',
      completed: 'completed',
      overdue: 'overdue',
    };
    const key = keyMap[status] || status;
    return this.translateService.instant('status.event.' + key);
  }

  /**
   * Get all booking status options for dropdowns
   */
  getBookingStatusOptions(shortForm: boolean = false) {
    return [
      {
        value: BOOKING_STATUS.RESERVED,
        label: this.getBookingStatusLabel(BOOKING_STATUS.RESERVED, shortForm),
      },
      {
        value: BOOKING_STATUS.DEPOSITED,
        label: this.getBookingStatusLabel(BOOKING_STATUS.DEPOSITED, shortForm),
      },
      {
        value: BOOKING_STATUS.PAID,
        label: this.getBookingStatusLabel(BOOKING_STATUS.PAID, shortForm),
      },
      {
        value: BOOKING_STATUS.COMPLETED,
        label: this.getBookingStatusLabel(BOOKING_STATUS.COMPLETED, shortForm),
      },
      {
        value: BOOKING_STATUS.CANCELLED,
        label: this.getBookingStatusLabel(BOOKING_STATUS.CANCELLED, shortForm),
      },
    ];
  }

  /**
   * Get all goods status options for dropdowns
   */
  getGoodsStatusOptions(uppercase: boolean = false) {
    return [
      { value: GOODS_STATUS.NEW, label: this.getGoodsStatusLabel(GOODS_STATUS.NEW, uppercase) },
      { value: GOODS_STATUS.PENDING, label: this.getGoodsStatusLabel(GOODS_STATUS.PENDING, uppercase) },
      { value: GOODS_STATUS.ON_BOARD, label: this.getGoodsStatusLabel(GOODS_STATUS.ON_BOARD, uppercase) },
      {
        value: GOODS_STATUS.WAITING_CONTINUE_DELIVERY,
        label: this.getGoodsStatusLabel(GOODS_STATUS.WAITING_CONTINUE_DELIVERY, uppercase),
      },
      {
        value: GOODS_STATUS.ARRIVED_FINAL_STATION,
        label: this.getGoodsStatusLabel(GOODS_STATUS.ARRIVED_FINAL_STATION, uppercase),
      },
      {
        value: GOODS_STATUS.OUT_FOR_DELIVERY,
        label: this.getGoodsStatusLabel(GOODS_STATUS.OUT_FOR_DELIVERY, uppercase),
      },
      { value: GOODS_STATUS.COMPLETED, label: this.getGoodsStatusLabel(GOODS_STATUS.COMPLETED, uppercase) },
      { value: GOODS_STATUS.CANCELLED, label: this.getGoodsStatusLabel(GOODS_STATUS.CANCELLED, uppercase) },
    ];
  }

  /**
   * Get all goods payment status options for dropdowns
   */
  getGoodsPaymentStatusOptions() {
    return [
      { value: GOODS_PAYMENT_STATUS.NEW, label: this.getGoodsPaymentStatusLabel(GOODS_PAYMENT_STATUS.NEW) },
      { value: GOODS_PAYMENT_STATUS.DEPOSITED, label: this.getGoodsPaymentStatusLabel(GOODS_PAYMENT_STATUS.DEPOSITED) },
      { value: GOODS_PAYMENT_STATUS.PAID, label: this.getGoodsPaymentStatusLabel(GOODS_PAYMENT_STATUS.PAID) },
      {
        value: GOODS_PAYMENT_STATUS.READY_REFUND,
        label: this.getGoodsPaymentStatusLabel(GOODS_PAYMENT_STATUS.READY_REFUND),
      },
      { value: GOODS_PAYMENT_STATUS.REFUNDED, label: this.getGoodsPaymentStatusLabel(GOODS_PAYMENT_STATUS.REFUNDED) },
    ];
  }

  /**
   * Get all seat status options for dropdowns
   */
  getSeatStatusOptions() {
    return [
      { value: SEAT_STATUS.NOT_PICKED_UP, label: this.getSeatStatusLabel(SEAT_STATUS.NOT_PICKED_UP) },
      { value: SEAT_STATUS.PICKED_UP, label: this.getSeatStatusLabel(SEAT_STATUS.PICKED_UP) },
      { value: SEAT_STATUS.ON_BOARD, label: this.getSeatStatusLabel(SEAT_STATUS.ON_BOARD) },
      { value: SEAT_STATUS.DROPPED_OFF, label: this.getSeatStatusLabel(SEAT_STATUS.DROPPED_OFF) },
    ];
  }
}
