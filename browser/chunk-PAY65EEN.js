import {
  HttpContextToken
} from "./chunk-KS4MOIL4.js";
import {
  BehaviorSubject,
  finalize,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-GH4JMGH7.js";

// src/app/shared/services/loading.service.ts
var LoadingService = class _LoadingService {
  constructor() {
    this.loadingSubject = new BehaviorSubject(false);
    this.loading$ = this.loadingSubject.asObservable();
  }
  loadingOn() {
    this.loadingSubject.next(true);
  }
  loadingOff() {
    this.loadingSubject.next(false);
  }
  static {
    this.\u0275fac = function LoadingService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoadingService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LoadingService, factory: _LoadingService.\u0275fac, providedIn: "root" });
  }
};

// src/app/shared/Interceptor/loading-interceptor.ts
var SkipLoading = new HttpContextToken(() => false);
var LoadingInterceptor = class _LoadingInterceptor {
  constructor(loadingService) {
    this.loadingService = loadingService;
  }
  intercept(req, next) {
    if (req.context.get(SkipLoading) || req.url.includes("file/view")) {
      return next.handle(req);
    }
    this.loadingService.loadingOn();
    return next.handle(req).pipe(finalize(() => {
      this.loadingService.loadingOff();
    }));
  }
  static {
    this.\u0275fac = function LoadingInterceptor_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoadingInterceptor)(\u0275\u0275inject(LoadingService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LoadingInterceptor, factory: _LoadingInterceptor.\u0275fac });
  }
};

// src/environments/environment.model.ts
var Environment = class {
  constructor() {
    this.apiUrl = "http://192.168.1.164:8080";
    this.production = false;
    this.isWebApp = false;
  }
};

export {
  Environment,
  LoadingService,
  SkipLoading,
  LoadingInterceptor
};
//# sourceMappingURL=chunk-PAY65EEN.js.map
