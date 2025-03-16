import {
  Environment,
  SkipLoading
} from "./chunk-PAY65EEN.js";
import {
  HttpClient,
  HttpContext,
  HttpHeaders
} from "./chunk-KS4MOIL4.js";
import {
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-GH4JMGH7.js";

// src/environments/environment.development.ts
var environment = class extends Environment {
  constructor() {
    super(...arguments);
    this.production = false;
  }
};
var ENV = new environment();

// src/app/api-gateway/api-gateaway.service.ts
var ApiGatewayService = class _ApiGatewayService {
  constructor(http) {
    this.http = http;
    this.api = ENV.apiUrl;
  }
  createHeaders(skipLoading) {
    let headers = new HttpHeaders();
    let context = new HttpContext().set(SkipLoading, skipLoading);
    headers = headers.set("Access-Control-Allow-Origin", "*");
    headers = headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    headers = headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    return { headers, context };
  }
  request(method, url, body = null, skipLoading = false) {
    const { headers, context } = this.createHeaders(skipLoading);
    url = this.api + url;
    switch (method) {
      case "GET":
        return this.http.get(url, { headers, context });
      case "POST":
        return this.http.post(url, body, { headers, context });
      case "PUT":
        return this.http.put(url, body, { headers, context });
      case "DELETE":
        return this.http.delete(url, { headers, context });
      default:
        throw new Error("Unsupported request method");
    }
  }
  get(url, skipLoading = false) {
    return this.request("GET", url, null, skipLoading);
  }
  post(url, body, skipLoading = false) {
    return this.request("POST", url, body, skipLoading);
  }
  put(url, body, skipLoading = false) {
    return this.request("PUT", url, body, skipLoading);
  }
  delete(url, skipLoading = false) {
    return this.request("DELETE", url, null, skipLoading);
  }
  static {
    this.\u0275fac = function ApiGatewayService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ApiGatewayService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiGatewayService, factory: _ApiGatewayService.\u0275fac, providedIn: "root" });
  }
};

export {
  ApiGatewayService
};
//# sourceMappingURL=chunk-IVEAD5IJ.js.map
