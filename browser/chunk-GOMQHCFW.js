import {
  CommonModule,
  EventEmitter,
  NgClass,
  input,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty
} from "./chunk-GH4JMGH7.js";

// src/app/shared/utils/ckassnames.ts
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/app/shared/components/button/button.component.ts
var _c0 = ["*"];
var ButtonComponent = class _ButtonComponent {
  constructor() {
    this.impact = input("none");
    this.size = input("medium");
    this.shape = input("rounded");
    this.tone = input("primary");
    this.shadow = input("none");
    this.full = input(false, {
      transform: (value) => typeof value === "string" ? value === "" : value
    });
    this.buttonClick = new EventEmitter();
    this.classes = "";
    this.baseClasses = "font-semibold focus-visible:outline-none flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";
    this.impactClasses = {
      primary: {
        bold: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        light: "bg-primary/20 text-primary hover:bg-primary/30 focus-visible:ring-primary",
        none: "bg-transparent text-primary hover:bg-primary/10 focus-visible:ring-primary"
      },
      danger: {
        bold: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive",
        light: "bg-destructive/20 text-destructive hover:bg-destructive/30 focus-visible:ring-destructive",
        none: "bg-transparent text-destructive hover:bg-destructive/10 focus-visible:ring-destructive"
      },
      success: {
        bold: "bg-green-500 text-green-950 hover:bg-green-600 focus-visible:ring-green-500",
        light: "bg-green-500/20 text-green-600 hover:bg-green-500/30 focus-visible:ring-green-500",
        none: "bg-transparent text-green-600 hover:bg-green-500/10 focus-visible:ring-green-500"
      },
      warning: {
        bold: "bg-yellow-500 text-yellow-950 hover:bg-yellow-600 focus-visible:ring-yellow-500",
        light: "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 focus-visible:ring-yellow-500",
        none: "bg-transparent text-yellow-600 hover:bg-yellow-500/10 focus-visible:ring-yellow-500"
      },
      info: {
        bold: "bg-violet-500 text-white hover:bg-violet-600 focus-visible:ring-violet-500",
        light: "bg-violet-500/20 text-violet-600 hover:bg-violet-500/30 focus-visible:ring-violet-500",
        none: "bg-transparent text-violet-600 hover:bg-violet-500/10 focus-visible:ring-violet-500"
      },
      light: {
        bold: "bg-muted text-muted-foreground hover:bg-muted/90 focus-visible:ring-muted",
        light: "bg-muted/20 text-muted-foreground hover:bg-muted focus-visible:ring-muted",
        none: "bg-transparent text-muted-foreground hover:bg-muted focus-visible:ring-muted"
      }
    };
    this.sizeClasses = {
      small: "px-3 py-1 text-xs",
      medium: "px-5 py-2 text-sm",
      large: "px-7 py-2.5 text-lg"
    };
    this.shapeClasses = {
      square: "rounded-none",
      rounded: "rounded-lg",
      pill: "rounded-full"
    };
    this.shadowClasses = {
      none: "",
      small: "shadow-sm",
      medium: "shadow-md",
      large: "shadow-lg"
    };
  }
  ngOnInit() {
    this.classes = cx(this.baseClasses, this.impactClasses[this.tone()][this.impact()], this.sizeClasses[this.size()], this.shapeClasses[this.shape()], this.shadowClasses[this.shadow()], this.full() ? "w-full" : "");
  }
  onButtonClick() {
    this.buttonClick.emit();
  }
  static {
    this.\u0275fac = function ButtonComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ButtonComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ButtonComponent, selectors: [["app-button"]], inputs: { impact: [1, "impact"], size: [1, "size"], shape: [1, "shape"], tone: [1, "tone"], shadow: [1, "shadow"], full: [1, "full"] }, outputs: { buttonClick: "buttonClick" }, ngContentSelectors: _c0, decls: 2, vars: 1, consts: [[3, "click", "ngClass"]], template: function ButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "button", 0);
        \u0275\u0275listener("click", function ButtonComponent_Template_button_click_0_listener() {
          return ctx.onButtonClick();
        });
        \u0275\u0275projection(1);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.classes);
      }
    }, dependencies: [CommonModule, NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ButtonComponent, { className: "ButtonComponent", filePath: "src/app/shared/components/button/button.component.ts", lineNumber: 19 });
})();

export {
  ButtonComponent
};
//# sourceMappingURL=chunk-GOMQHCFW.js.map
