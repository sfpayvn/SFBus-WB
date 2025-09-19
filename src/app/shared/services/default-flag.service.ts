// src/app/core/services/default-flag.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DefaultFlagService {
  /** Trả về true nếu item?.isDefault === true (so sánh chặt chẽ) */
  isDefault(item: any): boolean {
    return item && item.isDefault === true;
  }
}
