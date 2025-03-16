import {
  ThemeService
} from "./chunk-WCTK3O4S.js";
import {
  ClickOutsideDirective
} from "./chunk-MG6AIRTJ.js";
import {
  CdkScrollable,
  ScrollingModule
} from "./chunk-OFTPT2DW.js";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "./chunk-IZ7LJD7S.js";
import {
  AuthService
} from "./chunk-RR35Z5YV.js";
import "./chunk-3M7I3ANC.js";
import "./chunk-IVEAD5IJ.js";
import "./chunk-PAY65EEN.js";
import {
  AngularSvgIconModule,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  SvgIconComponent
} from "./chunk-KS4MOIL4.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  NgTemplateOutlet,
  Subscription,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-GH4JMGH7.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-TXDUYLVM.js";

// package.json
var package_default = {
  name: "angular-tailwind",
  displayName: "Angular Tailwind",
  version: "0.10.1",
  description: "Angular & Tailwind CSS Admin Dashboard Starter Kit, Free and Open Source",
  homepage: "https://github.com/sfpayvn/SFBus-WB",
  repository: {
    type: "git",
    url: "git+https://github.com/sfpayvn/SFBus-WB.git"
  },
  keywords: [
    "angular",
    "tailwind",
    "starter-kit",
    "tailwind-template",
    "dark mode",
    "open source"
  ],
  author: "Luciano Oliveira <me@lanno.dev>",
  license: "MIT",
  scripts: {
    ng: "ng",
    start: "ng serve --open",
    build: "ng build --configuration development --output-path dist --base-href /sfbus-wb/browser/",
    watch: "ng build --watch --configuration development",
    test: "ng test",
    "test:e2e": "npx playwright test --ui",
    prettier: 'prettier --config ./.prettierrc --write "src/{app,environments}/**/*{.ts,.html,.scss,.json}"',
    "prettier:verify": 'prettier --config ./.prettierrc --check "src/{app,environments}/**/*{.ts,.html,.scss,.json}"',
    "prettier:staged": "pretty-quick --staged",
    lint: "ng lint",
    predeploy: "npm run build",
    deploy: "gh-pages -d dist"
  },
  private: true,
  dependencies: {
    "@angular/animations": "^19.1.4",
    "@angular/cdk": "^19.1.4",
    "@angular/common": "^19.1.4",
    "@angular/compiler": "^19.1.4",
    "@angular/core": "^19.1.4",
    "@angular/forms": "^19.1.4",
    "@angular/material": "^19.1.4",
    "@angular/platform-browser": "^19.1.4",
    "@angular/platform-browser-dynamic": "^19.1.4",
    "@angular/router": "^19.1.4",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@tailwindcss/forms": "^0.5.10",
    "@tailwindcss/postcss": "^4.0.3",
    "@tailwindcss/typography": "^0.5.16",
    "angular-svg-icon": "^13.0.0",
    apexcharts: "^3.35.3",
    "gh-pages": "^6.3.0",
    "ng-apexcharts": "^1.7.1",
    "ng-zorro-antd": "^19.0.2",
    "ngx-cookie-service": "^19.1.0",
    "ngx-mask": "^19.0.6",
    "ngx-sonner": "^3.0.0",
    rxjs: "~7.4.0",
    tslib: "^2.3.0",
    "zone.js": "~0.15.0"
  },
  devDependencies: {
    "@angular-devkit/build-angular": "^19.1.5",
    "@angular/cli": "^19.1.5",
    "@angular/compiler-cli": "^19.1.4",
    "@playwright/test": "^1.50.1",
    "@types/jasmine": "~3.10.0",
    "@types/lodash": "^4.17.15",
    "@types/node": "^12.11.1",
    autoprefixer: "^10.4.7",
    "cz-conventional-changelog": "^3.3.0",
    "jasmine-core": "~3.10.0",
    karma: "~6.3.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.0.3",
    "karma-jasmine": "~4.0.0",
    "karma-jasmine-html-reporter": "~1.7.0",
    postcss: "^8.5.1",
    prettier: "^2.7.1",
    "prettier-plugin-tailwindcss": "^0.1.12",
    "tailwind-scrollbar": "^4.0.0",
    tailwindcss: "^4.0.5",
    "tailwindcss-animated": "^2.0.0",
    typescript: "~5.7.3"
  },
  config: {
    commitizen: {
      path: "./node_modules/cz-conventional-changelog"
    }
  }
};

// src/app/core/constants/menu.ts
var Menu = class {
  static {
    this.pages = [
      {
        group: "Base",
        separator: false,
        items: [
          {
            icon: "assets/icons/heroicons/outline/chart-pie.svg",
            label: "Dashboard",
            route: "/dashboard",
            children: [
              { label: "Nfts", route: "/dashboard/nfts" },
              { label: "Podcast", route: "/dashboard/podcast" }
            ]
          },
          {
            icon: "assets/icons/heroicons/outline/lock-closed.svg",
            label: "Auth",
            route: "/auth",
            children: [
              { label: "Sign up", route: "/auth/sign-up" },
              { label: "Sign in", route: "/auth/sign-in" },
              { label: "Forgot Password", route: "/auth/forgot-password" },
              { label: "New Password", route: "/auth/new-password" },
              { label: "Two Steps", route: "/auth/two-steps" }
            ]
          },
          {
            icon: "assets/icons/heroicons/outline/exclamation-triangle.svg",
            label: "Errors",
            route: "/errors",
            children: [
              { label: "404", route: "/errors/404" },
              { label: "500", route: "/errors/500" }
            ]
          },
          {
            icon: "assets/icons/heroicons/outline/cube.svg",
            label: "Bus",
            route: "/management",
            children: [
              { label: "Bus Schedule Autogenerators", route: "/management/bus-schedule-autogenerators" },
              { label: "Buses", route: "/management/buses" },
              { label: "Bus Templates", route: "/management/bus-templates" },
              { label: "Bus Routes", route: "/management/bus-routes" },
              { label: "Bus Schedules", route: "/management/bus-schedules" },
              { label: "Bus Schedule Templates", route: "/management/bus-schedule-templates" },
              { label: "Bus Provices", route: "/management/bus-provinves" },
              { label: "Bus Stations", route: "/management/bus-stations" },
              { label: "Bus Types", route: "/management/bus-types" },
              { label: "Bus Services", route: "/management/bus-services" },
              { label: "Bus Layout Templates", route: "/management/bus-layout-templates" },
              { label: "Seat Types", route: "/management/seat-type" }
            ]
          },
          {
            icon: "assets/icons/heroicons/outline/cube.svg",
            label: "Media Center",
            route: "/management/media-center"
          },
          {
            icon: "assets/icons/heroicons/outline/cube.svg",
            label: "Components",
            route: "/components",
            children: [{ label: "Table", route: "/components/table" }]
          }
        ]
      },
      {
        group: "Collaboration",
        separator: true,
        items: [
          {
            icon: "assets/icons/heroicons/outline/download.svg",
            label: "Download",
            route: "/download"
          },
          {
            icon: "assets/icons/heroicons/outline/gift.svg",
            label: "Gift Card",
            route: "/gift"
          },
          {
            icon: "assets/icons/heroicons/outline/users.svg",
            label: "Users",
            route: "/users"
          }
        ]
      },
      {
        group: "Config",
        separator: false,
        items: [
          {
            icon: "assets/icons/heroicons/outline/cog.svg",
            label: "Settings",
            route: "/settings"
          },
          {
            icon: "assets/icons/heroicons/outline/bell.svg",
            label: "Notifications",
            route: "/gift"
          },
          {
            icon: "assets/icons/heroicons/outline/folder.svg",
            label: "Folders",
            route: "/folders",
            children: [
              { label: "Current Files", route: "/folders/current-files" },
              { label: "Downloads", route: "/folders/download" },
              { label: "Trash", route: "/folders/trash" }
            ]
          }
        ]
      }
    ];
  }
};

// src/app/modules/layout/services/menu.service.ts
var MenuService = class _MenuService {
  constructor(router) {
    this.router = router;
    this._showSidebar = signal(true);
    this._showMobileMenu = signal(false);
    this._pagesMenu = signal([]);
    this._subscription = new Subscription();
    this._pagesMenu.set(Menu.pages);
    let sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._pagesMenu().forEach((menu) => {
          let activeGroup = false;
          menu.items.forEach((subMenu) => {
            const active = this.isActive(subMenu.route);
            subMenu.expanded = active;
            subMenu.active = active;
            if (active)
              activeGroup = true;
            if (subMenu.children) {
              this.expand(subMenu.children);
            }
          });
          menu.active = activeGroup;
        });
      }
    });
    this._subscription.add(sub);
  }
  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu() {
    return this._pagesMenu();
  }
  set showSideBar(value) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value) {
    this._showMobileMenu.set(value);
  }
  toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }
  toggleMenu(menu) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }
  toggleSubMenu(submenu) {
    submenu.expanded = !submenu.expanded;
  }
  expand(items) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children)
        this.expand(item.children);
    });
  }
  isActive(instruction) {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: "subset",
      queryParams: "subset",
      fragment: "ignored",
      matrixParams: "ignored"
    });
  }
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
  static {
    this.\u0275fac = function MenuService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MenuService)(\u0275\u0275inject(Router));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MenuService, factory: _MenuService.\u0275fac, providedIn: "root" });
  }
};

// src/app/modules/layout/components/sidebar/sidebar-submenu/sidebar-submenu.component.ts
var _c0 = (a0, a1) => ({ hidden: a0, "max-h-screen": a1 });
var _c1 = (a0) => ({ sub: a0 });
var _c2 = () => ({ exact: true });
var _c3 = (a0, a1) => ({ hidden: a0, "rotate-90": a1 });
function SidebarSubmenuComponent_li_2_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r4 = ctx.sub;
    \u0275\u0275property("routerLink", sub_r4.route)("routerLinkActiveOptions", \u0275\u0275pureFunction0(3, _c2));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", sub_r4.label, " ");
  }
}
function SidebarSubmenuComponent_li_2_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 10);
    \u0275\u0275element(3, "svg-icon", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r5 = ctx.sub;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", sub_r5.label, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(3, _c3, !ctx_r2.menuService.showSideBar, sub_r5.expanded));
    \u0275\u0275advance();
    \u0275\u0275property("svgClass", "h-5 w-5");
  }
}
function SidebarSubmenuComponent_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "div", 5);
    \u0275\u0275listener("click", function SidebarSubmenuComponent_li_2_Template_div_click_1_listener() {
      const sub_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleMenu(sub_r2));
    });
    \u0275\u0275elementContainer(2, 6);
    \u0275\u0275template(3, SidebarSubmenuComponent_li_2_ng_template_3_Template, 2, 4, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(5, SidebarSubmenuComponent_li_2_ng_template_5_Template, 4, 6, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "app-sidebar-submenu", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r2 = ctx.$implicit;
    const parentMenu_r6 = \u0275\u0275reference(4);
    const childMenu_r7 = \u0275\u0275reference(6);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", sub_r2.children ? childMenu_r7 : parentMenu_r6)("ngTemplateOutletContext", \u0275\u0275pureFunction1(3, _c1, sub_r2));
    \u0275\u0275advance(5);
    \u0275\u0275property("submenu", sub_r2);
  }
}
var SidebarSubmenuComponent = class _SidebarSubmenuComponent {
  constructor(menuService) {
    this.menuService = menuService;
    this.submenu = {};
  }
  ngOnInit() {
  }
  toggleMenu(menu) {
    this.menuService.toggleSubMenu(menu);
  }
  collapse(items) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children)
        this.collapse(item.children);
    });
  }
  static {
    this.\u0275fac = function SidebarSubmenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SidebarSubmenuComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarSubmenuComponent, selectors: [["app-sidebar-submenu"]], inputs: { submenu: "submenu" }, decls: 3, vars: 5, consts: [["parentMenu", ""], ["childMenu", ""], [1, "max-h-0", "overflow-hidden", "pt-1", "pl-4", "transition-all", "duration-500", 3, "ngClass"], [1, "border-border", "text-muted-foreground", "flex", "flex-col", "border-l", "border-dashed", "pl-2"], [4, "ngFor", "ngForOf"], [1, "text-muted-foreground", "hover:bg-card", "hover:text-foreground", "flex", "rounded-sm", 3, "click"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [3, "submenu"], ["routerLinkActive", "text-primary", 1, "inline-block", "w-full", "px-4", "py-2", "text-xs", "font-semibold", 3, "routerLink", "routerLinkActiveOptions"], [1, "inline-block", "w-full", "cursor-pointer", "px-4", "py-2", "text-xs", "font-semibold"], [1, "text-muted-foreground", "flex", "items-center", "p-1", "transition-all", "duration-500", 3, "ngClass"], ["src", "assets/icons/heroicons/solid/chevron-right.svg", 3, "svgClass"]], template: function SidebarSubmenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 2)(1, "ul", 3);
        \u0275\u0275template(2, SidebarSubmenuComponent_li_2_Template, 8, 5, "li", 4);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(2, _c0, !ctx.menuService.showSideBar, ctx.submenu.expanded));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.submenu.children);
      }
    }, dependencies: [_SidebarSubmenuComponent, NgClass, NgForOf, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule, SvgIconComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarSubmenuComponent, { className: "SidebarSubmenuComponent", filePath: "src/app/modules/layout/components/sidebar/sidebar-submenu/sidebar-submenu.component.ts", lineNumber: 14 });
})();

// src/app/modules/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts
var _c02 = (a0) => ({ hidden: a0 });
var _c12 = (a0) => ({ item: a0 });
var _c22 = (a0, a1) => ({ hidden: a0, "rotate-90": a1 });
function SidebarMenuComponent_div_0_li_5_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "a", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.item;
    \u0275\u0275propertyInterpolate("routerLink", item_r4.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r4.label, " ");
  }
}
function SidebarMenuComponent_div_0_li_5_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "a", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r5 = ctx.item;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r5.label, " ");
  }
}
function SidebarMenuComponent_div_0_li_5_button_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275element(1, "svg-icon", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(2, _c22, !ctx_r2.menuService.showSideBar, item_r2.expanded));
    \u0275\u0275advance();
    \u0275\u0275property("svgClass", "h-5 w-5");
  }
}
function SidebarMenuComponent_div_0_li_5_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r2.label, " ");
  }
}
function SidebarMenuComponent_div_0_li_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "div", 9);
    \u0275\u0275listener("click", function SidebarMenuComponent_div_0_li_5_Template_div_click_1_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleMenu(item_r2));
    });
    \u0275\u0275elementStart(2, "div", 10);
    \u0275\u0275element(3, "svg-icon", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainer(4, 12);
    \u0275\u0275template(5, SidebarMenuComponent_div_0_li_5_ng_template_5_Template, 3, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(7, SidebarMenuComponent_div_0_li_5_ng_template_7_Template, 3, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(9, SidebarMenuComponent_div_0_li_5_button_9_Template, 2, 5, "button", 13)(10, SidebarMenuComponent_div_0_li_5_div_10_Template, 3, 1, "div", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "app-sidebar-submenu", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const parentMenu_r6 = \u0275\u0275reference(6);
    const childMenu_r7 = \u0275\u0275reference(8);
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", item_r2.active && !ctx_r2.menuService.showSideBar ? "text-primary" : "text-muted-foreground/50");
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("src", item_r2.icon);
    \u0275\u0275property("svgClass", "h-5 w-5");
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", item_r2.children ? childMenu_r7 : parentMenu_r6)("ngTemplateOutletContext", \u0275\u0275pureFunction1(8, _c12, item_r2));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", item_r2.children);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.menuService.showSideBar);
    \u0275\u0275advance();
    \u0275\u0275property("submenu", item_r2);
  }
}
function SidebarMenuComponent_div_0_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275element(1, "hr", 25);
    \u0275\u0275elementEnd();
  }
}
function SidebarMenuComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "small", 5);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "ul", 6);
    \u0275\u0275template(5, SidebarMenuComponent_div_0_li_5_Template, 12, 10, "li", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, SidebarMenuComponent_div_0_div_6_Template, 2, 0, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const menu_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c02, !ctx_r2.menuService.showSideBar));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", menu_r8.group, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", menu_r8.items);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", menu_r8.separator);
  }
}
var SidebarMenuComponent = class _SidebarMenuComponent {
  constructor(menuService) {
    this.menuService = menuService;
  }
  toggleMenu(subMenu) {
    this.menuService.toggleMenu(subMenu);
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function SidebarMenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SidebarMenuComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarMenuComponent, selectors: [["app-sidebar-menu"]], decls: 1, vars: 1, consts: [["parentMenu", ""], ["childMenu", ""], ["class", "pt-4", 4, "ngFor", "ngForOf"], [1, "pt-4"], [1, "mx-1", "mb-2", "flex", "items-center", "justify-between"], [1, "text-muted-foreground/50", "text-xs", "font-semibold", 3, "ngClass"], [1, "flex", "flex-col", "space-y-1"], [4, "ngFor", "ngForOf"], ["class", "pt-3", 4, "ngIf"], [1, "text-muted-foreground", "group", "relative", 3, "click"], [1, "pointer-events-none", "absolute", "m-2", 3, "ngClass"], [3, "src", "svgClass"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "text-muted-foreground/50 pointer-events-none absolute top-1 right-0 flex items-center p-1 transition-all duration-500", 3, "ngClass", 4, "ngIf"], ["class", "fixed w-full", 4, "ngIf"], [3, "submenu"], [1, "text-muted-foreground", "hover:bg-card", "hover:text-foreground", "flex", "h-9", "cursor-pointer", "items-center", "justify-start", "rounded-sm", 3, "routerLink"], ["routerLinkActive", "text-primary", 1, "ml-10", "truncate", "text-xs", "font-semibold", "tracking-wide", "focus:outline-hidden"], [1, "hover:bg-card", "flex", "h-9", "cursor-pointer", "items-center", "justify-start", "rounded-sm"], [1, "text-muted-foreground", "group-hover:text-foreground", "ml-10", "truncate", "text-xs", "font-semibold", "tracking-wide", "focus:outline-hidden"], [1, "text-muted-foreground/50", "pointer-events-none", "absolute", "top-1", "right-0", "flex", "items-center", "p-1", "transition-all", "duration-500", 3, "ngClass"], ["src", "assets/icons/heroicons/solid/chevron-right.svg", 3, "svgClass"], [1, "fixed", "w-full"], [1, "z-1", "bg-foreground", "text-background", "absolute", "left-14", "-top-[34px]", "w-auto", "min-w-max", "origin-left", "scale-0", "rounded-md", "p-2", "text-xs", "font-bold", "shadow-md", "transition-all", "duration-200", "group-hover:scale-100"], [1, "pt-3"], [1, "border-border", "border-dashed"]], template: function SidebarMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, SidebarMenuComponent_div_0_Template, 7, 6, "div", 2);
      }
      if (rf & 2) {
        \u0275\u0275property("ngForOf", ctx.menuService.pagesMenu);
      }
    }, dependencies: [
      NgForOf,
      NgClass,
      AngularSvgIconModule,
      SvgIconComponent,
      NgTemplateOutlet,
      RouterLink,
      RouterLinkActive,
      NgIf,
      SidebarSubmenuComponent
    ], encapsulation: 2, changeDetection: 0 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarMenuComponent, { className: "SidebarMenuComponent", filePath: "src/app/modules/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts", lineNumber: 25 });
})();

// src/app/modules/layout/components/sidebar/sidebar.component.ts
var _c03 = (a0) => ({ "rotate-180": a0 });
function SidebarComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "a", 15);
    \u0275\u0275listener("click", function SidebarComponent_div_3_Template_a_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleSidebar());
    });
    \u0275\u0275element(2, "svg-icon", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "b", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.appJson.displayName, " ");
  }
}
function SidebarComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "span", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" v", ctx_r1.appJson.version, " ");
  }
}
var SidebarComponent = class _SidebarComponent {
  constructor(menuService) {
    this.menuService = menuService;
    this.appJson = package_default;
  }
  ngOnInit() {
  }
  toggleSidebar() {
    this.menuService.toggleSidebar();
  }
  static {
    this.\u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SidebarComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], decls: 16, vars: 8, consts: [[1, "scrollbar-thumb--sm", "scrollbar-track-rounded", "bg-background", "scrollbar-thin", "scrollbar-track-transparent", "scrollbar-thumb-card", "hidden", "h-full", "flex-col", "justify-between", "overflow-auto", "pt-3", "transition-all", "duration-300", "lg:flex", 3, "ngClass"], [1, "px-4"], [1, "relative", "h-10"], ["class", "flex items-center", 4, "ngIf"], [1, "text-muted-foreground/50", "hover:text-muted-foreground", "absolute", "top-2", "right-2", "flex", "h-5", "w-5", "items-center", "justify-center", "rounded-sm", "transition-all", "duration-200", "focus:outline-hidden", 3, "click", "ngClass"], ["src", "assets/icons/heroicons/solid/chevron-double-left.svg"], [1, "pt-3"], [1, "border-muted", "border-dashed"], [1, "mx-4", "my-4", "space-y-1"], ["target", "_blank", "href", "https://github.com/luciano-work/angular-tailwind", 1, "-sm", "hover:bg-card", "group", "flex", "h-9", "cursor-pointer", "items-center", "justify-start", "p-2"], ["src", "assets/icons/heroicons/outline/information-circle.svg", 3, "svgClass"], [1, "ml-3", "truncate", "text-[10px]", "font-semibold", "tracking-wide", "focus:outline-hidden"], [1, "-sm-lg", "bg-primary/10", "text-primary", "px-2", "font-semibold"], ["class", "fixed w-full", 4, "ngIf"], [1, "flex", "items-center"], [1, "bg-primary", "flex", "cursor-pointer", "items-center", "justify-center", "rounded-sm", "p-2", "focus:outline-hidden", "focus:ring-1", 3, "click"], ["src", "assets/icons/logo.svg"], [1, "text-foreground", "ml-1", "pl-2", "text-sm", "font-bold"], [1, "fixed", "w-full"], [1, "z-1", "-sm-md", "bg-foreground", "text-background", "absolute", "left-12", "-top-4", "w-auto", "min-w-max", "origin-left", "scale-0", "p-2", "text-xs", "font-bold", "shadow-md", "transition-all", "duration-200", "group-hover:scale-100"]], template: function SidebarComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "nav", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275template(3, SidebarComponent_div_3_Template, 5, 1, "div", 3);
        \u0275\u0275elementStart(4, "button", 4);
        \u0275\u0275listener("click", function SidebarComponent_Template_button_click_4_listener() {
          return ctx.toggleSidebar();
        });
        \u0275\u0275element(5, "svg-icon", 5);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div", 6);
        \u0275\u0275element(7, "hr", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275element(8, "app-sidebar-menu");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "div", 8)(10, "a", 9);
        \u0275\u0275element(11, "svg-icon", 10);
        \u0275\u0275elementStart(12, "div", 11)(13, "span", 12);
        \u0275\u0275text(14);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(15, SidebarComponent_div_15_Template, 3, 1, "div", 13);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.menuService.showSideBar ? "w-52 xl:w-64" : "w-[70px]");
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.menuService.showSideBar);
        \u0275\u0275advance();
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(6, _c03, !ctx.menuService.showSideBar));
        \u0275\u0275advance(7);
        \u0275\u0275property("svgClass", "h-5 w-5 text-muted-foreground/50");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1("v", ctx.appJson.version, "");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.menuService.showSideBar);
      }
    }, dependencies: [NgClass, NgIf, AngularSvgIconModule, SvgIconComponent, SidebarMenuComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/modules/layout/components/sidebar/sidebar.component.ts", lineNumber: 14 });
})();

// src/app/modules/layout/components/navbar/navbar-submenu/navbar-submenu.component.ts
var _c04 = ["submenuRef"];
var _c13 = ["navbar-submenu", ""];
var _c23 = (a0) => ({ item: a0 });
var _c32 = () => ({ exact: true });
function NavbarSubmenuComponent_li_2_ng_template_2_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275element(1, "svg-icon", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().item;
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("src", item_r1.icon);
    \u0275\u0275property("svgClass", "h-5 w-5");
  }
}
function NavbarSubmenuComponent_li_2_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 7)(1, "div", 8);
    \u0275\u0275template(2, NavbarSubmenuComponent_li_2_ng_template_2_span_2_Template, 2, 2, "span", 9);
    \u0275\u0275elementStart(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r1 = ctx.item;
    \u0275\u0275property("routerLink", item_r1.route)("routerLinkActiveOptions", \u0275\u0275pureFunction0(4, _c32));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", item_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
function NavbarSubmenuComponent_li_2_ng_template_4_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275element(1, "svg-icon", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().item;
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("src", item_r2.icon);
    \u0275\u0275property("svgClass", "h-5 w-5");
  }
}
function NavbarSubmenuComponent_li_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "button", 14)(2, "div", 8);
    \u0275\u0275template(3, NavbarSubmenuComponent_li_2_ng_template_4_span_3_Template, 2, 2, "span", 9);
    \u0275\u0275elementStart(4, "span", 10);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275element(7, "svg-icon", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(8, "div", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.item;
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", item_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.label);
    \u0275\u0275advance(2);
    \u0275\u0275property("svgClass", "h-5 w-5 text-text-muted-foreground/50");
    \u0275\u0275advance();
    \u0275\u0275property("submenu", item_r2.children);
  }
}
function NavbarSubmenuComponent_li_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 5);
    \u0275\u0275elementContainer(1, 6);
    \u0275\u0275template(2, NavbarSubmenuComponent_li_2_ng_template_2_Template, 5, 5, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(4, NavbarSubmenuComponent_li_2_ng_template_4_Template, 9, 4, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const parentMenu_r4 = \u0275\u0275reference(3);
    const childMenu_r5 = \u0275\u0275reference(5);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", item_r3.children ? childMenu_r5 : parentMenu_r4)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c23, item_r3));
  }
}
var NavbarSubmenuComponent = class _NavbarSubmenuComponent {
  constructor() {
    this.submenu = {};
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    if (this.submenuRef) {
      const submenu = this.submenuRef.nativeElement.getBoundingClientRect();
      const bounding = document.body.getBoundingClientRect();
      if (submenu.right > bounding.right) {
        const childrenElement = this.submenuRef.nativeElement.parentNode;
        if (childrenElement) {
          childrenElement.style.left = "-100%";
        }
      }
    }
  }
  static {
    this.\u0275fac = function NavbarSubmenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NavbarSubmenuComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarSubmenuComponent, selectors: [["div", "navbar-submenu", ""]], viewQuery: function NavbarSubmenuComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c04, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.submenuRef = _t.first);
      }
    }, inputs: { submenu: "submenu" }, attrs: _c13, decls: 3, vars: 1, consts: [["submenuRef", ""], ["parentMenu", ""], ["childMenu", ""], [1, "mt-2", "space-y-0.5", "rounded-md", "bg-background", "py-3", "shadow-custom"], ["class", "flex font-semibold", 4, "ngFor", "ngForOf"], [1, "flex", "font-semibold"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["routerLinkActive", "text-primary", 1, "mx-3", "flex", "w-full", "items-center", "justify-between", "rounded-md", "py-2", "px-2", "text-xs", "font-semibold", "text-muted-foreground", "hover:bg-card", "hover:text-foreground", 3, "routerLink", "routerLinkActiveOptions"], [1, "flex", "items-center", "justify-start"], ["class", "mr-2 text-muted-foreground/50", 4, "ngIf"], [1, "ml-1"], [1, "mr-2", "text-muted-foreground/50"], [3, "src", "svgClass"], [1, "dropdown", "relative", "flex", "w-full"], [1, "mx-3", "flex", "w-full", "items-center", "justify-between", "rounded-md", "py-2", "px-2", "text-xs", "font-semibold", "text-muted-foreground", "hover:bg-card", "hover:text-foreground"], ["src", "assets/icons/heroicons/solid/chevron-right.svg", 3, "svgClass"], ["navbar-submenu", "", 1, "dropdown-content", "absolute", "top-0", "left-[100%]", "min-w-[200px]", "origin-top-left", 3, "submenu"]], template: function NavbarSubmenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ul", 3, 0);
        \u0275\u0275template(2, NavbarSubmenuComponent_li_2_Template, 6, 4, "li", 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.submenu);
      }
    }, dependencies: [_NavbarSubmenuComponent, NgForOf, NgTemplateOutlet, RouterLinkActive, RouterLink, NgIf, AngularSvgIconModule, SvgIconComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarSubmenuComponent, { className: "NavbarSubmenuComponent", filePath: "src/app/modules/layout/components/navbar/navbar-submenu/navbar-submenu.component.ts", lineNumber: 13 });
})();

// src/app/modules/layout/components/navbar/navbar-menu/navbar-menu.component.ts
function NavbarMenuComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "button", 2)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(4, "div", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const menu_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", menu_r1.selected || menu_r1.active ? "bg-primary text-primary-foreground" : "text-muted-foreground/50 hover:bg-card hover:text-muted-foreground ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(menu_r1.group);
    \u0275\u0275advance();
    \u0275\u0275property("submenu", menu_r1.items);
  }
}
var NavbarMenuComponent = class _NavbarMenuComponent {
  constructor(menuService) {
    this.menuService = menuService;
    this.showMenuClass = ["scale-100", "animate-fade-in-up", "opacity-100", "pointer-events-auto"];
    this.hideMenuClass = ["scale-95", "animate-fade-out-down", "opacity-0", "pointer-events-none"];
  }
  ngOnInit() {
  }
  toggleMenu(menu) {
    menu.selected = !menu.selected;
  }
  mouseEnter(event) {
    let element = event.target.querySelector("app-navbar-submenu").children[0];
    if (element) {
      this.hideMenuClass.forEach((c) => element.classList.remove(c));
      this.showMenuClass.forEach((c) => element.classList.add(c));
    }
  }
  mouseLeave(event) {
    let element = event.target.querySelector("app-navbar-submenu").children[0];
    if (element) {
      this.showMenuClass.forEach((c) => element.classList.remove(c));
      this.hideMenuClass.forEach((c) => element.classList.add(c));
    }
  }
  static {
    this.\u0275fac = function NavbarMenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NavbarMenuComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarMenuComponent, selectors: [["app-navbar-menu"]], decls: 1, vars: 1, consts: [["class", "dropdown relative inline-block", 4, "ngFor", "ngForOf"], [1, "dropdown", "relative", "inline-block"], [1, "mr-2", "inline-flex", "rounded-md", "px-3", "py-2", "text-sm", "font-medium", 3, "ngClass"], ["navbar-submenu", "", 1, "dropdown-content", "absolute", "top-[100%]", "min-w-[200px]", "origin-top-left", "z-10", 3, "submenu"]], template: function NavbarMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, NavbarMenuComponent_div_0_Template, 5, 3, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275property("ngForOf", ctx.menuService.pagesMenu);
      }
    }, dependencies: [NgForOf, NgClass, NavbarSubmenuComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarMenuComponent, { className: "NavbarMenuComponent", filePath: "src/app/modules/layout/components/navbar/navbar-menu/navbar-menu.component.ts", lineNumber: 13 });
})();

// src/app/modules/layout/components/navbar/navbar-mobile/navbar-mobile-submenu/navbar-mobile-submenu.component.ts
var _c05 = (a0) => ({ "max-h-screen": a0 });
var _c14 = (a0) => ({ sub: a0 });
var _c24 = () => ({ exact: true });
var _c33 = (a0) => ({ "rotate-90": a0 });
function NavbarMobileSubmenuComponent_li_2_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 8);
    \u0275\u0275listener("click", function NavbarMobileSubmenuComponent_li_2_ng_template_3_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.closeMobileMenu());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r5 = ctx.sub;
    \u0275\u0275property("routerLink", sub_r5.route)("routerLinkActiveOptions", \u0275\u0275pureFunction0(3, _c24));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", sub_r5.label, " ");
  }
}
function NavbarMobileSubmenuComponent_li_2_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 10);
    \u0275\u0275element(3, "svg-icon", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r6 = ctx.sub;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", sub_r6.label, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c33, sub_r6.expanded));
    \u0275\u0275advance();
    \u0275\u0275property("svgClass", "h-5 w-5");
  }
}
function NavbarMobileSubmenuComponent_li_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "div", 5);
    \u0275\u0275listener("click", function NavbarMobileSubmenuComponent_li_2_Template_div_click_1_listener() {
      const sub_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggleMenu(sub_r2));
    });
    \u0275\u0275elementContainer(2, 6);
    \u0275\u0275template(3, NavbarMobileSubmenuComponent_li_2_ng_template_3_Template, 2, 4, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(5, NavbarMobileSubmenuComponent_li_2_ng_template_5_Template, 4, 5, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "app-navbar-mobile-submenu", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sub_r2 = ctx.$implicit;
    const parentMenu_r7 = \u0275\u0275reference(4);
    const childMenu_r8 = \u0275\u0275reference(6);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", sub_r2.children ? childMenu_r8 : parentMenu_r7)("ngTemplateOutletContext", \u0275\u0275pureFunction1(3, _c14, sub_r2));
    \u0275\u0275advance(5);
    \u0275\u0275property("submenu", sub_r2);
  }
}
var NavbarMobileSubmenuComponent = class _NavbarMobileSubmenuComponent {
  constructor(menuService) {
    this.menuService = menuService;
    this.submenu = {};
  }
  ngOnInit() {
  }
  toggleMenu(menu) {
    this.menuService.toggleSubMenu(menu);
  }
  collapse(items) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children)
        this.collapse(item.children);
    });
  }
  closeMobileMenu() {
    this.menuService.showMobileMenu = false;
  }
  static {
    this.\u0275fac = function NavbarMobileSubmenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NavbarMobileSubmenuComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarMobileSubmenuComponent, selectors: [["app-navbar-mobile-submenu"]], inputs: { submenu: "submenu" }, decls: 3, vars: 4, consts: [["parentMenu", ""], ["childMenu", ""], [1, "max-h-0", "overflow-hidden", "pt-1", "pl-4", "transition-all", "duration-500", 3, "ngClass"], [1, "border-border", "text-muted-foreground", "flex", "flex-col", "border-l", "border-dashed", "pl-2"], [4, "ngFor", "ngForOf"], [1, "hover:bg-card", "hover:text-foreground", "flex", "rounded-sm", 3, "click"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [3, "submenu"], ["routerLinkActive", "text-primary", 1, "inline-block", "w-full", "px-4", "py-2", "text-xs", "font-semibold", 3, "click", "routerLink", "routerLinkActiveOptions"], [1, "inline-block", "w-full", "cursor-pointer", "px-4", "py-2", "text-xs", "font-semibold"], [1, "text-muted-foreground", "flex", "items-center", "p-1", "transition-all", "duration-500", 3, "ngClass"], ["src", "assets/icons/heroicons/solid/chevron-right.svg", 3, "svgClass"]], template: function NavbarMobileSubmenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 2)(1, "ul", 3);
        \u0275\u0275template(2, NavbarMobileSubmenuComponent_li_2_Template, 8, 5, "li", 4);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(2, _c05, ctx.submenu.expanded));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngForOf", ctx.submenu.children);
      }
    }, dependencies: [_NavbarMobileSubmenuComponent, NgClass, NgForOf, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule, SvgIconComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarMobileSubmenuComponent, { className: "NavbarMobileSubmenuComponent", filePath: "src/app/modules/layout/components/navbar/navbar-mobile/navbar-mobile-submenu/navbar-mobile-submenu.component.ts", lineNumber: 14 });
})();

// src/app/modules/layout/components/navbar/navbar-mobile/navbar-mobile-menu/navbar-mobile-menu.component.ts
var _c06 = (a0) => ({ item: a0 });
var _c15 = (a0, a1) => ({ hidden: a0, "rotate-90": a1 });
function NavbarMobileMenuComponent_div_0_li_5_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "a", 15);
    \u0275\u0275listener("click", function NavbarMobileMenuComponent_div_0_li_5_ng_template_5_Template_a_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.closeMenu());
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r5 = ctx.item;
    \u0275\u0275propertyInterpolate("routerLink", item_r5.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r5.label, " ");
  }
}
function NavbarMobileMenuComponent_div_0_li_5_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "a", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.item;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r6.label, " ");
  }
}
function NavbarMobileMenuComponent_div_0_li_5_button_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275element(1, "svg-icon", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(2, _c15, !ctx_r2.menuService.showSideBar, item_r2.expanded));
    \u0275\u0275advance();
    \u0275\u0275property("svgClass", "h-5 w-5");
  }
}
function NavbarMobileMenuComponent_div_0_li_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "div", 8);
    \u0275\u0275listener("click", function NavbarMobileMenuComponent_div_0_li_5_Template_div_click_1_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleMenu(item_r2));
    });
    \u0275\u0275elementStart(2, "div", 9);
    \u0275\u0275element(3, "svg-icon", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainer(4, 11);
    \u0275\u0275template(5, NavbarMobileMenuComponent_div_0_li_5_ng_template_5_Template, 3, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor)(7, NavbarMobileMenuComponent_div_0_li_5_ng_template_7_Template, 3, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(9, NavbarMobileMenuComponent_div_0_li_5_button_9_Template, 2, 5, "button", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275element(10, "app-navbar-mobile-submenu", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const parentMenu_r7 = \u0275\u0275reference(6);
    const childMenu_r8 = \u0275\u0275reference(8);
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", item_r2.active && !ctx_r2.menuService.showSideBar ? "text-primary" : "text-muted-foreground/50");
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("src", item_r2.icon);
    \u0275\u0275property("svgClass", "h-5 w-5");
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", item_r2.children ? childMenu_r8 : parentMenu_r7)("ngTemplateOutletContext", \u0275\u0275pureFunction1(7, _c06, item_r2));
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", item_r2.children);
    \u0275\u0275advance();
    \u0275\u0275property("submenu", item_r2);
  }
}
function NavbarMobileMenuComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "small", 5);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "ul", 6);
    \u0275\u0275template(5, NavbarMobileMenuComponent_div_0_li_5_Template, 11, 9, "li", 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const menu_r9 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", menu_r9.group, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", menu_r9.items);
  }
}
var NavbarMobileMenuComponent = class _NavbarMobileMenuComponent {
  constructor(menuService) {
    this.menuService = menuService;
  }
  toggleMenu(subMenu) {
    this.menuService.toggleMenu(subMenu);
  }
  closeMenu() {
    this.menuService.showMobileMenu = false;
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function NavbarMobileMenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NavbarMobileMenuComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarMobileMenuComponent, selectors: [["app-navbar-mobile-menu"]], decls: 1, vars: 1, consts: [["parentMenu", ""], ["childMenu", ""], ["class", "pt-4", 4, "ngFor", "ngForOf"], [1, "pt-4"], [1, "mx-1", "mb-2", "flex", "items-center", "justify-between"], [1, "text-muted-foreground", "text-xs", "font-semibold"], [1, "flex", "flex-col", "space-y-1"], [4, "ngFor", "ngForOf"], [1, "text-muted-foreground", "hover:text-foreground", "group", "relative", 3, "click"], [1, "pointer-events-none", "absolute", "m-2", 3, "ngClass"], [3, "src", "svgClass"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "text-muted-foreground/50 pointer-events-none absolute top-1 right-0 flex items-center p-1 transition-all duration-500", 3, "ngClass", 4, "ngIf"], [3, "submenu"], [1, "hover:bg-card", "flex", "h-9", "cursor-pointer", "items-center", "justify-start", "rounded-sm", 3, "routerLink"], ["routerLinkActive", "text-primary", 1, "ml-10", "truncate", "text-xs", "font-semibold", "tracking-wide", "focus:outline-hidden", 3, "click"], [1, "hover:bg-card", "flex", "h-9", "cursor-pointer", "items-center", "justify-start", "rounded-sm"], [1, "ml-10", "truncate", "text-xs", "font-semibold", "tracking-wide", "focus:outline-hidden"], [1, "text-muted-foreground/50", "pointer-events-none", "absolute", "top-1", "right-0", "flex", "items-center", "p-1", "transition-all", "duration-500", 3, "ngClass"], ["src", "assets/icons/heroicons/solid/chevron-right.svg", 3, "svgClass"]], template: function NavbarMobileMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, NavbarMobileMenuComponent_div_0_Template, 6, 2, "div", 2);
      }
      if (rf & 2) {
        \u0275\u0275property("ngForOf", ctx.menuService.pagesMenu);
      }
    }, dependencies: [
      NgForOf,
      NgClass,
      AngularSvgIconModule,
      SvgIconComponent,
      NgTemplateOutlet,
      RouterLink,
      RouterLinkActive,
      NgIf,
      NavbarMobileSubmenuComponent
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarMobileMenuComponent, { className: "NavbarMobileMenuComponent", filePath: "src/app/modules/layout/components/navbar/navbar-mobile/navbar-mobile-menu/navbar-mobile-menu.component.ts", lineNumber: 24 });
})();

// src/app/modules/layout/components/navbar/navbar-mobile/navbar-mobilecomponent.ts
var NavbarMobileComponent = class _NavbarMobileComponent {
  constructor(menuService) {
    this.menuService = menuService;
  }
  ngOnInit() {
  }
  toggleMobileMenu() {
    this.menuService.showMobileMenu = false;
  }
  static {
    this.\u0275fac = function NavbarMobileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NavbarMobileComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarMobileComponent, selectors: [["app-navbar-mobile"]], decls: 17, vars: 1, consts: [[1, "absolute", "inset-x-0", "top-0", "z-10", "origin-top-right", "transform", "p-2", "transition", "md:hidden", 3, "ngClass"], [1, "bg-background", "rounded-lg", "shadow-lg"], [1, "pt-5", "pb-6"], [1, "flex", "items-center", "justify-between", "px-5"], [1, "flex", "items-center", "justify-start", "sm:order-2", "md:mr-10", "lg:hidden"], [1, "bg-primary", "flex", "items-center", "justify-center", "rounded-sm", "p-2", "focus:outline-hidden", "focus:ring-1"], ["src", "assets/icons/logo.svg"], [1, "text-foreground", "pl-3", "text-sm", "font-bold"], [1, "-mr-2"], ["type", "button", 1, "text-muted-foreground", "focus:ring-primary", "hover:bg-card", "hover:text-foreground", "inline-flex", "items-center", "justify-center", "rounded-md", "p-2", "transition-transform", "hover:rotate-90", "focus:outline-hidden", "focus:ring-2", "focus:ring-inset", 3, "click"], [1, "sr-only"], ["src", "assets/icons/heroicons/outline/x.svg"], [1, "scrollbar-thumb-rounded", "scrollbar-track-rounded", "scrollbar-thin", "scrollbar-track-transparent", "scrollbar-thumb-muted", "max-h-[500px]", "overflow-y-auto", "px-5"]], template: function NavbarMobileComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div")(5, "div", 4)(6, "a", 5);
        \u0275\u0275element(7, "svg-icon", 6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "b", 7);
        \u0275\u0275text(9, " Angular Tailwind ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(10, "div", 8)(11, "button", 9);
        \u0275\u0275listener("click", function NavbarMobileComponent_Template_button_click_11_listener() {
          return ctx.toggleMobileMenu();
        });
        \u0275\u0275elementStart(12, "span", 10);
        \u0275\u0275text(13, "Close menu");
        \u0275\u0275elementEnd();
        \u0275\u0275element(14, "svg-icon", 11);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(15, "div", 12);
        \u0275\u0275element(16, "app-navbar-mobile-menu");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.menuService.showMobileMenu ? "animate-fade-in-up pointer-events-auto scale-100 opacity-100 duration-200" : "pointer-events-none scale-95 opacity-0 duration-100 ease-out");
      }
    }, dependencies: [NgClass, AngularSvgIconModule, SvgIconComponent, NavbarMobileMenuComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarMobileComponent, { className: "NavbarMobileComponent", filePath: "src/app/modules/layout/components/navbar/navbar-mobile/navbar-mobilecomponent.ts", lineNumber: 13 });
})();

// src/app/modules/layout/components/navbar/profile-menu/profile-menu.component.ts
var _c07 = (a0) => ({ "border-muted-foreground bg-card": a0 });
function ProfileMenuComponent_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 12);
    \u0275\u0275element(1, "svg-icon", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275propertyInterpolate("routerLink", item_r1.link);
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("src", item_r1.icon);
    \u0275\u0275property("svgClass", "h-5 w-5 text-muted-foreground/50");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r1.title, " ");
  }
}
function ProfileMenuComponent_For_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275listener("click", function ProfileMenuComponent_For_26_Template_div_click_0_listener() {
      const item_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleThemeColor(item_r3.name));
    });
    \u0275\u0275element(1, "span", 22);
    \u0275\u0275elementStart(2, "p", 23);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c07, item_r3.name == ctx_r3.themeService.theme().color));
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", item_r3.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r3.name);
  }
}
function ProfileMenuComponent_For_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275listener("click", function ProfileMenuComponent_For_32_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleThemeMode());
    });
    \u0275\u0275element(1, "svg-icon", 20);
    \u0275\u0275elementStart(2, "p", 23);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c07, item_r6 == ctx_r3.themeService.theme().mode));
    \u0275\u0275advance();
    \u0275\u0275property("src", item_r6 == "light" ? "assets/icons/heroicons/outline/sun.svg" : "assets/icons/heroicons/outline/moon.svg")("svgClass", "h-5 mr-2 w-5 text-muted-foreground/50");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6);
  }
}
var ProfileMenuComponent = class _ProfileMenuComponent {
  constructor(themeService, authService, _router) {
    this.themeService = themeService;
    this.authService = authService;
    this._router = _router;
    this.isOpen = false;
    this.profileMenu = [
      {
        title: "Your Profile",
        icon: "./assets/icons/heroicons/outline/user-circle.svg",
        link: "/profile"
      },
      {
        title: "Settings",
        icon: "./assets/icons/heroicons/outline/cog-6-tooth.svg",
        link: "/settings"
      }
    ];
    this.themeColors = [
      {
        name: "base",
        code: "#e11d48"
      },
      {
        name: "yellow",
        code: "#f59e0b"
      },
      {
        name: "green",
        code: "#22c55e"
      },
      {
        name: "blue",
        code: "#3b82f6"
      },
      {
        name: "orange",
        code: "#ea580c"
      },
      {
        name: "red",
        code: "#cc0022"
      },
      {
        name: "violet",
        code: "#6d28d9"
      }
    ];
    this.themeMode = ["light", "dark"];
  }
  ngOnInit() {
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? "dark" : "light";
      return __spreadProps(__spreadValues({}, theme), { mode });
    });
  }
  toggleThemeColor(color) {
    this.themeService.theme.update((theme) => {
      return __spreadProps(__spreadValues({}, theme), { color });
    });
  }
  logout() {
    return __async(this, null, function* () {
      yield this.authService.logout();
      this._router.navigate(["/auth"]);
    });
  }
  static {
    this.\u0275fac = function ProfileMenuComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProfileMenuComponent)(\u0275\u0275directiveInject(ThemeService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileMenuComponent, selectors: [["app-profile-menu"]], decls: 33, vars: 2, consts: [[1, "relative", "ml-3"], ["type", "button", 1, "bg-card", "relative", "flex", "rounded-full", "text-sm", 3, "click"], [1, "sr-only"], ["clickOutside", "", "src", "https://avatars.githubusercontent.com/u/12519008?v=4", "alt", "", 1, "h-9", "w-9", "rounded-md", 3, "clickOutside"], [1, "bg-background", "shadow-custom", "absolute", "right-0", "z-20", "mt-2", "w-60", "origin-top-right", "transform", "rounded-md", "py-4", "ring-1", "ring-transparent", "ring-opacity-5", "transition", "focus:outline-hidden"], [1, "flext-row", "flex", "items-center", "px-4", "pb-4"], [1, "w-10", "shrink-0"], ["src", "https://avatars.githubusercontent.com/u/12519008?v=4", "alt", "", 1, "rounded-md"], [1, "text-foreground", "overflow-hidden", "px-2", "text-sm", "font-semibold"], [1, "text-muted-foreground", "truncate", "text-ellipsis", "text-xs", "font-semibold"], [1, "border-border", "border-b", "border-dashed"], [1, "my-2", "mx-4", "flex", "flex-col"], ["key", "$index", 1, "text-muted-foreground", "hover:bg-card", "hover:text-primary", "inline-flex", "cursor-pointer", "items-center", "gap-2", "rounded-md", "px-3", "py-2", "text-xs", "font-semibold", 3, "routerLink"], [1, "text-muted-foreground", "hover:bg-card", "hover:text-primary", "inline-flex", "cursor-pointer", "items-center", "gap-2", "rounded-md", "px-3", "py-2", "text-xs", "font-semibold", 3, "click"], ["src", "./assets/icons/heroicons/outline/logout.svg", 3, "svgClass"], [1, "border-border", "border-dashed"], [1, "mx-4", "my-2"], [1, "text-foreground", "text-xs", "font-semibold"], [1, "mt-2", "grid", "grid-cols-2", "gap-2"], ["key", "$index", 1, "focus-visible:ring-ring", "border-border", "bg-background", "text-muted-foreground", "hover:bg-card", "hover:text-foreground", "shadow-xs", "inline-flex", "h-8", "cursor-pointer", "items-center", "justify-start", "whitespace-nowrap", "rounded-md", "border", "px-3", "text-xs", "font-medium", "transition-colors", "focus-visible:outline-hidden", "focus-visible:ring-1", "disabled:pointer-events-none", "disabled:opacity-50", 3, "ngClass"], [3, "src", "svgClass"], ["key", "$index", 1, "focus-visible:ring-ring", "border-border", "bg-background", "text-muted-foreground", "hover:bg-card", "hover:text-foreground", "shadow-xs", "inline-flex", "h-8", "cursor-pointer", "items-center", "justify-start", "whitespace-nowrap", "rounded-md", "border", "px-3", "text-xs", "font-medium", "transition-colors", "focus-visible:outline-hidden", "focus-visible:ring-1", "disabled:pointer-events-none", "disabled:opacity-50", 3, "click", "ngClass"], [1, "mr-1", "flex", "h-5", "w-5", "shrink-0", "-translate-x-1", "items-center", "justify-center", "rounded-full", "bg-rose-500"], [1, "capitalize"]], template: function ProfileMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "button", 1);
        \u0275\u0275listener("click", function ProfileMenuComponent_Template_button_click_1_listener() {
          return ctx.toggleMenu();
        });
        \u0275\u0275elementStart(2, "span", 2);
        \u0275\u0275text(3, "Open user menu");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "img", 3);
        \u0275\u0275listener("clickOutside", function ProfileMenuComponent_Template_img_clickOutside_4_listener() {
          return ctx.isOpen = false;
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 4)(6, "div", 5)(7, "div", 6);
        \u0275\u0275element(8, "img", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "div", 8);
        \u0275\u0275text(10, " Luciano Oliveira ");
        \u0275\u0275elementStart(11, "p", 9);
        \u0275\u0275text(12, "me@lanno.dev");
        \u0275\u0275elementEnd()()();
        \u0275\u0275element(13, "div", 10);
        \u0275\u0275elementStart(14, "ul", 11);
        \u0275\u0275repeaterCreate(15, ProfileMenuComponent_For_16_Template, 3, 4, "li", 12, \u0275\u0275repeaterTrackByIndex);
        \u0275\u0275elementStart(17, "li", 13);
        \u0275\u0275listener("click", function ProfileMenuComponent_Template_li_click_17_listener() {
          return ctx.logout();
        });
        \u0275\u0275element(18, "svg-icon", 14);
        \u0275\u0275text(19, " Log Out ");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(20, "hr", 15);
        \u0275\u0275elementStart(21, "div", 16)(22, "span", 17);
        \u0275\u0275text(23, "Color");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 18);
        \u0275\u0275repeaterCreate(25, ProfileMenuComponent_For_26_Template, 4, 6, "div", 19, \u0275\u0275repeaterTrackByIndex);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "div", 16)(28, "span", 17);
        \u0275\u0275text(29, "Mode");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "div", 18);
        \u0275\u0275repeaterCreate(31, ProfileMenuComponent_For_32_Template, 4, 6, "div", 19, \u0275\u0275repeaterTrackByIndex);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275property("@openClose", ctx.isOpen ? "open" : "closed");
        \u0275\u0275advance(10);
        \u0275\u0275repeater(ctx.profileMenu);
        \u0275\u0275advance(3);
        \u0275\u0275property("svgClass", "h-5 w-5 text-muted-foreground/50");
        \u0275\u0275advance(7);
        \u0275\u0275repeater(ctx.themeColors);
        \u0275\u0275advance(6);
        \u0275\u0275repeater(ctx.themeMode);
      }
    }, dependencies: [CommonModule, NgClass, ClickOutsideDirective, RouterLink, AngularSvgIconModule, SvgIconComponent], encapsulation: 2, data: { animation: [
      trigger("openClose", [
        state("open", style({
          opacity: 1,
          transform: "translateY(0)",
          visibility: "visible"
        })),
        state("closed", style({
          opacity: 0,
          transform: "translateY(-20px)",
          visibility: "hidden"
        })),
        transition("open => closed", [animate("0.2s")]),
        transition("closed => open", [animate("0.2s")])
      ])
    ] } });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileMenuComponent, { className: "ProfileMenuComponent", filePath: "src/app/modules/layout/components/navbar/profile-menu/profile-menu.component.ts", lineNumber: 38 });
})();

// src/app/modules/layout/components/navbar/navbar.component.ts
var NavbarComponent = class _NavbarComponent {
  constructor(menuService) {
    this.menuService = menuService;
  }
  ngOnInit() {
  }
  toggleMobileMenu() {
    this.menuService.showMobileMenu = true;
  }
  static {
    this.\u0275fac = function NavbarComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NavbarComponent)(\u0275\u0275directiveInject(MenuService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarComponent, selectors: [["app-navbar"]], decls: 18, vars: 1, consts: [[1, "bg-background", "relative"], [1, "mx-auto", "px-5"], [1, "flex", "items-center", "justify-between", "py-3.5", "md:justify-start"], [1, "sm:order-1", "md:hidden"], ["type", "button", "aria-expanded", "false", 1, "bg-muted", "text-muted-foreground", "focus:ring-primary", "hover:bg-muted-foreground", "hover:text-muted", "inline-flex", "items-center", "justify-center", "rounded-md", "p-2", "focus:outline-hidden", "focus:ring-2", "focus:ring-inset", 3, "click"], [1, "sr-only"], ["src", "assets/icons/heroicons/outline/menu.svg", 3, "svgClass"], [1, "flex", "items-center", "justify-start", "sm:order-2", "md:mr-10", "lg:hidden"], [1, "bg-primary", "flex", "items-center", "justify-center", "rounded-sm", "p-2", "focus:outline-hidden", "focus:ring-1"], ["src", "assets/icons/logo.svg"], [1, "text-foreground", "hidden", "pl-3", "text-sm", "font-bold", "sm:block"], [1, "hidden", "space-x-10", "sm:order-3", "md:flex"], [1, "items-center", "justify-end", "sm:order-4", "md:flex", "md:flex-1", "lg:w-0"]], template: function NavbarComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "button", 4);
        \u0275\u0275listener("click", function NavbarComponent_Template_button_click_4_listener() {
          return ctx.toggleMobileMenu();
        });
        \u0275\u0275elementStart(5, "span", 5);
        \u0275\u0275text(6, "Open menu");
        \u0275\u0275elementEnd();
        \u0275\u0275element(7, "svg-icon", 6);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 7)(9, "a", 8);
        \u0275\u0275element(10, "svg-icon", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "b", 10);
        \u0275\u0275text(12, " Angular Tailwind ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "div", 11);
        \u0275\u0275element(14, "app-navbar-menu");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 12);
        \u0275\u0275element(16, "app-profile-menu");
        \u0275\u0275elementEnd()()();
        \u0275\u0275element(17, "app-navbar-mobile");
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275property("svgClass", "h-6 w-6");
      }
    }, dependencies: [AngularSvgIconModule, SvgIconComponent, NavbarMenuComponent, ProfileMenuComponent, NavbarMobileComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarComponent, { className: "NavbarComponent", filePath: "src/app/modules/layout/components/navbar/navbar.component.ts", lineNumber: 14 });
})();

// src/app/modules/layout/components/footer/footer.component.ts
var FooterComponent = class _FooterComponent {
  constructor() {
    this.year = (/* @__PURE__ */ new Date()).getFullYear();
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function FooterComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FooterComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FooterComponent, selectors: [["app-footer"]], decls: 17, vars: 1, consts: [[1, "flex", "h-16", "items-center", "bg-background"], [1, "flex", "w-full", "items-center", "justify-between", "px-7", "text-[13px]", "font-medium"], [1, "text-muted-foreground/50"], [1, "mr-2"], ["href", "https://github.com/luciano-work/angular-tailwind", "target", "_blank", 1, "hover:text-primary"], [1, "flex", "text-muted-foreground/50"], [1, "hover:text-primary"], ["href", "https://github.com/luciano-work/angular-tailwind/issues", "target", "_blank", 1, "menu-link", "px-2"], ["href", "https://github.com/luciano-work/angular-tailwind", "target", "_blank", 1, "menu-link", "px-2"]], template: function FooterComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
        \u0275\u0275text(4);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "a", 4);
        \u0275\u0275text(6, " Angular Tailwind ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "ul", 5)(8, "li", 6)(9, "a", 7);
        \u0275\u0275text(10, " Issues ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "li", 6)(12, "a", 8);
        \u0275\u0275text(13, "Sponsor");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "li", 6)(15, "a", 8);
        \u0275\u0275text(16, "Starred");
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.year, "\xA9");
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "src/app/modules/layout/components/footer/footer.component.ts", lineNumber: 9 });
})();

// src/app/modules/layout/layout.component.ts
var LayoutComponent = class _LayoutComponent {
  constructor(router) {
    this.router = router;
    this.mainContent = null;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.mainContent) {
          this.mainContent.scrollTop = 0;
        }
      }
    });
  }
  ngOnInit() {
    this.mainContent = document.getElementById("main-content");
  }
  static {
    this.\u0275fac = function LayoutComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LayoutComponent)(\u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LayoutComponent, selectors: [["app-layout"]], standalone: false, decls: 8, vars: 0, consts: [[1, "flex", "h-screen", "w-full", "overflow-hidden"], [1, "flex", "grow", "flex-col", "content-start", "overflow-hidden", "bg-card"], ["id", "main-content", "cdkScrollable", "", 1, "scrollbar-thumb-rounded", "scrollbar-track-rounded", "grow", "overflow-auto", "scrollbar-thin", "scrollbar-track-transparent", "scrollbar-thumb-muted"], [1, "mx-auto", "px-4", "py-4", "sm:px-8", "lg:container"]], template: function LayoutComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275element(1, "app-sidebar");
        \u0275\u0275elementStart(2, "div", 1);
        \u0275\u0275element(3, "app-navbar");
        \u0275\u0275elementStart(4, "div", 2)(5, "div", 3);
        \u0275\u0275element(6, "router-outlet");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(7, "app-footer");
        \u0275\u0275elementEnd()();
      }
    }, dependencies: [RouterOutlet, SidebarComponent, NavbarComponent, FooterComponent, CdkScrollable], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LayoutComponent, { className: "LayoutComponent", filePath: "src/app/modules/layout/layout.component.ts", lineNumber: 14 });
})();

// src/app/modules/layout/layout-routing.module.ts
var routes = [
  {
    path: "dashboard",
    component: LayoutComponent,
    loadChildren: () => import("./dashboard.module-BJK3P5G5.js").then((m) => m.DashboardModule)
  },
  {
    path: "management",
    component: LayoutComponent,
    loadChildren: () => import("./management.module-OJ6LYNAD.js").then((m) => m.MangementModule)
  },
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "error/404" }
];
var LayoutRoutingModule = class _LayoutRoutingModule {
  static {
    this.\u0275fac = function LayoutRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LayoutRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _LayoutRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
  }
};

// src/app/modules/layout/layout.module.ts
var LayoutModule = class _LayoutModule {
  static {
    this.\u0275fac = function LayoutModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LayoutModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _LayoutModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
      CommonModule,
      SidebarComponent,
      NavbarComponent,
      ScrollingModule,
      LayoutRoutingModule
    ] });
  }
};
export {
  LayoutModule
};
//# sourceMappingURL=layout.module-DX6ZBHEN.js.map
