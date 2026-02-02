import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ENV } from "src/environments/environment.development";
import { StatsRequest, BookingStatsResponse, ChartStatsResponse, ChartStatsRequest, TopRoutesQuery, TopRoutesResponse } from "../models/report.model";
import { ApiGatewayService } from "@rsApp/api-gateway/api-gateaway.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private url = "/admin/report";

  constructor(private api: ApiGatewayService) {}

  getBookingStats(request: StatsRequest, skipLoading: boolean = false): Observable<BookingStatsResponse> {
    const url = `${this.url}/booking-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getRevenueBookingStats(request: StatsRequest, skipLoading: boolean = false): Observable<BookingStatsResponse> {
    const url = `${this.url}/revenue-booking-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getScheduleStats(request: StatsRequest, skipLoading: boolean = false): Observable<BookingStatsResponse> {
    const url = `${this.url}/schedule-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getGoodsStats(request: StatsRequest, skipLoading: boolean = false): Observable<BookingStatsResponse> {
    const url = `${this.url}/goods-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getGoodsChartStats(request: ChartStatsRequest, skipLoading: boolean = true): Observable<ChartStatsResponse> {
    const url = `${this.url}/goods-chart-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getBookingChartStats(request: ChartStatsRequest, skipLoading: boolean = true): Observable<ChartStatsResponse> {
    const url = `${this.url}/booking-chart-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getRevenueBookingChartStats(request: ChartStatsRequest, skipLoading: boolean = true): Observable<ChartStatsResponse> {
    const url = `${this.url}/revenue-booking-chart-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getScheduleChartStats(request: ChartStatsRequest, skipLoading: boolean = true): Observable<ChartStatsResponse> {
    const url = `${this.url}/schedule-chart-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getTopRoutesReport(request: TopRoutesQuery, skipLoading: boolean = true): Observable<TopRoutesResponse> {
    const url = `${this.url}/top-routes`;
    return this.api.post(url, request, { skipLoading });
  }

  getRevenueGoodsChartStats(request: ChartStatsRequest, skipLoading: boolean = true): Observable<ChartStatsResponse> {
    const url = `${this.url}/revenue-goods-chart-stats`;
    return this.api.post(url, request, { skipLoading });
  }

  getPaymentMethodStats(request: StatsRequest, skipLoading: boolean = true): Observable<any> {
    const url = `${this.url}/payment-method-stats`;
    return this.api.post(url, request, { skipLoading });
  }
}
