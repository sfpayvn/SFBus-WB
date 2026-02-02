import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';

import { ENV } from '@app/env';
import { TokenInterceptor } from './app/shared/Interceptor/token.interceptor';
import { LoadingInterceptor } from './app/shared/Interceptor/loading-interceptor';
import { LoadingService } from './app/shared/services/loading.service';

// locale data
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/vi';
import { registerLocaleData } from '@angular/common';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

if (ENV.production) {
  enableProdMode();
  if (window) {
    selfXSSWarning();
  }
}

registerLocaleData(en);
registerLocaleData(vi);

bootstrapApplication(AppComponent, {
  providers: [
    // bring NgModule providers into standalone bootstrap
    importProvidersFrom(BrowserModule, AppModule, LoadingService),

    provideAnimations(),
    provideAnimationsAsync(),

    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },

    // ngx-translate core
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'vi',
      }),
    ),

    // ngx-translate http loader (version mới - constructor 0 args)
    ...provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json',
    }),
  ],
}).catch((err) => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;',
    );
    console.log(
      `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
      'font-weight:bold; font: 2em Arial; color: #e11d48;',
    );
  });
}
