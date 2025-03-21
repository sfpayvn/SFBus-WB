import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialService } from '../shared/services/credential.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private credentialService: CredentialService, private router: Router) { }

    async canActivate(): Promise<boolean> {
        const token = await this.credentialService.getToken();
        const user = await this.credentialService.getCurrentUser();
        if (token && user) {
            return Promise.resolve(true);
        } else {
            this.router.navigate(['/auth/sign-in']);
            return Promise.resolve(false);
        }
    }
}
