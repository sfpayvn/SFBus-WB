import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusSchedule2Create, BusSchedule2Update } from '../model/bus-schedule.model';

@Injectable({
  providedIn: 'root',
})
export class BusSchedulesService {
  url = '/admin/bus-schedules';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findScheduleLayoutById(busScheduleId: string) {
    const url = `/admin/bus-schedule-layouts/find-one/${busScheduleId}`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  searchBusSchedule(
    searchParams = {
      pageIdx: 1,
      pageSize: 5,
      keyword: '',
      sortBy: {
        key: 'createdAt',
        value: 'descend',
      },
      filters: [] as any[],
    },
    viewDisplayMode: string,
  ) {
    const url = `${this.url}/search-paging`;

    if (viewDisplayMode === 'table') {
      for (const filter of searchParams.filters) {
        if (filter.key === 'startDate' || filter.key === 'endDate') {
          filter.value = '';
        }
      }
    }

    return this.apiGatewayService.post(url, { ...searchParams, viewDisplayMode }, true).pipe(tap((res: any) => {}));
  }

  createBusSchedule(busSchedule2Create: BusSchedule2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busSchedule2Create).pipe(tap((res: any) => {}));
  }

  updateBusSchedule(busSchedule2Update: BusSchedule2Update) {
    const url = `${this.url}/update`;
    return this.apiGatewayService.put(url, busSchedule2Update).pipe(tap((res: any) => {}));
  }

  deleteBusSchedule(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
