import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  getCommonStatusTranslationKey,
  getBookingStatusTranslationKey,
  getPaymentStatusTranslationKey,
  getSeatStatusTranslationKey,
  getGoodsStatusTranslationKey,
  getGoodsPaymentStatusTranslationKey,
  getDeliveryTypeTranslationKey,
  getFulfillmentModeTranslationKey,
  getEventStatusTranslationKey,
  getBusScheduleDirectionTranslationKey,
  getDurationStatusTranslationKey,
} from '../../core/constants/status-translation-keys';

/**
 * Service to get translated status labels
 * Use this service in components to get translated status text
 * Example: this.statusService.getCommonStatusLabel(status)
 */
@Injectable({
  providedIn: 'root',
})
export class StatusTranslationService {
  constructor(private translate: TranslateService) {}

  getCommonStatusLabel(status: string): string {
    const key = getCommonStatusTranslationKey(status);
    return this.translate.instant(key);
  }

  getBookingStatusLabel(status: string, isShort: boolean = false): string {
    const key = getBookingStatusTranslationKey(status, isShort);
    return this.translate.instant(key);
  }

  getPaymentStatusLabel(status: string): string {
    const key = getPaymentStatusTranslationKey(status);
    return this.translate.instant(key);
  }

  getSeatStatusLabel(status: string): string {
    const key = getSeatStatusTranslationKey(status);
    return this.translate.instant(key);
  }

  getGoodsStatusLabel(status: string): string {
    const key = getGoodsStatusTranslationKey(status);
    return this.translate.instant(key);
  }

  getGoodsPaymentStatusLabel(status: string): string {
    const key = getGoodsPaymentStatusTranslationKey(status);
    return this.translate.instant(key);
  }

  getDeliveryTypeLabel(type: string): string {
    const key = getDeliveryTypeTranslationKey(type);
    return this.translate.instant(key);
  }

  getFulfillmentModeLabel(mode: string): string {
    const key = getFulfillmentModeTranslationKey(mode);
    return this.translate.instant(key);
  }

  getEventStatusLabel(status: string): string {
    const key = getEventStatusTranslationKey(status);
    return this.translate.instant(key);
  }

  getBusScheduleDirectionLabel(direction: string): string {
    const key = getBusScheduleDirectionTranslationKey(direction);
    return this.translate.instant(key);
  }

  getDurationStatusLabel(duration: string): string {
    const key = getDurationStatusTranslationKey(duration);
    return this.translate.instant(key);
  }
}
