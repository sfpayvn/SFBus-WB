import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusScheduleAutoGenerator2Create, BusScheduleAutoGenerator2Update } from '../model/bus-schedule-autogenerator.model';

@Injectable({
  providedIn: 'root',
})
export class BusScheduleAutoGeneratorsService {
  url = '/bus-schedule-autogenerators';

  constructor(
    private apiGatewayService: ApiGatewayService,
  ) { }


  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),

    );
  }

  searchBusScheduleAutoGenerator(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  createBusScheduleAutoGenerator(busScheduleAutoGenerator2Create: BusScheduleAutoGenerator2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busScheduleAutoGenerator2Create).pipe(
      tap((res: any) => {
      }),

    );
  }

  updateBusScheduleAutoGenerator(busScheduleAutoGenerator2Update: BusScheduleAutoGenerator2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busScheduleAutoGenerator2Update).pipe(
      tap((res: any) => {
      }),

    );
  }

  deleteBusScheduleAutoGenerator(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
