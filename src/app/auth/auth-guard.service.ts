import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialService } from '../shared/services/credential.service';
import { User } from '@rsApp/modules/management/modules/user-management/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private credentialService: CredentialService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const token = await this.credentialService.getToken();
    const user: User = await this.credentialService.getCurrentUser();

    if (token && user) {
      if (user.isPhoneNumberVerified == false) {
        this.router.navigate(['/auth/verify-otp']);
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    } else {
      this.router.navigate(['/auth/sign-in']);
      return Promise.resolve(false);
    }
  }
}
