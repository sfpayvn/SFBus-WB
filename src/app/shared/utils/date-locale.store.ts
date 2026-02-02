import { Injectable } from '@angular/core';
import { enUS, vi } from 'date-fns/locale';

@Injectable({ providedIn: 'root' })
export class DateLocaleStore {
  locale = vi;
  set(lang: 'vi' | 'en') {
    this.locale = lang === 'vi' ? vi : enUS;
  }
}
