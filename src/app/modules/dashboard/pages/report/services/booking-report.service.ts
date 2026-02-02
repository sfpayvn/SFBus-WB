import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiGatewayService } from "src/app/api-gateway/api-gateaway.service";
import { BookingDetailQueryDto, BookingReportResponse } from "../models/booking-report.model";

@Injectable({
  providedIn: "root",
})
export class BookingReportService {
  private readonly reportUrl = "/pos/report";

  constructor(private apiGatewayService: ApiGatewayService) {}

  /**
   * Lấy booking details theo khoảng thời gian
   */
  getBookingDetailsByDate(query: BookingDetailQueryDto): Observable<BookingReportResponse> {
    const url = `${this.reportUrl}/booking/details`;
    return this.apiGatewayService.post(url, query);
  }
}
