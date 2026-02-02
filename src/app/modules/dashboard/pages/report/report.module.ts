import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportComponent } from './pages/report/report.component';
import { ReportHeaderComponent } from './components/report-header/report-header.component';
import { BookingStatsCardComponent } from './components/booking-stats-card/booking-stats-card.component';
import { RevenueBookingStatsCardComponent } from './components/revenue-booking-stats-card/revenue-booking-stats-card.component';
import { ScheduleStatsCardComponent } from './components/schedule-stats-card/schedule-stats-card.component';
import { RevenueGoodsStatsCardComponent } from './components/revenue-goods-stats-card/revenue-goods-stats-card.component';
import { RevenueBookingComponent } from './components/revenue-booking/revenue-booking.component';
import { ScheduleChartComponent } from './components/schedule-chart/schedule-chart.component';
import { RevenueGoodsChartComponent } from './components/revenue-goods-chart/revenue-goods-chart.component';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';
import { ReportRoutingModule } from './report-routing.module';
import { BookingRecentListComponent } from './components/booking-recent-list/booking-recent-list.component';
import { GoodsRecentListComponent } from './components/goods-recent-list/goods-recent-list.component';
import { CanvasChartComponent } from './components/canvas-chart/canvas-chart.component';
import { TopRouteStatsComponent } from './components/top-route-stats/top-route-stats.component';
import { CanvasPerformanceComponent } from './components/canvas-performance/canvas-performance.component';
import { BookingChartComponent } from './components/booking-chart/booking-chart.component';
import { PaymentMethodStatsComponent } from './components/payment-method-stats/payment-method-stats.component';
import { BookingReportComponent } from './pages/booking-report/booking-report.component';
import { GoodsChartComponent } from './components/goods-chart/goods-chart.component';
import { GoodsStatsCardComponent } from './components/goods-stats-card/goods-stats-card.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { GoodsReportComponent } from './pages/goods-report/goods-report.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    NZModule,
    BaseChartDirective,
    AngularSvgIconModule,
  ],
  declarations: [
    ReportComponent,
    BookingReportComponent,
    ReportHeaderComponent,
    BookingStatsCardComponent,
    RevenueBookingStatsCardComponent,
    ScheduleStatsCardComponent,
    RevenueGoodsStatsCardComponent,
    RevenueBookingComponent,
    BookingChartComponent,
    ScheduleChartComponent,
    RevenueGoodsChartComponent,
    BookingRecentListComponent,
    GoodsRecentListComponent,
    GoodsChartComponent,
    GoodsStatsCardComponent,
    CanvasChartComponent,
    TopRouteStatsComponent,
    CanvasPerformanceComponent,
    PaymentMethodStatsComponent,
    GoodsReportComponent,
  ],
  exports: [
    BookingStatsCardComponent,
    RevenueBookingStatsCardComponent,
    ScheduleStatsCardComponent,
    RevenueGoodsStatsCardComponent,
    BookingRecentListComponent,
    GoodsRecentListComponent,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class ReportModule {}
