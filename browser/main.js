import {
  A11yModule,
  BrowserAnimationsModule,
  CdkStepperModule,
  CdkTableModule,
  CdkTreeModule,
  DragDropModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  PortalModule,
  en_US,
  provideAnimations,
  provideNgxMask,
  provideNzI18n
} from "./chunk-AVLKMC2C.js";
import "./chunk-W4VBAWVF.js";
import {
  ThemeService
} from "./chunk-WCTK3O4S.js";
import {
  ScrollingModule
} from "./chunk-OFTPT2DW.js";
import "./chunk-IZ7LJD7S.js";
import {
  FormsModule,
  NgxSonnerToaster,
  ReactiveFormsModule,
  toast
} from "./chunk-IJ3IFA7D.js";
import {
  CredentialService
} from "./chunk-3M7I3ANC.js";
import {
  Environment,
  LoadingInterceptor,
  LoadingService
} from "./chunk-PAY65EEN.js";
import {
  AngularSvgIconModule,
  BrowserModule,
  DomRendererFactory2,
  HTTP_INTERCEPTORS,
  HttpClientModule,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterModule,
  RouterOutlet,
  bootstrapApplication
} from "./chunk-KS4MOIL4.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionScheduler,
  CommonModule,
  DOCUMENT,
  Injectable,
  InjectionToken,
  Injector,
  NgIf,
  NgZone,
  RendererFactory2,
  RuntimeError,
  enableProdMode,
  importProvidersFrom,
  inject,
  makeEnvironmentProviders,
  of,
  performanceMarkFeature,
  setClassMetadata,
  tap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵinject,
  ɵɵinvalidFactory,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-GH4JMGH7.js";
import "./chunk-TXDUYLVM.js";

// src/environments/environment.ts
var environment = class extends Environment {
  constructor() {
    super(...arguments);
    this.production = false;
  }
};
var ENV = new environment();

// src/app/shared/components/responsive-helper/responsive-helper.component.ts
function ResponsiveHelperComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "span", 2);
    \u0275\u0275text(2, "sm");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 3);
    \u0275\u0275text(4, "md");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 4);
    \u0275\u0275text(6, "lg");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 5);
    \u0275\u0275text(8, "xl");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 6);
    \u0275\u0275text(10, "2xl");
    \u0275\u0275elementEnd()();
  }
}
var ResponsiveHelperComponent = class _ResponsiveHelperComponent {
  constructor() {
    this.env = environment;
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function ResponsiveHelperComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ResponsiveHelperComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ResponsiveHelperComponent, selectors: [["app-responsive-helper"]], decls: 1, vars: 1, consts: [["class", "fixed bottom-20 right-5 hidden rounded-md bg-primary py-1 px-3 align-middle text-sm font-medium text-primary-foreground sm:block", 4, "ngIf"], [1, "fixed", "bottom-20", "right-5", "hidden", "rounded-md", "bg-primary", "py-1", "px-3", "align-middle", "text-sm", "font-medium", "text-primary-foreground", "sm:block"], [1, "hidden", "sm:block", "md:hidden"], [1, "hidden", "md:block", "lg:hidden"], [1, "hidden", "lg:block", "xl:hidden"], [1, "hidden", "xl:block", "2xl:hidden"], [1, "hidden", "2xl:block"]], template: function ResponsiveHelperComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, ResponsiveHelperComponent_div_0_Template, 11, 0, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", !ctx.env.production);
      }
    }, dependencies: [NgIf], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ResponsiveHelperComponent, { className: "ResponsiveHelperComponent", filePath: "src/app/shared/components/responsive-helper/responsive-helper.component.ts", lineNumber: 11 });
})();

// src/app/shared/components/loadding-screen/loadding-screen.component.ts
function LoaddingScreenComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "img", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 4)(5, "span", 5);
    \u0275\u0275text(6, "L");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 6);
    \u0275\u0275text(8, "O");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 7);
    \u0275\u0275text(10, "A");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 8);
    \u0275\u0275text(12, "D");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 9);
    \u0275\u0275text(14, "I");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 10);
    \u0275\u0275text(16, "N");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 11);
    \u0275\u0275text(18, "G");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 12);
    \u0275\u0275text(20, ".");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 12);
    \u0275\u0275text(22, ".");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 12);
    \u0275\u0275text(24, ".");
    \u0275\u0275elementEnd()()()();
  }
}
var LoaddingScreenComponent = class _LoaddingScreenComponent {
  constructor(loadingService, router) {
    this.loadingService = loadingService;
    this.router = router;
    this.detectRouteTransitions = false;
    this.loading$ = false;
    this.loadingService.loading$.subscribe((res) => {
      this.loading$ = res;
    });
  }
  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events.pipe(tap((event) => {
        if (event instanceof RouteConfigLoadStart) {
          this.loadingService.loadingOn();
        } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingService.loadingOff();
        }
      })).subscribe();
    }
  }
  static {
    this.\u0275fac = function LoaddingScreenComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoaddingScreenComponent)(\u0275\u0275directiveInject(LoadingService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoaddingScreenComponent, selectors: [["app-loadding-screen"]], inputs: { detectRouteTransitions: "detectRouteTransitions" }, decls: 1, vars: 1, consts: [["id", "page"], ["id", "container"], [1, "flex", "items-center", "justify-center", "w-full"], ["src", "assets/images/logo.png", "alt", "", 1, "w-42"], [1, "loading", "loading06"], ["data-text", "L"], ["data-text", "O"], ["data-text", "A"], ["data-text", "D"], ["data-text", "I"], ["data-text", "N"], ["data-text", "G"], ["data-text", "."]], template: function LoaddingScreenComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, LoaddingScreenComponent_Conditional_0_Template, 25, 0, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.loading$ === true ? 0 : -1);
      }
    }, styles: ['\n\n#page[_ngcontent-%COMP%] {\n  position: fixed;\n  z-index: 100;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: rgba(0, 0, 0, 0.32);\n  transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n#container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: relative;\n  flex-wrap: wrap;\n}\n.loading[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-family: "Montserrat", sans-serif;\n  font-weight: 800;\n  text-align: center;\n}\n.loading[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin: 0 -0.05em;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  position: relative;\n  color: black;\n  padding: 0 2px;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  content: attr(data-text);\n  color: #fff;\n  opacity: 0;\n  transform: rotateY(-90deg);\n  animation: _ngcontent-%COMP%_loading06 4s infinite;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2)::after {\n  animation-delay: 0.2s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3)::after {\n  animation-delay: 0.4s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(4)::after {\n  animation-delay: 0.6s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(5)::after {\n  animation-delay: 0.8s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(6)::after {\n  animation-delay: 1s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(7)::after {\n  animation-delay: 1.2s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(8)::after {\n  animation-delay: 1.4s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(9)::after {\n  animation-delay: 1.6s;\n}\n.loading06[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(10)::after {\n  animation-delay: 1.8s;\n}\n@keyframes _ngcontent-%COMP%_loading06 {\n  0%, 75%, 100% {\n    transform: rotateY(-90deg);\n    opacity: 0;\n  }\n  25%, 50% {\n    transform: rotateY(0);\n    opacity: 1;\n  }\n}\n/*# sourceMappingURL=loadding-screen.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoaddingScreenComponent, { className: "LoaddingScreenComponent", filePath: "src/app/shared/components/loadding-screen/loadding-screen.component.ts", lineNumber: 12 });
})();

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  constructor(themeService) {
    this.themeService = themeService;
    this.toast = toast;
    this.title = "Angular Tailwind";
  }
  static {
    this.\u0275fac = function AppComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppComponent)(\u0275\u0275directiveInject(ThemeService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 5, vars: 2, consts: [[3, "theme"], [3, "detectRouteTransitions"]], template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div");
        \u0275\u0275element(1, "router-outlet")(2, "app-responsive-helper")(3, "ngx-sonner-toaster", 0)(4, "app-loadding-screen", 1);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("theme", ctx.themeService.isDark ? "dark" : "light");
        \u0275\u0275advance();
        \u0275\u0275property("detectRouteTransitions", true);
      }
    }, dependencies: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster, LoaddingScreenComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 13 });
})();

// node_modules/@angular/platform-browser/fesm2022/animations/async.mjs
var ANIMATION_PREFIX = "@";
var AsyncAnimationRendererFactory = class _AsyncAnimationRendererFactory {
  doc;
  delegate;
  zone;
  animationType;
  moduleImpl;
  _rendererFactoryPromise = null;
  scheduler = null;
  injector = inject(Injector);
  loadingSchedulerFn = inject(\u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN, {
    optional: true
  });
  _engine;
  /**
   *
   * @param moduleImpl allows to provide a mock implmentation (or will load the animation module)
   */
  constructor(doc, delegate, zone, animationType, moduleImpl) {
    this.doc = doc;
    this.delegate = delegate;
    this.zone = zone;
    this.animationType = animationType;
    this.moduleImpl = moduleImpl;
  }
  /** @nodoc */
  ngOnDestroy() {
    this._engine?.flush();
  }
  /**
   * @internal
   */
  loadImpl() {
    const loadFn = () => this.moduleImpl ?? import("./browser-EAVZEPX2.js").then((m) => m);
    let moduleImplPromise;
    if (this.loadingSchedulerFn) {
      moduleImplPromise = this.loadingSchedulerFn(loadFn);
    } else {
      moduleImplPromise = loadFn();
    }
    return moduleImplPromise.catch((e) => {
      throw new RuntimeError(5300, (typeof ngDevMode === "undefined" || ngDevMode) && "Async loading for animations package was enabled, but loading failed. Angular falls back to using regular rendering. No animations will be displayed and their styles won't be applied.");
    }).then(({
      \u0275createEngine,
      \u0275AnimationRendererFactory
    }) => {
      this._engine = \u0275createEngine(this.animationType, this.doc);
      const rendererFactory = new \u0275AnimationRendererFactory(this.delegate, this._engine, this.zone);
      this.delegate = rendererFactory;
      return rendererFactory;
    });
  }
  /**
   * This method is delegating the renderer creation to the factories.
   * It uses default factory while the animation factory isn't loaded
   * and will rely on the animation factory once it is loaded.
   *
   * Calling this method will trigger as side effect the loading of the animation module
   * if the renderered component uses animations.
   */
  createRenderer(hostElement, rendererType) {
    const renderer = this.delegate.createRenderer(hostElement, rendererType);
    if (renderer.\u0275type === 0) {
      return renderer;
    }
    if (typeof renderer.throwOnSyntheticProps === "boolean") {
      renderer.throwOnSyntheticProps = false;
    }
    const dynamicRenderer = new DynamicDelegationRenderer(renderer);
    if (rendererType?.data?.["animation"] && !this._rendererFactoryPromise) {
      this._rendererFactoryPromise = this.loadImpl();
    }
    this._rendererFactoryPromise?.then((animationRendererFactory) => {
      const animationRenderer = animationRendererFactory.createRenderer(hostElement, rendererType);
      dynamicRenderer.use(animationRenderer);
      this.scheduler ??= this.injector.get(ChangeDetectionScheduler, null, {
        optional: true
      });
      this.scheduler?.notify(
        10
        /* NotificationSource.AsyncAnimationsLoaded */
      );
    }).catch((e) => {
      dynamicRenderer.use(renderer);
    });
    return dynamicRenderer;
  }
  begin() {
    this.delegate.begin?.();
  }
  end() {
    this.delegate.end?.();
  }
  whenRenderingDone() {
    return this.delegate.whenRenderingDone?.() ?? Promise.resolve();
  }
  /**
   * Used during HMR to clear any cached data about a component.
   * @param componentId ID of the component that is being replaced.
   */
  componentReplaced(componentId) {
    this._engine?.flush();
    this.delegate.componentReplaced?.(componentId);
  }
  static \u0275fac = function AsyncAnimationRendererFactory_Factory(__ngFactoryType__) {
    \u0275\u0275invalidFactory();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _AsyncAnimationRendererFactory,
    factory: _AsyncAnimationRendererFactory.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AsyncAnimationRendererFactory, [{
    type: Injectable
  }], () => [{
    type: Document
  }, {
    type: RendererFactory2
  }, {
    type: NgZone
  }, {
    type: void 0
  }, {
    type: Promise
  }], null);
})();
var DynamicDelegationRenderer = class {
  delegate;
  // List of callbacks that need to be replayed on the animation renderer once its loaded
  replay = [];
  \u0275type = 1;
  constructor(delegate) {
    this.delegate = delegate;
  }
  use(impl) {
    this.delegate = impl;
    if (this.replay !== null) {
      for (const fn of this.replay) {
        fn(impl);
      }
      this.replay = null;
    }
  }
  get data() {
    return this.delegate.data;
  }
  destroy() {
    this.replay = null;
    this.delegate.destroy();
  }
  createElement(name, namespace) {
    return this.delegate.createElement(name, namespace);
  }
  createComment(value) {
    return this.delegate.createComment(value);
  }
  createText(value) {
    return this.delegate.createText(value);
  }
  get destroyNode() {
    return this.delegate.destroyNode;
  }
  appendChild(parent, newChild) {
    this.delegate.appendChild(parent, newChild);
  }
  insertBefore(parent, newChild, refChild, isMove) {
    this.delegate.insertBefore(parent, newChild, refChild, isMove);
  }
  removeChild(parent, oldChild, isHostElement) {
    this.delegate.removeChild(parent, oldChild, isHostElement);
  }
  selectRootElement(selectorOrNode, preserveContent) {
    return this.delegate.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node) {
    return this.delegate.parentNode(node);
  }
  nextSibling(node) {
    return this.delegate.nextSibling(node);
  }
  setAttribute(el, name, value, namespace) {
    this.delegate.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el, name, namespace) {
    this.delegate.removeAttribute(el, name, namespace);
  }
  addClass(el, name) {
    this.delegate.addClass(el, name);
  }
  removeClass(el, name) {
    this.delegate.removeClass(el, name);
  }
  setStyle(el, style, value, flags) {
    this.delegate.setStyle(el, style, value, flags);
  }
  removeStyle(el, style, flags) {
    this.delegate.removeStyle(el, style, flags);
  }
  setProperty(el, name, value) {
    if (this.shouldReplay(name)) {
      this.replay.push((renderer) => renderer.setProperty(el, name, value));
    }
    this.delegate.setProperty(el, name, value);
  }
  setValue(node, value) {
    this.delegate.setValue(node, value);
  }
  listen(target, eventName, callback, options) {
    if (this.shouldReplay(eventName)) {
      this.replay.push((renderer) => renderer.listen(target, eventName, callback, options));
    }
    return this.delegate.listen(target, eventName, callback, options);
  }
  shouldReplay(propOrEventName) {
    return this.replay !== null && propOrEventName.startsWith(ANIMATION_PREFIX);
  }
};
var \u0275ASYNC_ANIMATION_LOADING_SCHEDULER_FN = new InjectionToken(ngDevMode ? "async_animation_loading_scheduler_fn" : "");
function provideAnimationsAsync(type = "animations") {
  performanceMarkFeature("NgAsyncAnimations");
  if (false) {
    type = "noop";
  }
  return makeEnvironmentProviders([{
    provide: RendererFactory2,
    useFactory: (doc, renderer, zone) => {
      return new AsyncAnimationRendererFactory(doc, renderer, zone, type);
    },
    deps: [DOCUMENT, DomRendererFactory2, NgZone]
  }, {
    provide: ANIMATION_MODULE_TYPE,
    useValue: type === "noop" ? "NoopAnimations" : "BrowserAnimations"
  }]);
}

// src/app/auth/auth-guard.service.ts
var AuthGuard = class _AuthGuard {
  constructor(credentialService, router) {
    this.credentialService = credentialService;
    this.router = router;
  }
  canActivate() {
    const token = this.credentialService.getToken();
    const user = this.credentialService.getCurrentUser();
    if (token && user) {
      return of(true);
    } else {
      this.router.navigate(["/auth/sign-in"]);
      return of(false);
    }
  }
  static {
    this.\u0275fac = function AuthGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AuthGuard)(\u0275\u0275inject(CredentialService), \u0275\u0275inject(Router));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthGuard, factory: _AuthGuard.\u0275fac, providedIn: "root" });
  }
};

// src/app/auth/no-auth.guard.ts
var NoAuthGuard = class _NoAuthGuard {
  constructor(credentialService, router) {
    this.credentialService = credentialService;
    this.router = router;
  }
  canActivate() {
    const token = this.credentialService.getToken();
    const user = this.credentialService.getCurrentUser();
    if (!token || !user) {
      return of(true);
    } else {
      this.router.navigate(["/auth/sign-in"]);
      return of(false);
    }
  }
  static {
    this.\u0275fac = function NoAuthGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NoAuthGuard)(\u0275\u0275inject(CredentialService), \u0275\u0275inject(Router));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NoAuthGuard, factory: _NoAuthGuard.\u0275fac, providedIn: "root" });
  }
};

// src/app/app-routing.module.ts
var routes = [
  {
    path: "",
    loadChildren: () => import("./layout.module-DX6ZBHEN.js").then((m) => m.LayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: "auth",
    loadChildren: () => import("./auth.module-TLFW3FSW.js").then((m) => m.AuthModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: "errors",
    loadChildren: () => import("./error.module-SX2OTAEC.js").then((m) => m.ErrorModule)
  },
  { path: "**", redirectTo: "errors/404" }
];
var AppRoutingModule = class _AppRoutingModule {
  static {
    this.\u0275fac = function AppRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forRoot(routes), RouterModule] });
  }
};

// src/app/library-modules/material-module.ts
var MaterialModule = class _MaterialModule {
  static {
    this.\u0275fac = function MaterialModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MaterialModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _MaterialModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
      A11yModule,
      CdkStepperModule,
      CdkTableModule,
      CdkTreeModule,
      DragDropModule,
      MatAutocompleteModule,
      MatBadgeModule,
      MatBottomSheetModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatChipsModule,
      MatStepperModule,
      MatDatepickerModule,
      MatDialogModule,
      MatDividerModule,
      MatExpansionModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatMenuModule,
      MatNativeDateModule,
      MatPaginatorModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatRippleModule,
      MatSelectModule,
      MatSidenavModule,
      MatSliderModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatSortModule,
      MatTableModule,
      MatTabsModule,
      MatToolbarModule,
      MatTooltipModule,
      MatTreeModule,
      PortalModule,
      ScrollingModule
    ] });
  }
};

// src/app/app.module.ts
var AppModule = class _AppModule {
  static {
    this.\u0275fac = function AppModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AppModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [
      provideAnimationsAsync(),
      provideAnimations(),
      provideNzI18n(en_US),
      provideNgxMask()
    ], imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      AngularSvgIconModule.forRoot()
    ] });
  }
};

// src/app/shared/Interceptor/token.interceptor.ts
var TokenInterceptor = class _TokenInterceptor {
  constructor(credentialService) {
    this.credentialService = credentialService;
  }
  intercept(req, next) {
    const token = this.credentialService.getToken();
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
  static {
    this.\u0275fac = function TokenInterceptor_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TokenInterceptor)(\u0275\u0275inject(CredentialService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TokenInterceptor, factory: _TokenInterceptor.\u0275fac });
  }
};

// src/main.ts
if (ENV.production) {
  enableProdMode();
  if (window) {
    selfXSSWarning();
  }
}
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppModule, LoadingService),
    provideAnimations(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
}).catch((err) => console.error(err));
function selfXSSWarning() {
  setTimeout(() => {
    console.log("%c** STOP **", "font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;");
    console.log(`
%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`, "font-weight:bold; font: 2em Arial; color: #e11d48;");
  });
}
/*! Bundled license information:

@angular/platform-browser/fesm2022/animations/async.mjs:
  (**
   * @license Angular v19.2.2
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=main.js.map
