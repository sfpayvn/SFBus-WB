import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Booking2Create, Booking2Update } from '../model/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  url = '/admin/booking';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService
      .get(url, null, {
        feature: { module: 'booking-management', function: 'list-bookings' },
      })
      .pipe(tap((res: any) => {}));
  }

  findOne(_id: string, skipLoading?: boolean) {
    const url = `${this.url}/${_id}`;
    return this.apiGatewayService
      .get(url, null, {
        skipLoading,
        feature: { module: 'booking-management', function: 'view-booking' },
      })
      .pipe(tap((res: any) => {}));
  }

  searchBooking(searchParams: {
    pageIdx: number;
    startDate: Date | '';
    endDate: Date | '';
    pageSize: number;
    keyword: string;
    sortBy: {
      key: string;
      value: string;
    };
    filters: { key: string; value: string }[];
  }) {
    const url = `${this.url}/search`;
    const body = {
      pageIdx: searchParams.pageIdx,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      pageSize: searchParams.pageSize,
      keyword: searchParams.keyword,
      sortBy: searchParams.sortBy,
      filters: searchParams.filters,
    };
    return this.apiGatewayService
      .post(url, body, {
        feature: { module: 'booking-management', function: 'search-bookings' },
      })
      .pipe(tap((res: any) => {}));
  }

  create(payload: Booking2Create) {
    const url = `${this.url}/create`;
    return this.apiGatewayService
      .post(url, payload, {
        feature: { module: 'booking-management', function: 'create-booking' },
      })
      .pipe(tap((res: any) => {}));
  }

  update(payload: Booking2Update) {
    const url = `${this.url}/update`;
    return this.apiGatewayService
      .put(url, payload, {
        feature: { module: 'booking-management', function: 'update-booking' },
      })
      .pipe(tap((res: any) => {}));
  }

  deleteBooking(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }

  deleteMultiple(_ids: string[]) {
    const url = `${this.url}/delete-multiple`;
    return this.apiGatewayService
      .post(
        url,
        { _ids },
        {
          feature: { module: 'booking-management', function: 'delete-multiple-bookings' },
        },
      )
      .pipe(tap((res: any) => {}));
  }

  cancelBooking(_id: string) {
    const url = `${this.url}/cancel/${_id}`;
    return this.apiGatewayService
      .put(
        url,
        {},
        {
          feature: { module: 'booking-management', function: 'cancel-booking' },
        },
      )
      .pipe(tap((res: any) => {}));
  }

  confirmPayment(_id: string) {
    const url = `${this.url}/confirm-payment/${_id}`;
    return this.apiGatewayService
      .put(
        url,
        {},
        {
          feature: { module: 'booking-management', function: 'confirm-payment' },
        },
      )
      .pipe(tap((res: any) => {}));
  }
}
