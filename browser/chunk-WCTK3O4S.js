import {
  effect,
  signal,
  ɵɵdefineInjectable
} from "./chunk-GH4JMGH7.js";

// src/app/core/services/theme.service.ts
var ThemeService = class _ThemeService {
  constructor() {
    this.theme = signal({ mode: "dark", color: "base" });
    this.loadTheme();
    effect(() => {
      this.setTheme();
    });
  }
  loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme) {
      this.theme.set(JSON.parse(theme));
    }
  }
  setTheme() {
    localStorage.setItem("theme", JSON.stringify(this.theme()));
    this.setThemeClass();
  }
  get isDark() {
    return this.theme().mode == "dark";
  }
  setThemeClass() {
    document.querySelector("html").className = this.theme().mode;
    document.querySelector("html").setAttribute("data-theme", this.theme().color);
  }
  static {
    this.\u0275fac = function ThemeService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ThemeService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
  }
};

export {
  ThemeService
};
//# sourceMappingURL=chunk-WCTK3O4S.js.map
