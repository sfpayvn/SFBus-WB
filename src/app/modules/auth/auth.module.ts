import { NgModule } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthRoutingModule } from './auth-routing.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@NgModule({
  imports: [AuthRoutingModule, AngularSvgIconModule.forRoot(), NgxMaskDirective],
  providers: [provideHttpClient(withInterceptorsFromDi()), provideNgxMask()],
})
export class AuthModule {}
