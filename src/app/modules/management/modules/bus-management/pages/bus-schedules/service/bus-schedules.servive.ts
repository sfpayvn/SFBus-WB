import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusSchedule2Create, BusSchedule2Update } from '../model/bus-schedule.model';
import { FUNCTION_KEYS, MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

@Injectable({
  providedIn: 'root',
})
export class BusSchedulesService {
  url = '/admin/bus-schedules';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findOne(busScheduleId: string) {
    const url = `${this.url}/${busScheduleId}`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

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
    viewDisplayMode: string = 'table',
  ) {
    const url = `${this.url}/search`;

    if (viewDisplayMode === 'table') {
      for (const filter of searchParams.filters) {
        if (filter.key === 'startDate' || filter.key === 'endDate') {
          filter.value = '';
        }
      }
    }

    return this.apiGatewayService
      .post(url, { ...searchParams, viewDisplayMode }, { skipLoading: true })
      .pipe(tap((res: any) => {}));
  }

  createBusSchedule(busSchedule2Create: BusSchedule2Create) {
    const url = this.url;
    const options = { feature: { module: MODULE_KEYS.BUS_SCHEDULE, function: FUNCTION_KEYS.BUS_SCHEDULE.CREATE } };
    return this.apiGatewayService.post(url, busSchedule2Create, options).pipe(tap((res: any) => {}));
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
