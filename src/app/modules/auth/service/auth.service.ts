import { Injectable, signal } from '@angular/core';
import * as _ from 'lodash';
import { defer, from, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { CredentialService } from 'src/app/shared/services/credential.service';
import {
  AuthRescue,
  RequestForgotPassword,
  RequestResetPassword,
  SignUp,
  UpdatePasswordUserRequest,
  VerifyAuthRescue,
} from '../model/auth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CapsService } from '@rsApp/shared/services/caps.service';
import { MenuService } from '@rsApp/modules/layout/services/menu.service';
import { RoleAccessService } from '@rsApp/core/services/role-access.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  initialized = signal(false);

  constructor(
    private apiGatewayService: ApiGatewayService,
    private credentialService: CredentialService,
    private capsService: CapsService,
    private menuService: MenuService,
    private roleAccessService: RoleAccessService,
  ) {}

  async init(): Promise<void> {
    try {
      const token = await this.credentialService.getToken();
      const hasRememberMe = !!localStorage.getItem('rememberMeCredentials');
      const sessionActive = !!sessionStorage.getItem('sessionActiveFlag');

      // If no token, logout
      if (!token) {
        await this.logout();
        return;
      }

      // If token exists but session ended
      if (!sessionActive) {
        // If user checked "Remember Me", keep them logged in by restoring session
        if (hasRememberMe) {
          sessionStorage.setItem('sessionActiveFlag', 'true');
        } else {
          // User didn't check "Remember Me", so logout
          await this.logout();
          return;
        }
      }

      const currentUser = await this.getCurrentUser().toPromise();
      await this.capsService.bootstrap(); // wait for bootstrap to complete
      this.credentialService.setCurrentUser(currentUser);
      await this.menuService.reloadPagesAndExpand(); // then reload menu
    } catch {
      await this.logout();
    } finally {
      this.initialized.set(true);
    }
  }

  login(phoneNumber: string, password: string, tenantCode: string) {
    const body = { phoneNumber, password, tenantCode };
    const url = `/admin/auth/login?phoneNumber=${encodeURIComponent(phoneNumber)}`;

    return this.apiGatewayService.post(url, body).pipe(
      map((res: any) => res?.access_token),
      filter((token): token is string => !!token), // only proceed when token is available
      switchMap((token) => this.handleAuthenticationSuccess(token)),
      take(1),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error); // let caller handle
      }),
    );
  }

  /**
   * Set token -> get current user -> save current user -> bootstrap caps
   * Return Observable<User | null>
   */
  private handleAuthenticationSuccess(accessToken: string) {
    return defer(() => from(this.credentialService.setToken(accessToken))).pipe(
      switchMap(() => this.getCurrentUser()),
      switchMap((user: any) => {
        if (!user) return of(null);
        // ensure setCurrentUser completes before returning user
        return from(this.credentialService.setCurrentUser(user)).pipe(
          switchMap(() => from(this.capsService.bootstrap())), // wait for bootstrap to complete
          switchMap(() => from(this.roleAccessService.initializeUserRoles())), // init roles from current user
          switchMap(() => from(this.menuService.reloadPagesAndExpand())), // then reload menu
          map(() => user),
        );
      }),
      catchError((err) => {
        console.error('handleAuthenticationSuccess error:', err);
        const msg = err?.error?.message || err.message || 'Unexpected error';
        // example: show toast outside; here we rethrow for caller to handle
        return throwError(() => err);
      }),
    );
  }

  signUp(signUp: SignUp, skipLoading: boolean) {
    return this.apiGatewayService.post('/admin/auth/signUp', signUp, { skipLoading: skipLoading }).pipe(
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
    await this.capsService.clear();
    // Clear RBAC cache
    this.roleAccessService.clearCache();
  }

  getCurrentUser() {
    const url = `/admin/auth/get-current-user`;
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

  updatePassword(updatePasswordUserRequest: UpdatePasswordUserRequest) {
    const url = `/admin/auth/update-password`;
    return this.apiGatewayService.post(url, updatePasswordUserRequest).pipe(
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
    const url = `/admin/a/users/profile`;
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
