import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, inject, NgModule, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MaterialModule } from './library-modules/material-module';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { QuotaInterceptor } from './shared/Interceptor/quota.interceptor';
import { AuthService } from './modules/auth/service/auth.service';

function initAuth() {
  // chạy lúc bootstrap, có injection context
  const auth = inject(AuthService);
  return auth.init(); // Promise<void> | Observable<any> đều OK
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
  ],
  providers: [
    provideAnimationsAsync(),
    provideAnimations(),
    provideNzI18n(en_US),
    provideNgxMask(),
    provideAppInitializer(initAuth),
    { provide: HTTP_INTERCEPTORS, useClass: QuotaInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
