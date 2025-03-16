import {
  ThemeService
} from "./chunk-WCTK3O4S.js";
import {
  AngularSvgIconModule,
  RouterModule,
  RouterOutlet,
  SvgIconComponent
} from "./chunk-KS4MOIL4.js";
import {
  ChangeDetectionStrategy,
  Component,
  CurrencyPipe,
  NgForOf,
  NgModule,
  NgStyle,
  NgZone,
  PLATFORM_ID,
  asapScheduler,
  effect,
  inject,
  input,
  isPlatformBrowser,
  output,
  setClassMetadata,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuerySignal
} from "./chunk-GH4JMGH7.js";
import {
  __async
} from "./chunk-TXDUYLVM.js";

// src/app/modules/dashboard/dashboard.component.ts
var DashboardComponent = class _DashboardComponent {
  constructor() {
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DashboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], decls: 1, vars: 0, template: function DashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "router-outlet");
      }
    }, dependencies: [RouterOutlet], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/modules/dashboard/dashboard.component.ts", lineNumber: 9 });
})();

// src/app/modules/dashboard/components/nft/nft-auctions-table-item/nft-auctions-table-item.component.ts
var _c0 = ["nft-auctions-table-item", ""];
var NftAuctionsTableItemComponent = class _NftAuctionsTableItemComponent {
  constructor() {
    this.auction = {};
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function NftAuctionsTableItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NftAuctionsTableItemComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NftAuctionsTableItemComponent, selectors: [["", "nft-auctions-table-item", ""]], inputs: { auction: "auction" }, attrs: _c0, decls: 25, vars: 10, consts: [[1, "py-2", "pr-2"], [1, "flex", "items-center"], ["alt", "", 1, "rounded-xs", "mr-2", "h-10", "w-10", "flex-none", 3, "src"], [1, "flex", "flex-col", "justify-items-start"], ["href", "#", 1, "text-foreground", "mb-1", "text-sm", "font-semibold"], [1, "text-muted-foreground/50", "text-xs", "font-semibold"], [1, "py-2", "pl-2", "text-right"], [1, "text-muted-foreground", "text-sm", "font-semibold"], [1, "flex", "justify-end"], ["href", "#", 1, "bg-card", "text-muted-foreground", "hover:bg-muted", "hover:text-foreground", "flex", "h-7", "w-7", "items-center", "justify-center", "rounded-md"], ["src", "assets/icons/heroicons/outline/arrow-sm-right.svg", 3, "svgClass"]], template: function NftAuctionsTableItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "td", 0)(1, "div", 1);
        \u0275\u0275element(2, "img", 2);
        \u0275\u0275elementStart(3, "div", 3)(4, "a", 4);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "span", 5);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(8, "td", 6)(9, "span", 7);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "td", 6)(12, "span", 7);
        \u0275\u0275text(13);
        \u0275\u0275pipe(14, "currency");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "td", 6)(16, "span", 7);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "td", 6)(19, "span", 7);
        \u0275\u0275text(20);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "td", 6)(22, "div", 8)(23, "button", 9);
        \u0275\u0275element(24, "svg-icon", 10);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("src", ctx.auction.image, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.auction.title);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.auction.creator);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1("", ctx.auction.instant_price, " ETH");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 8, ctx.auction.price));
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("", ctx.auction.last_bid, " ETH");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.auction.ending_in);
        \u0275\u0275advance(4);
        \u0275\u0275property("svgClass", "h-5 w-5");
      }
    }, dependencies: [AngularSvgIconModule, SvgIconComponent, CurrencyPipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NftAuctionsTableItemComponent, { className: "NftAuctionsTableItemComponent", filePath: "src/app/modules/dashboard/components/nft/nft-auctions-table-item/nft-auctions-table-item.component.ts", lineNumber: 11 });
})();

// src/app/modules/dashboard/components/nft/nft-auctions-table/nft-auctions-table.component.ts
var _c02 = ["nft-auctions-table", ""];
function NftAuctionsTableComponent_tr_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 12);
  }
  if (rf & 2) {
    const auction_r1 = ctx.$implicit;
    \u0275\u0275property("auction", auction_r1);
  }
}
var NftAuctionsTableComponent = class _NftAuctionsTableComponent {
  constructor() {
    this.activeAuction = [];
    this.activeAuction = [
      {
        id: 1346771,
        title: "Cripto Cities",
        creator: "Jenny Wilson",
        image: "https://lh3.googleusercontent.com/t_S1sM__cKCFbuhbwQ5JHKNRRggKuPH2O3FM_-1yOxJLRzz9VRMAPaVBibgrumZG3qsB1YxEuwvB7r9rl-F-gI6Km9NlfWhecfPS=h500",
        avatar: "https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg",
        ending_in: "1h 43m 52s",
        last_bid: 22,
        price: 35330.9,
        instant_price: 22
      },
      {
        id: 1346772,
        title: "Lady Ape Club",
        creator: "Jenny Wilson",
        image: "https://lh3.googleusercontent.com/k95IQpeYutx-lYXwgTZw0kXZl9GAkIOc4Yz3Dr06rndWphZ25kSWyF64aTqT3W4cOxz0eB5LfAss5i9WAR-ZPWVaifijsABLqzEYwHY=h500",
        avatar: "https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg",
        ending_in: "2h 00m 02s",
        last_bid: 2.8,
        price: 4812.72,
        instant_price: 2.9
      },
      {
        id: 1346780,
        title: "The King - Gordon Ryan",
        creator: "Jenny Wilson",
        image: "https://lh3.googleusercontent.com/iYNxP1eXG3C6ujTY4REQ9rBea19Z46oKtKkaDS1XA-ED5iFhFmPrvQPzwx8ZwACydCS2wbZ7K1P89XIED3s8JRcT6Pn0M1-sMifeyQ=h500",
        avatar: "https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg",
        ending_in: "1h 05m 00s",
        last_bid: 1,
        price: 1602.77,
        instant_price: 2.9
      },
      {
        id: 1346792,
        title: "Only by Shvembldr",
        creator: "Jenny Wilson",
        image: "https://lh3.googleusercontent.com/ujFwzDIXN64mJAHZwZ0OgNupowe5jlJPmV8OIrgSDjUAeb3SZRuhsuyPKAw6S2TkUknZvErVVKbzD-rEcs-augb6_LzUE5NVtPxj_w=h500",
        avatar: "https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg",
        ending_in: "1h 05m 00s",
        last_bid: 2,
        price: 1438.17,
        instant_price: 2.1
      },
      {
        id: 1346792,
        title: "Crypto Coven",
        creator: "Jenny Wilson",
        image: "https://lh3.googleusercontent.com/pwjA4CWS9nto8fCis6JzlWwzQgtHUvLlUWcd501LsGQoVUPL5euwhir-2fjPmsJLJ_ovJ7flH_OgDEaALeZrhSXv8Puq85-lZYWuqto=h500",
        avatar: "https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-13.jpg",
        ending_in: "1h 05m 00s",
        last_bid: 0.8,
        price: 1278.38,
        instant_price: 0.35
      }
    ];
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function NftAuctionsTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NftAuctionsTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NftAuctionsTableComponent, selectors: [["", "nft-auctions-table", ""]], attrs: _c02, decls: 27, vars: 1, consts: [[1, "flex-col", "rounded-lg", "bg-background", "px-8", "py-8", "sm:flex-row"], [1, "mb-4", "flex", "items-center", "justify-between"], [1, "flex-col", "items-center"], [1, "text-md", "font-bold", "text-foreground"], [1, "text-xs", "text-muted-foreground"], [1, "flex-none", "rounded-md", "bg-card", "px-4", "py-2.5", "text-xs", "font-semibold", "text-muted-foreground", "hover:bg-muted", "hover:text-foreground"], [1, "relative", "overflow-x-auto"], [1, "w-full", "table-auto"], [1, "text-xs", "uppercase", "text-muted-foreground"], [1, "py-3", "text-left"], [1, "py-3", "text-right"], ["nft-auctions-table-item", "", "class", "border-b border-dashed border-border hover:bg-card", 3, "auction", 4, "ngFor", "ngForOf"], ["nft-auctions-table-item", "", 1, "border-b", "border-dashed", "border-border", "hover:bg-card", 3, "auction"]], template: function NftAuctionsTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h3", 3);
        \u0275\u0275text(4, "Active Auctions");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "span", 4);
        \u0275\u0275text(6, "Updated 37 minutes ago");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "button", 5);
        \u0275\u0275text(8, " History ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "div", 6)(10, "table", 7)(11, "thead", 8)(12, "tr")(13, "th", 9);
        \u0275\u0275text(14, "Item");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "th", 10);
        \u0275\u0275text(16, "Open Price");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "th", 10);
        \u0275\u0275text(18, "Price $");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "th", 10);
        \u0275\u0275text(20, "Recent Offer");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "th", 10);
        \u0275\u0275text(22, "Time Left");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "th", 10);
        \u0275\u0275text(24, "View");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "tbody");
        \u0275\u0275template(26, NftAuctionsTableComponent_tr_26_Template, 1, 1, "tr", 11);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(26);
        \u0275\u0275property("ngForOf", ctx.activeAuction);
      }
    }, dependencies: [NgForOf, NftAuctionsTableItemComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NftAuctionsTableComponent, { className: "NftAuctionsTableComponent", filePath: "src/app/modules/dashboard/components/nft/nft-auctions-table/nft-auctions-table.component.ts", lineNumber: 11 });
})();

// node_modules/ng-apexcharts/fesm2022/ng-apexcharts.mjs
var _c03 = ["chart"];
var ChartComponent = class _ChartComponent {
  constructor() {
    this.chart = input();
    this.annotations = input();
    this.colors = input();
    this.dataLabels = input();
    this.series = input();
    this.stroke = input();
    this.labels = input();
    this.legend = input();
    this.markers = input();
    this.noData = input();
    this.fill = input();
    this.tooltip = input();
    this.plotOptions = input();
    this.responsive = input();
    this.xaxis = input();
    this.yaxis = input();
    this.forecastDataPoints = input();
    this.grid = input();
    this.states = input();
    this.title = input();
    this.subtitle = input();
    this.theme = input();
    this.autoUpdateSeries = input(true);
    this.chartReady = output();
    this.chartInstance = signal(null);
    this.chartElement = viewChild.required("chart");
    this.ngZone = inject(NgZone);
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }
  ngOnChanges(changes) {
    if (!this.isBrowser) return;
    this.ngZone.runOutsideAngular(() => {
      asapScheduler.schedule(() => this.hydrate(changes));
    });
  }
  ngOnDestroy() {
    this.destroy();
  }
  hydrate(changes) {
    const shouldUpdateSeries = this.autoUpdateSeries() && Object.keys(changes).filter((c) => c !== "series").length === 0;
    if (shouldUpdateSeries) {
      this.updateSeries(this.series(), true);
      return;
    }
    this.createElement();
  }
  createElement() {
    return __async(this, null, function* () {
      const {
        default: ApexCharts
      } = yield import("./apexcharts.common-AUQURXIY.js");
      window.ApexCharts ||= ApexCharts;
      const options = {};
      const properties = ["annotations", "chart", "colors", "dataLabels", "series", "stroke", "labels", "legend", "fill", "tooltip", "plotOptions", "responsive", "markers", "noData", "xaxis", "yaxis", "forecastDataPoints", "grid", "states", "title", "subtitle", "theme"];
      properties.forEach((property) => {
        const value = this[property]();
        if (value) {
          options[property] = value;
        }
      });
      this.destroy();
      const chartInstance = this.ngZone.runOutsideAngular(() => new ApexCharts(this.chartElement().nativeElement, options));
      this.chartInstance.set(chartInstance);
      this.render();
      this.chartReady.emit({
        chartObj: chartInstance
      });
    });
  }
  render() {
    return this.ngZone.runOutsideAngular(() => this.chartInstance()?.render());
  }
  updateOptions(options, redrawPaths, animate, updateSyncedCharts) {
    return this.ngZone.runOutsideAngular(() => this.chartInstance()?.updateOptions(options, redrawPaths, animate, updateSyncedCharts));
  }
  updateSeries(newSeries, animate) {
    return this.ngZone.runOutsideAngular(() => this.chartInstance()?.updateSeries(newSeries, animate));
  }
  appendSeries(newSeries, animate) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.appendSeries(newSeries, animate));
  }
  appendData(newData) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.appendData(newData));
  }
  highlightSeries(seriesName) {
    return this.ngZone.runOutsideAngular(() => this.chartInstance()?.highlightSeries(seriesName));
  }
  toggleSeries(seriesName) {
    return this.ngZone.runOutsideAngular(() => this.chartInstance()?.toggleSeries(seriesName));
  }
  showSeries(seriesName) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.showSeries(seriesName));
  }
  hideSeries(seriesName) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.hideSeries(seriesName));
  }
  resetSeries() {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.resetSeries());
  }
  zoomX(min, max) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.zoomX(min, max));
  }
  toggleDataPointSelection(seriesIndex, dataPointIndex) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.toggleDataPointSelection(seriesIndex, dataPointIndex));
  }
  destroy() {
    this.chartInstance()?.destroy();
    this.chartInstance.set(null);
  }
  setLocale(localeName) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.setLocale(localeName));
  }
  paper() {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.paper());
  }
  addXaxisAnnotation(options, pushToMemory, context) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.addXaxisAnnotation(options, pushToMemory, context));
  }
  addYaxisAnnotation(options, pushToMemory, context) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.addYaxisAnnotation(options, pushToMemory, context));
  }
  addPointAnnotation(options, pushToMemory, context) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.addPointAnnotation(options, pushToMemory, context));
  }
  removeAnnotation(id, options) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.removeAnnotation(id, options));
  }
  clearAnnotations(options) {
    this.ngZone.runOutsideAngular(() => this.chartInstance()?.clearAnnotations(options));
  }
  dataURI(options) {
    return this.chartInstance()?.dataURI(options);
  }
  static {
    this.\u0275fac = function ChartComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChartComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _ChartComponent,
      selectors: [["apx-chart"]],
      viewQuery: function ChartComponent_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuerySignal(ctx.chartElement, _c03, 5);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance();
        }
      },
      inputs: {
        chart: [1, "chart"],
        annotations: [1, "annotations"],
        colors: [1, "colors"],
        dataLabels: [1, "dataLabels"],
        series: [1, "series"],
        stroke: [1, "stroke"],
        labels: [1, "labels"],
        legend: [1, "legend"],
        markers: [1, "markers"],
        noData: [1, "noData"],
        fill: [1, "fill"],
        tooltip: [1, "tooltip"],
        plotOptions: [1, "plotOptions"],
        responsive: [1, "responsive"],
        xaxis: [1, "xaxis"],
        yaxis: [1, "yaxis"],
        forecastDataPoints: [1, "forecastDataPoints"],
        grid: [1, "grid"],
        states: [1, "states"],
        title: [1, "title"],
        subtitle: [1, "subtitle"],
        theme: [1, "theme"],
        autoUpdateSeries: [1, "autoUpdateSeries"]
      },
      outputs: {
        chartReady: "chartReady"
      },
      features: [\u0275\u0275NgOnChangesFeature],
      decls: 2,
      vars: 0,
      consts: [["chart", ""]],
      template: function ChartComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275element(0, "div", null, 0);
        }
      },
      encapsulation: 2,
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChartComponent, [{
    type: Component,
    args: [{
      selector: "apx-chart",
      template: `<div #chart></div>`,
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true
    }]
  }], null, null);
})();
var declarations = [ChartComponent];
var NgApexchartsModule = class _NgApexchartsModule {
  static {
    this.\u0275fac = function NgApexchartsModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgApexchartsModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _NgApexchartsModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgApexchartsModule, [{
    type: NgModule,
    args: [{
      imports: [declarations],
      exports: [declarations]
    }]
  }], null, null);
})();

// src/app/modules/dashboard/components/nft/nft-chart-card/nft-chart-card.component.ts
var _c04 = ["nft-chart-card", ""];
var NftChartCardComponent = class _NftChartCardComponent {
  constructor(themeService) {
    this.themeService = themeService;
    let baseColor = "#FFFFFF";
    const data = [2100, 3200, 3200, 2400, 2400, 1800, 1800, 2400, 2400, 3200, 3200, 3e3, 3e3, 3250, 3250];
    const categories = [
      "10AM",
      "10.30AM",
      "11AM",
      "11.15AM",
      "11.30AM",
      "12PM",
      "1PM",
      "2PM",
      "3PM",
      "4PM",
      "5PM",
      "6PM",
      "7PM",
      "8PM",
      "9PM"
    ];
    this.chartOptions = {
      series: [
        {
          name: "Etherium",
          data
        }
      ],
      chart: {
        fontFamily: "inherit",
        type: "area",
        height: 150,
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.2,
          stops: [15, 120, 100]
        }
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: [baseColor]
        // line color
      },
      xaxis: {
        categories,
        labels: {
          show: false
        },
        crosshairs: {
          position: "front",
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 4
          }
        },
        tooltip: {
          enabled: true
        }
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: function(val) {
            return val + "$";
          }
        }
      },
      colors: [baseColor]
      //line colors
    };
    effect(() => {
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary");
      this.chartOptions.tooltip = {
        theme: this.themeService.theme().mode
      };
      this.chartOptions.colors = [primaryColor];
      this.chartOptions.stroke.colors = [primaryColor];
      this.chartOptions.xaxis.crosshairs.stroke.color = primaryColor;
    });
  }
  ngOnInit() {
  }
  ngOnDestroy() {
  }
  static {
    this.\u0275fac = function NftChartCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NftChartCardComponent)(\u0275\u0275directiveInject(ThemeService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NftChartCardComponent, selectors: [["", "nft-chart-card", ""]], attrs: _c04, decls: 64, vars: 15, consts: [[1, "bg-background", "flex-col", "rounded-lg", "px-8", "py-8", "sm:flex-row"], [1, "mb-2", "flex", "items-center", "justify-between"], [1, "flex-col"], [1, "flex", "items-center", "space-x-1"], [1, "text-muted-foreground", "text-lg", "font-semibold"], [1, "text-foreground", "text-4xl", "font-semibold"], [1, "flex", "items-center", "rounded-md", "bg-green-500/25", "py-1", "pr-2", "pl-1", "text-xs", "font-semibold", "text-green-500"], ["src", "assets/icons/heroicons/outline/arrow-sm-up.svg", 3, "svgClass"], [1, "text-muted-foreground", "text-sm"], [1, "rounded-xs", "bg-card", "text-muted-foreground", "hover:bg-muted", "hover:text-foreground", "cursor-pointer", "px-1", "py-1", "text-center", "text-xs"], ["src", "assets/icons/heroicons/outline/dots-horizontal.svg", 3, "svgClass"], [1, "mb-3", "grid", "grid-cols-5", "items-center", "justify-between", "gap-2", "text-center"], [1, "bg-primary", "text-primary-foreground", "hover:bg-primary", "cursor-pointer", "rounded-md", "p-0.5", "text-sm"], [1, "hover:bg-primary", "hover:text-primary-foreground", "cursor-pointer", "rounded-md", "p-0.5", "text-sm", "text-gray-400"], [3, "series", "chart", "legend", "dataLabels", "fill", "stroke", "xaxis", "yaxis", "states", "tooltip", "colors", "grid", "title"], [1, "mt-2", "w-full", "table-auto", "text-sm"], [1, "py-2"], [1, "text-muted-foreground", "text-sm", "font-semibold"], [1, "py-2", "text-right"], [1, "text-foreground", "text-sm", "font-semibold"], [1, "text-sm", "font-semibold", "text-rose-600"], [1, "text-sm", "font-semibold", "text-green-500"]], template: function NftChartCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
        \u0275\u0275text(5, "$");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "span", 5);
        \u0275\u0275text(7, "3,274.94");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "div", 6);
        \u0275\u0275element(9, "svg-icon", 7);
        \u0275\u0275text(10, " 9.2% ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "span", 8);
        \u0275\u0275text(12, "Etherium rate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "div", 9);
        \u0275\u0275element(14, "svg-icon", 10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "div", 11)(16, "div", 12);
        \u0275\u0275text(17, "1d");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "div", 13);
        \u0275\u0275text(19, " 5d ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 13);
        \u0275\u0275text(21, " 1m ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "div", 13);
        \u0275\u0275text(23, " 6m ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 13);
        \u0275\u0275text(25, " 1y ");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(26, "apx-chart", 14);
        \u0275\u0275elementStart(27, "table", 15)(28, "thead")(29, "tr");
        \u0275\u0275element(30, "th")(31, "th")(32, "th");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(33, "tbody")(34, "tr")(35, "td", 16)(36, "a", 17);
        \u0275\u0275text(37, "2:30 PM");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(38, "td", 18)(39, "span", 19);
        \u0275\u0275text(40, "$2,756.26");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(41, "td", 18)(42, "span", 20);
        \u0275\u0275text(43, "-139.34");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(44, "tr")(45, "td", 16)(46, "a", 17);
        \u0275\u0275text(47, "3:10 PM");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(48, "td", 18)(49, "span", 19);
        \u0275\u0275text(50, "$3,207.03");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(51, "td", 18)(52, "span", 21);
        \u0275\u0275text(53, "+576.24");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(54, "tr")(55, "td", 16)(56, "a", 17);
        \u0275\u0275text(57, "3:55 PM");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(58, "td", 18)(59, "span", 19);
        \u0275\u0275text(60, "$3,274.94");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(61, "td", 18)(62, "span", 21);
        \u0275\u0275text(63, "+124.03");
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275property("svgClass", "h-4 w-4");
        \u0275\u0275advance(5);
        \u0275\u0275property("svgClass", "h-3 w-3");
        \u0275\u0275advance(12);
        \u0275\u0275property("series", ctx.chartOptions.series)("chart", ctx.chartOptions.chart)("legend", ctx.chartOptions.legend)("dataLabels", ctx.chartOptions.dataLabels)("fill", ctx.chartOptions.fill)("stroke", ctx.chartOptions.stroke)("xaxis", ctx.chartOptions.xaxis)("yaxis", ctx.chartOptions.yaxis)("states", ctx.chartOptions.states)("tooltip", ctx.chartOptions.tooltip)("colors", ctx.chartOptions.colors)("grid", ctx.chartOptions.grid)("title", ctx.chartOptions.title);
      }
    }, dependencies: [AngularSvgIconModule, SvgIconComponent, NgApexchartsModule, ChartComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NftChartCardComponent, { className: "NftChartCardComponent", filePath: "src/app/modules/dashboard/components/nft/nft-chart-card/nft-chart-card.component.ts", lineNumber: 12 });
})();

// src/app/modules/dashboard/components/nft/nft-dual-card/nft-dual-card.component.ts
var _c05 = ["nft-dual-card", ""];
var _c1 = (a0) => ({ "background-image": a0 });
var NftDualCardComponent = class _NftDualCardComponent {
  constructor() {
    this.nft = {};
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function NftDualCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NftDualCardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NftDualCardComponent, selectors: [["", "nft-dual-card", ""]], inputs: { nft: "nft" }, attrs: _c05, decls: 42, vars: 13, consts: [[1, "bg-background", "flex", "min-h-[420px]", "flex-col", "rounded-lg", "p-8", "sm:flex-row"], [1, "min-h-[200px]", "w-full", "flex-1", "cursor-pointer", "rounded-md", "bg-cover", "transition", "duration-150", "ease-in-out", "hover:opacity-75", 3, "ngStyle"], [1, "mt-4", "flex", "flex-1", "flex-col", "justify-between", "space-y-2", "sm:ml-6", "md:mt-0"], [1, "text-muted-foreground", "font-semibold"], [1, "text-foreground", "text-2xl", "font-semibold"], [1, "flex", "space-x-8"], [1, "flex", "items-center", "space-x-2"], ["alt", "creator face", 1, "mx-auto", "block", "h-7", "rounded-full", "sm:mx-0", "sm:shrink-0", 3, "src"], [1, "flex", "flex-col"], [1, "text-muted-foreground", "text-xs"], ["href", "", 1, "text-foreground", "hover:text-primary", "text-xs", "font-semibold"], [1, "bg-primary", "flex", "h-7", "w-7", "shrink-0", "items-center", "justify-center", "rounded-full", "text-center"], [1, "text-primary-foreground", "text-xs", "font-semibold"], [1, "border-border", "rounded-md", "border", "border-dashed", "p-4", "text-center"], [1, "text-muted-foreground"], [1, "text-foreground", "text-3xl", "font-semibold"], [1, "text-muted-foreground", "text-lg", "font-semibold"], [1, "text-muted-foreground", "mt-3", "text-xs"], [1, "text-foreground", "font-semibold"], [1, "flex", "items-center", "justify-between"], [1, "hover:bg-primary-600", "bg-primary", "text-primary-foreground", "flex-none", "rounded-md", "px-4", "py-2.5", "text-xs", "font-semibold"], [1, "lex-none", "bg-card", "text-muted-foreground", "hover:bg-muted", "hover:text-foreground", "rounded-md", "px-4", "py-2.5", "text-xs", "font-semibold"]], template: function NftDualCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275element(1, "div", 1);
        \u0275\u0275elementStart(2, "div", 2)(3, "div")(4, "small", 3);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "h2", 4);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 5)(9, "div", 6);
        \u0275\u0275element(10, "img", 7);
        \u0275\u0275elementStart(11, "div", 8)(12, "small", 9);
        \u0275\u0275text(13, "Creator");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "a", 10);
        \u0275\u0275text(15);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(16, "div", 6)(17, "div", 11)(18, "span", 12);
        \u0275\u0275text(19, "$");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "div", 8)(21, "small", 9);
        \u0275\u0275text(22, "Instant Price");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "a", 10);
        \u0275\u0275text(24);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(25, "div", 13)(26, "small", 14);
        \u0275\u0275text(27, "Last Bid");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "h1", 15);
        \u0275\u0275text(29);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "span", 16);
        \u0275\u0275text(31);
        \u0275\u0275pipe(32, "currency");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "div", 17);
        \u0275\u0275text(34, "Ending in");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "div", 18);
        \u0275\u0275text(36);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(37, "div", 19)(38, "button", 20);
        \u0275\u0275text(39, " Place a Bid ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "button", 21);
        \u0275\u0275text(41, " View Item ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("ngStyle", \u0275\u0275pureFunction1(11, _c1, "url(" + ctx.nft.image + ")"));
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1("NFT ID: ", ctx.nft.id, "");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.nft.title);
        \u0275\u0275advance(3);
        \u0275\u0275property("src", ctx.nft.avatar, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1(" ", ctx.nft.creator, " ");
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate1(" ", ctx.nft.instant_price, " ETH ");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("", ctx.nft.last_bid, " ETH");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(32, 9, ctx.nft.price));
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.nft.ending_in);
      }
    }, dependencies: [NgStyle, CurrencyPipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NftDualCardComponent, { className: "NftDualCardComponent", filePath: "src/app/modules/dashboard/components/nft/nft-dual-card/nft-dual-card.component.ts", lineNumber: 10 });
})();

// src/app/modules/dashboard/components/nft/nft-header/nft-header.component.ts
var NftHeaderComponent = class _NftHeaderComponent {
  constructor() {
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function NftHeaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NftHeaderComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NftHeaderComponent, selectors: [["app-nft-header"]], decls: 14, vars: 0, consts: [[1, "mb-4", "flex", "justify-between"], [1, "inline-block"], [1, "font-semibold", "text-foreground"], [1, "space-x-1", "text-xs", "font-medium", "text-muted-foreground"], ["href", "", 1, "hover:text-primary"], [1, "inline-block", "space-x-4"], [1, "flex-none", "rounded-md", "bg-muted", "px-4", "py-2.5", "text-xs", "font-semibold", "text-muted-foreground", "hover:text-foreground"], [1, "flex-none", "rounded-md", "bg-primary", "px-4", "py-2.5", "text-xs", "font-semibold", "text-primary-foreground"]], template: function NftHeaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
        \u0275\u0275text(3, "NFTs Dashboard");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "a", 4);
        \u0275\u0275text(6, "Dashboards");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "span");
        \u0275\u0275text(8, " - NFTs");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(9, "div", 5)(10, "button", 6);
        \u0275\u0275text(11, " Manage Bids ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "button", 7);
        \u0275\u0275text(13, " Manage Bids ");
        \u0275\u0275elementEnd()()();
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NftHeaderComponent, { className: "NftHeaderComponent", filePath: "src/app/modules/dashboard/components/nft/nft-header/nft-header.component.ts", lineNumber: 8 });
})();

// src/app/modules/dashboard/components/nft/nft-single-card/nft-single-card.component.ts
var _c06 = ["nft-single-card", ""];
var _c12 = (a0) => ({ "background-image": a0 });
var NftSingleCardComponent = class _NftSingleCardComponent {
  constructor() {
    this.nft = {};
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function NftSingleCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NftSingleCardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NftSingleCardComponent, selectors: [["", "nft-single-card", ""]], inputs: { nft: "nft" }, attrs: _c06, decls: 14, vars: 8, consts: [[1, "flex", "h-[420px]", "flex-col", "rounded-lg", "bg-background", "p-8"], [1, "h-[240px]", "cursor-pointer", "rounded-md", "bg-cover", "transition", "duration-150", "ease-in-out", "hover:opacity-75", 3, "ngStyle"], [1, "text-md", "mt-6", "font-semibold", "text-foreground"], [1, "dflex", "items-end", "justify-between", "text-sm", "font-semibold", "text-muted-foreground"], [1, "mt-6", "flex", "items-center", "justify-between"], [1, "hover:bg-primary-600", "flex-none", "rounded-md", "bg-primary", "px-4", "py-2.5", "text-xs", "font-semibold", "text-primary-foreground"], [1, "lex-none", "rounded-md", "bg-card", "px-4", "py-2.5", "text-xs", "font-semibold", "text-muted-foreground", "hover:bg-muted", "hover:text-foreground"]], template: function NftSingleCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275element(1, "div", 1);
        \u0275\u0275elementStart(2, "h2", 2);
        \u0275\u0275text(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3);
        \u0275\u0275text(5);
        \u0275\u0275elementStart(6, "span");
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "currency");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "div", 4)(10, "button", 5);
        \u0275\u0275text(11, " Place a Bid ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "button", 6);
        \u0275\u0275text(13, " View Item ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("ngStyle", \u0275\u0275pureFunction1(6, _c12, "url(" + ctx.nft.image + ")"));
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.nft.title);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" Last Bid: ", ctx.nft.last_bid, " ETH ");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 4, ctx.nft.price));
      }
    }, dependencies: [NgStyle, CurrencyPipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NftSingleCardComponent, { className: "NftSingleCardComponent", filePath: "src/app/modules/dashboard/components/nft/nft-single-card/nft-single-card.component.ts", lineNumber: 10 });
})();

// src/app/modules/dashboard/pages/nft/nft.component.ts
var NftComponent = class _NftComponent {
  constructor() {
    this.nft = [
      {
        id: 34356771,
        title: "Girls of the Cartoon Universe",
        creator: "Jhon Doe",
        instant_price: 4.2,
        price: 187.47,
        ending_in: "06h 52m 47s",
        last_bid: 0.12,
        image: "./assets/images/img-01.jpg",
        avatar: "./assets/avatars/avt-01.jpg"
      },
      {
        id: 34356772,
        title: "Pupaks",
        price: 548.79,
        last_bid: 0.35,
        image: "./assets/images/img-02.jpg"
      },
      {
        id: 34356773,
        title: "Seeing Green collection",
        price: 234.88,
        last_bid: 0.15,
        image: "./assets/images/img-03.jpg"
      }
    ];
  }
  ngOnInit() {
  }
  static {
    this.\u0275fac = function NftComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NftComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NftComponent, selectors: [["app-nft"]], decls: 8, vars: 3, consts: [[1, "grid", "grid-cols-1", "gap-4", "md:grid-cols-2", "lg:grid-cols-2", "xl:grid-cols-4"], ["nft-dual-card", "", 1, "md:col-span-2", 3, "nft"], ["nft-single-card", "", 3, "nft"], ["nft-chart-card", "", 1, "md:col-span-2", "xl:col-span-1"], ["nft-auctions-table", "", 1, "md:col-span-2", "xl:col-span-3"]], template: function NftComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div");
        \u0275\u0275element(1, "app-nft-header");
        \u0275\u0275elementStart(2, "div", 0);
        \u0275\u0275element(3, "div", 1)(4, "div", 2)(5, "div", 2)(6, "div", 3)(7, "div", 4);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("nft", ctx.nft[0]);
        \u0275\u0275advance();
        \u0275\u0275property("nft", ctx.nft[1]);
        \u0275\u0275advance();
        \u0275\u0275property("nft", ctx.nft[2]);
      }
    }, dependencies: [
      NftHeaderComponent,
      NftDualCardComponent,
      NftSingleCardComponent,
      NftChartCardComponent,
      NftAuctionsTableComponent
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NftComponent, { className: "NftComponent", filePath: "src/app/modules/dashboard/pages/nft/nft.component.ts", lineNumber: 20 });
})();

// src/app/modules/dashboard/dashboard-routing.module.ts
var routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "nfts", pathMatch: "full" },
      { path: "nfts", component: NftComponent },
      { path: "**", redirectTo: "errors/404" }
    ]
  }
];
var DashboardRoutingModule = class _DashboardRoutingModule {
  static {
    this.\u0275fac = function DashboardRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DashboardRoutingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _DashboardRoutingModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forChild(routes), RouterModule] });
  }
};

// src/app/modules/dashboard/dashboard.module.ts
var DashboardModule = class _DashboardModule {
  static {
    this.\u0275fac = function DashboardModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DashboardModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _DashboardModule });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [DashboardRoutingModule] });
  }
};
export {
  DashboardModule
};
//# sourceMappingURL=dashboard.module-BJK3P5G5.js.map
