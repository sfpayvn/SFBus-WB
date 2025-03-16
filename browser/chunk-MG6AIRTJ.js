import {
  DOCUMENT,
  ElementRef,
  EventEmitter,
  filter,
  fromEvent,
  ɵɵdefineDirective,
  ɵɵdirectiveInject
} from "./chunk-GH4JMGH7.js";

// src/app/shared/directives/click-outside.directive.ts
var ClickOutsideDirective = class _ClickOutsideDirective {
  constructor(element, document) {
    this.element = element;
    this.document = document;
    this.clickOutside = new EventEmitter();
  }
  ngAfterViewInit() {
    this.documentClickSubscription = fromEvent(this.document, "click").pipe(filter((event) => {
      return !this.isInside(event.target);
    })).subscribe(() => {
      this.clickOutside.emit();
    });
  }
  ngOnDestroy() {
    this.documentClickSubscription?.unsubscribe();
  }
  isInside(elementToCheck) {
    return elementToCheck === this.element.nativeElement || this.element.nativeElement.contains(elementToCheck);
  }
  static {
    this.\u0275fac = function ClickOutsideDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ClickOutsideDirective)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(DOCUMENT));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _ClickOutsideDirective, selectors: [["", "clickOutside", ""]], outputs: { clickOutside: "clickOutside" } });
  }
};

export {
  ClickOutsideDirective
};
//# sourceMappingURL=chunk-MG6AIRTJ.js.map
