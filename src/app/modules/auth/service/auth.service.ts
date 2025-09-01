import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { from, of } from 'rxjs';
import { catchError, concatMap, delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { CredentialService } from 'src/app/shared/services/credential.service';
import { SignUp } from '../model/sign-up.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiGatewayService: ApiGatewayService, private credentialService: CredentialService) {}

  login(phoneNumber: string, password: string) {
    const user = {
      phoneNumber,
      password,
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
      catchError((error) => {
        //write log
        return of(error.error);
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
      catchError((error) => {
        //write log
        return of(error.error);
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
      catchError((error) => {
        //write log
        return of(error.error);
      }),
    );
  }

  validateOtp(otp: string) {
    const url = `/admin/auth/validate-otp/${otp}`;
    return this.apiGatewayService.post(url, {}).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        //write log
        return of(error.error);
      }),
    );
  }
}
