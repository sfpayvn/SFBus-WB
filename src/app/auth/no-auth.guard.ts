import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialService } from '../shared/services/credential.service';

@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
    constructor(private credentialService: CredentialService, private router: Router) { }

    canActivate(): Observable<boolean> {
        const token = this.credentialService.getToken();
        const user = this.credentialService.getCurrentUser();
        if (!token || !user) {
            return of(true);
        } else {
            this.router.navigate(['/auth/sign-in']);
            return of(false);
        }
    }
}
