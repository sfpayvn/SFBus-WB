import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CredentialService } from '../shared/services/credential.service';

@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
    constructor(private credentialService: CredentialService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.credentialService.getCurrentUser().pipe(
            map(user => {
                console.log("🚀 ~ NoAuthGuard ~ canActivate ~ user:", user)
                if (!user) {
                    return true;
                } else {
                    this.router.navigate(['/dashboard/nfts']);
                    return false;
                }
            })
        );
    }
}
