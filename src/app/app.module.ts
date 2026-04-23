import { CUSTOM_ELEMENTS_SCHEMA, inject, LOCALE_ID, NgModule, provideAppInitializer } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MaterialModule } from './library-modules/material-module';
import { NZ_I18N, vi_VN, NZ_DATE_LOCALE, provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { QuotaInterceptor } from './shared/Interceptor/quota.interceptor';
import { AuthService } from './modules/auth/service/auth.service';
import { LanguageService } from './shared/services/language.service';

import { DateLocaleStore } from './shared/utils/date-locale.store';

// APP_INITIALIZER - initAuth
function initAuth() {
  const auth = inject(AuthService);
  return auth.init(); // Promise<void> | Observable<any>
}

// APP_INITIALIZER - initLanguages
function initLanguages() {
  // Initialize language service before app starts
  const languageService = inject(LanguageService);
  // Return Promise that resolves when all translations are loaded
  return languageService.initLanguage();
}

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    HttpClientModule,
    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    MaterialModule,
    AngularSvgIconModule.forRoot(),
    NgxMaskDirective,
    TranslateModule.forRoot({ defaultLanguage: 'vi' }),
  ],
  providers: [
    provideAnimationsAsync(),
    provideAnimations(),
    {
      provide: NZ_DATE_LOCALE,
      useFactory: (s: DateLocaleStore) => s.locale,
      deps: [DateLocaleStore],
    },
    provideNgxMask(),
    provideNzI18n(en_US),
    provideAppInitializer(initLanguages),
    provideAppInitializer(initAuth),

    { provide: HTTP_INTERCEPTORS, useClass: QuotaInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
