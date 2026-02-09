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
      if (!token) {
        this.credentialService.removeCurrentUser();
        this.credentialService.removeToken();
        return;
      }
      const currentUser = await this.getCurrentUser().toPromise();
      await this.capsService.bootstrap(); // chờ bootstrap hoàn tất
      this.credentialService.setCurrentUser(currentUser);
      await this.menuService.reloadPagesAndExpand(); // rồi reload menu
    } catch {
      this.credentialService.removeCurrentUser();
      this.credentialService.removeToken();
    } finally {
      this.initialized.set(true);
    }
  }

  login(phoneNumber: string, password: string, tenantCode: string) {
    const body = { phoneNumber, password, tenantCode };
    const url = `/admin/auth/login?phoneNumber=${encodeURIComponent(phoneNumber)}`;

    return this.apiGatewayService.post(url, body).pipe(
      map((res: any) => res?.access_token),
      filter((token): token is string => !!token), // chỉ đi tiếp khi có token
      switchMap((token) => this.handleAuthenticationSuccess(token)),
      take(1),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error); // để caller xử lý
      }),
    );
  }

  /**
   * Đặt token -> lấy current user -> lưu current user -> bootstrap caps
   * Trả về Observable<User | null>
   */
  private handleAuthenticationSuccess(accessToken: string) {
    return defer(() => from(this.credentialService.setToken(accessToken))).pipe(
      switchMap(() => this.getCurrentUser()),
      switchMap((user: any) => {
        if (!user) return of(null);
        // đảm bảo setCurrentUser hoàn tất trước khi trả user
        return from(this.credentialService.setCurrentUser(user)).pipe(
          switchMap(() => from(this.capsService.bootstrap())), // chờ bootstrap hoàn tất
          switchMap(() => from(this.roleAccessService.initializeUserRoles())), // init roles từ current user
          switchMap(() => from(this.menuService.reloadPagesAndExpand())), // rồi reload menu
          map(() => user),
        );
      }),
      catchError((err) => {
        console.error('handleAuthenticationSuccess error:', err);
        const msg = err?.error?.message || err.message || 'Unexpected error';
        // ví dụ: show toast ở ngoài; ở đây rethrow để tầng gọi xử lý
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
