import {
  CredentialService
} from "./chunk-3M7I3ANC.js";
import {
  ApiGatewayService
} from "./chunk-IVEAD5IJ.js";
import {
  catchError,
  from,
  map,
  of,
  switchMap,
  tap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-GH4JMGH7.js";
import {
  __async
} from "./chunk-TXDUYLVM.js";

// src/app/modules/auth/service/auth.service.ts
var AuthService = class _AuthService {
  constructor(apiGatewayService, credentialService) {
    this.apiGatewayService = apiGatewayService;
    this.credentialService = credentialService;
  }
  login(phoneNumber, password) {
    const user = {
      phoneNumber,
      password
    };
    const url = `/auth/login?phoneNumber=${phoneNumber}`;
    return this.apiGatewayService.post(url, user).pipe(switchMap((res) => {
      if (res) {
        return from(this.credentialService.setToken(res.access_token)).pipe(switchMap(() => this.getCurrentUser()), switchMap((user2) => {
          if (user2) {
            return from(this.credentialService.setCurrentUser(user2)).pipe(map(() => user2));
          }
          return of(null);
        }));
      }
      return of(null);
    }), catchError((error) => {
      return of(error.error);
    }));
  }
  register(phoneNumber, name) {
    const url = `/users/register`;
    const user = {
      phoneNumber,
      name,
      password: "password123",
      isTempPassWord: true
    };
    return this.apiGatewayService.post(url, user).pipe(tap((res) => {
    }), map((res) => {
      return res;
    }), catchError((err) => {
      return of(err.error);
    }));
  }
  logout() {
    return __async(this, null, function* () {
      yield this.credentialService.removeToken();
      yield this.credentialService.removeCurrentUser();
    });
  }
  getCurrentUser() {
    const url = `/users/get-current-user`;
    return this.apiGatewayService.get(url).pipe(tap((res) => {
    }), map((res) => {
      return res;
    }), catchError((error) => {
      return of(error.error);
    }));
  }
  updatePassword(password) {
    const user = {
      password,
      isTempPassWord: true
    };
    const url = `/users/update-password`;
    return this.apiGatewayService.post(url, user).pipe(tap((res) => {
    }), map((res) => {
      return res;
    }), catchError((error) => {
      return of(error.error);
    }));
  }
  updateUser(user) {
    const userToUpdate = {
      name: user.name,
      addresses: user.addresses,
      email: user.email,
      gender: user.gender,
      birthdate: user.birthdate
    };
    const url = `/users/profile`;
    return this.apiGatewayService.put(url, userToUpdate).pipe(tap((res) => {
    }), map((res) => {
      return res;
    }), catchError((error) => {
      return of(error.error);
    }));
  }
  static {
    this.\u0275fac = function AuthService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(ApiGatewayService), \u0275\u0275inject(CredentialService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
  }
};

export {
  AuthService
};
//# sourceMappingURL=chunk-RR35Z5YV.js.map
