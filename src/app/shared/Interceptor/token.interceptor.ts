import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CredentialService } from '../services/credential.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private credentialService: CredentialService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.credentialService.getToken()).pipe(
            mergeMap(token => {
            console.log("🚀 ~ TokenInterceptor ~ intercept ~ token:", token)

                if (token) {
                    const cloned = req.clone({
                        headers: req.headers.set('Authorization', `Bearer ${token}`)
                    });
                    return next.handle(cloned);
                } else {
                    return next.handle(req);
                }
            })
        );
    }
}
