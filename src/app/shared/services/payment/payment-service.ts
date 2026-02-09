import { Injectable } from '@angular/core';
import { ApiGatewayService } from '@rsApp/api-gateway/api-gateaway.service';
import { RequestPaymentDto } from '@rsApp/shared/models/payment.model';
import { catchError, map, of, skip, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  url = '/admin/payment';

  findAll(skipLoading: boolean = false) {
    const url = `${this.url}/find-all`;

    return this.apiGatewayService.get(url, {}, { skipLoading: skipLoading }).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  findAllByReferrentId(referrentId: string, skipLoading: boolean = false) {
    const url = `${this.url}/find-by-referrent-id/${referrentId}`;
    return this.apiGatewayService.get(url, {}, { skipLoading: skipLoading }).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  paymentBooking(requestPaymentDto: RequestPaymentDto) {
    const url = `${this.url}/processBookingPayment`;
    return this.apiGatewayService.post(url, requestPaymentDto).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
    );
  }

  paymentGoods(requestPaymentDto: RequestPaymentDto) {
    const url = `${this.url}/processGoodsPayment`;
    return this.apiGatewayService.post(url, requestPaymentDto).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
    );
  }
}
