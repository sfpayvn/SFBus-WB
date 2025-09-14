import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { from, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { CredentialService } from 'src/app/shared/services/credential.service';
import { AuthRescue, RequestForgotPassword, RequestResetPassword, SignUp, VerifyAuthRescue } from '../model/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiGatewayService: ApiGatewayService, private credentialService: CredentialService) {}

  login(phoneNumber: string, password: string, tenantCode: string) {
    const user = {
      phoneNumber,
      password,
      tenantCode,
    };
    const url = `/auth/login?phoneNumber=${phoneNumber}`;

    return this.apiGatewayService.post(url, user).pipe(
      switchMap((res: any) => {
        if (res) {
          return this.handleAuthenticationSuccess(res.access_token);
        }
        return of(null); // No response from API
      }),
      catchError((error) => {
        // Log the error or handle it gracefully
        console.error('Login error:', error);
        return of(error);
      }),
    );
  }

  /**
   * Handle successful authentication by setting token and current user
   * @param accessToken - The access token from authentication response
   * @returns Observable with user data or null
   */
  private handleAuthenticationSuccess(accessToken: string) {
    // Ensure setToken is completed before proceeding
    return from(this.credentialService.setToken(accessToken)).pipe(
      concatMap(() =>
        this.getCurrentUser().pipe(
          concatMap((user: any) => {
            if (user) {
              // Ensure setCurrentUser is completed before resolving the user
              return from(this.credentialService.setCurrentUser(user)).pipe(map(() => user));
            }
            return of(null); // No user found
          }),
          catchError((err: HttpErrorResponse) => {
            console.error('handleAuthenticationSuccess error:', err);
            // ví dụ: hiện toast có mã lỗi server 500
            const msg = err?.error?.message || err.message || 'Unexpected error';
            // toast.error(`Get current user failed (${err.status}): ${msg}`);
            return throwError(() => err); // rất quan trọng: **rethrow** để bên ngoài bắt được
          }),
        ),
      ),
    );
  }

  signUp(signUp: SignUp, skipLoading: boolean) {
    return this.apiGatewayService.post('/admin/auth/signUp', signUp, skipLoading).pipe(
      switchMap((res: any) => {
        if (res) {
          return this.handleAuthenticationSuccess(res.access_token);
        }
        return of(null); // No response from API
      }),
      catchError((error) => {
        // Log the error or handle it gracefully
        console.error('Login error:', error);
        return of(error);
      }),
    );
  }

  async logout() {
    await this.credentialService.removeToken();
    await this.credentialService.removeCurrentUser();
  }

  getCurrentUser() {
    const url = `/admin/users/get-current-user`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  updatePassword(password: string) {
    const user = {
      password,
      isTempPassWord: true,
    };
    const url = `/admin/users/update-password`;
    return this.apiGatewayService.post(url, user).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  updateUser(user: any) {
    const userToUpdate = {
      name: user.name,
      addresses: user.addresses,
      email: user.email,
      gender: user.gender,
      birthdate: user.birthdate,
    };
    const url = `/users/profile`;
    return this.apiGatewayService.put(url, userToUpdate).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  requestAuthRescue(authRescue: AuthRescue) {
    const url = `/admin/auth/rescue/request`;
    return this.apiGatewayService.post(url, authRescue).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  validateOtp(verifyAuthRescue: VerifyAuthRescue) {
    const url = `/admin/auth/rescue/verify`;
    return this.apiGatewayService.post(url, verifyAuthRescue).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  forgotPassword(requestForgotPassword: RequestForgotPassword) {
    const url = `/admin/auth/forgot-password`;
    return this.apiGatewayService.post(url, requestForgotPassword).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  resetPassword(requestResetPassword: RequestResetPassword) {
    const url = `/admin/auth/reset-password`;
    return this.apiGatewayService.post(url, requestResetPassword).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }
}
