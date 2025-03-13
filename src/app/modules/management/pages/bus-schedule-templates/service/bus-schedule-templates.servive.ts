import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusScheduleTemplate2Create, BusScheduleTemplate2Update } from '../model/bus-schedule-template.model';

@Injectable({
  providedIn: 'root',
})
export class BusScheduleTemplatesService {
  url = '/bus-schedule_templates';

  constructor(
    private apiGatewayService: ApiGatewayService,
  ) { }


  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),

    );
  }

  searchBusScheduleTemplate(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  createBusScheduleTemplate(busSchedule2Create: BusScheduleTemplate2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busSchedule2Create).pipe(
      tap((res: any) => {
      }),
    );
  }

  updateBusScheduleTemplate(busSchedule2Update: BusScheduleTemplate2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busSchedule2Update).pipe(
      tap((res: any) => {
      }),

    );
  }

  deleteBusScheduleTemplate(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
