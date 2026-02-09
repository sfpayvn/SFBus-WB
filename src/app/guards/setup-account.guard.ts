import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { CredentialService } from '../shared/services/credential.service';

@Injectable({
  providedIn: 'root',
})
export class SetupAccountGuard implements CanActivate {
  constructor(private credentialService: CredentialService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.credentialService.getCurrentUser();

    // Kiểm tra trạng thái xác thực
    if (user && user.isPhoneNumberVerified === false) {
      return Promise.resolve(true);
    }
    // Nếu đã xác thực hết thì cho vào app
    this.router.navigate(['/']);
    return Promise.resolve(false);
  }
}
