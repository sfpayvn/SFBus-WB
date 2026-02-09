import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { NzI18nService, en_US, vi_VN } from 'ng-zorro-antd/i18n';
import { NZ_DATE_LOCALE } from 'ng-zorro-antd/i18n';
import { enUS, vi } from 'date-fns/locale';

type Lang = 'vi' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  current: Lang = 'vi';

  constructor(
    private nzI18n: NzI18nService,
    @Inject(NZ_DATE_LOCALE) private nzDateLocale: any,
    @Inject(LOCALE_ID) private angularLocaleId: string,
  ) {}

  setLang(lang: Lang) {
    this.current = lang;

    // ng-zorro component text
    this.nzI18n.setLocale(lang === 'vi' ? vi_VN : en_US);

    // DatePicker locale (date-fns)
    // NOTE: NZ_DATE_LOCALE là token inject 1 lần; để đổi runtime đúng chuẩn,
    // bạn nên provide NZ_DATE_LOCALE thông qua factory dựa trên state (dưới đây mình đưa cách “đúng”).
  }
}
