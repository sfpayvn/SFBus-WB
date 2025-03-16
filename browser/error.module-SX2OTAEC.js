import {
  ButtonComponent
} from "./chunk-GOMQHCFW.js";
import {
  AngularSvgIconModule,
  Router,
  RouterModule,
  RouterOutlet,
  SvgIconComponent,
  provideHttpClient,
  withInterceptorsFromDi
} from "./chunk-KS4MOIL4.js";
import {
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵtext
} from "./chunk-GH4JMGH7.js";
import "./chunk-TXDUYLVM.js";

// src/app/modules/error/error.component.ts
var ErrorComponent = class _ErrorComponent {
  static {
    this.\u0275fac = function ErrorComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ErrorComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ErrorComponent, selectors: [["app-error"]], decls: 3, vars: 0, consts: [[1, "flex", "h-screen", "w-screen"], [1, "flex", "flex-1", "items-center", "justify-center", "bg-card", "bg-cover"]], template: function ErrorComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275element(2, "router-outlet");
        \u0275\u0275elementEnd()();
      }
    }, dependencies: [RouterOutlet], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ErrorComponent, { className: "ErrorComponent", filePath: "src/app/modules/error/error.component.ts", lineNumber: 9 });
})();

// src/app/modules/error/pages/error404/error404.component.ts
var Error404Component = class _Error404Component {
  constructor(router) {
    this.router = router;
  }
  goToHomePage() {
    this.router.navigate(["/"]);
  }
  static {
    this.\u0275fac = function Error404Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Error404Component)(\u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Error404Component, selectors: [["app-error404"]], decls: 8, vars: 0, consts: [[1, "bg-background", "shadow-xs", "flex", "max-w-lg", "flex-col", "items-center", "justify-center", "gap-2", "rounded-lg", "p-8", "text-center"], [1, "text-foreground", "text-4xl", "font-bold"], [1, "text-muted-foreground", "text-base"], ["impact", "bold", "tone", "primary", "shape", "rounded", "size", "medium", 3, "buttonClick"], ["src", "assets/illustrations/404.svg", "svgClass", "w-[300px] h-[300px] text-muted-foreground  "]], template: function Error404Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Oops!");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "p", 2);
        \u0275\u0275text(4, " We can't find that page. You can go back to the previous page or go to the homepage. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "app-button", 3);
        \u0275\u0275listener("buttonClick", function Error404Component_Template_app_button_buttonClick_5_listener() {
          return ctx.goToHomePage();
        });
        \u0275\u0275text(6, " Homepage ");
        \u0275\u0275elementEnd();
        \u0275\u0275element(7, "svg-icon", 4);
        \u0275\u0275elementEnd();
      }
    }, dependencies: [AngularSvgIconModule, SvgIconComponent, ButtonComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Error404Component, { className: "Error404Component", filePath: "src/app/modules/error/pages/error404/error404.component.ts", lineNumber: 12 });
})();

// src/app/modules/error/pages/error500/error500.component.ts
var Error500Component = class _Error500Component {
  constructor(router) {
    this.router = router;
  }
  goToHomePage() {
    this.router.navigate(["/"]);
  }
  static {
    this.\u0275fac = function Error500Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Error500Component)(\u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Error500Component, selectors: [["app-error500"]], decls: 8, vars: 0, consts: [[1, "bg-background", "shadow-xs", "flex", "max-w-lg", "flex-col", "items-center", "justify-center", "gap-2", "rounded-lg", "p-8", "text-center"], [1, "text-foreground", "text-4xl", "font-bold"], [1, "text-muted-foreground", "text-base"], ["impact", "bold", "tone", "primary", "shape", "rounded", "size", "medium", 3, "buttonClick"], ["src", "assets/illustrations/500.svg", "svgClass", "w-[300px] h-[300px] text-muted-foreground "]], template: function Error500Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Oops! Server Error");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "p", 2);
        \u0275\u0275text(4, " Please try again later. If the issue persists, feel free to contact us for assistance. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "app-button", 3);
        \u0275\u0275listener("buttonClick", function Error500Component_Template_app_button_buttonClick_5_listener() {
          return ctx.goToHomePage();
        });
        \u0275\u0275text(6, " Homepage ");
        \u0275\u0275elementEnd();
        \u0275\u0275element(7, "svg-icon", 4);
        \u0275\u0275elementEnd();
      }
    }, dependencies: [AngularSvgIconModule, SvgIconComponent, ButtonComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Error500Component, { className: "Error500Component", filePath: "src/app/modules/error/pages/error500/error500.component.ts", lineNumber: 11 });
})();

// src/app/modules/error/error-routing.module.ts
var routes = [
  {
    path: "",
    component: ErrorComponent,
    children: [
      { path: "", redirectTo: "404", pathMatch: "full" },
      { path: "404", component: Error404Component },
      { path: "500", component: Error500Component },
      { path: "**", redirectTo: "errors/404" }
    ]
  }
];
var ErrorRoutingModule = class _ErrorRoutingModule {
  static {
    this.\u0275fac = function ErrorRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ErrorRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _ErrorRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
  }
};

// src/app/modules/error/error.module.ts
var ErrorModule = class _ErrorModule {
  static {
    this.\u0275fac = function ErrorModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ErrorModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _ErrorModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [provideHttpClient(withInterceptorsFromDi())], imports: [ErrorRoutingModule, AngularSvgIconModule.forRoot()] });
  }
};
export {
  ErrorModule
};
//# sourceMappingURL=error.module-SX2OTAEC.js.map
