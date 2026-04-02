import { Pipe, PipeTransform } from '@angular/core';
import { StatusTranslationService } from '../services/status-translation.service';

/**
 * Pipe to translate status labels in templates
 * Usage examples:
 * {{ status | statusLabel }}
 * {{ status | statusLabel:'booking' }}
 * {{ status | statusLabel:'booking':true }}  // for short labels
 */
@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  constructor(private statusService: StatusTranslationService) {}

  transform(status: string, type: string = 'common', isShort: boolean = false): string {
    switch (type.toLowerCase()) {
      case 'common':
        return this.statusService.getCommonStatusLabel(status);
      case 'booking':
        return this.statusService.getBookingStatusLabel(status, isShort);
      case 'payment':
        return this.statusService.getPaymentStatusLabel(status);
      case 'seat':
        return this.statusService.getSeatStatusLabel(status);
      case 'goods':
        return this.statusService.getGoodsStatusLabel(status);
      case 'goodspayment':
        return this.statusService.getGoodsPaymentStatusLabel(status);
      case 'delivery':
        return this.statusService.getDeliveryTypeLabel(status);
      case 'fulfillment':
        return this.statusService.getFulfillmentModeLabel(status);
      case 'event':
        return this.statusService.getEventStatusLabel(status);
      case 'direction':
        return this.statusService.getBusScheduleDirectionLabel(status);
      case 'duration':
        return this.statusService.getDurationStatusLabel(status);
      default:
        return status;
    }
  }
}
