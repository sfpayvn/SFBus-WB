import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusLayoutTemplate2Create, BusLayoutTemplate2Update } from '../model/bus-layout-templates.model';

@Injectable({
  providedIn: 'root',
})
export class BusLayoutTemplatesService {
  url = '/bus-layout-templates';

  constructor(
    private apiGatewayService: ApiGatewayService,
  ) { }

  findAll() {
    const url = `${this.url}/findAll`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  searchBusLayoutTemplate(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createBusLayoutTemplate(busService2Create: BusLayoutTemplate2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, busService2Create).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  updateBusLayoutTemplate(busService2Update: BusLayoutTemplate2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busService2Update).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  deleteBusLayoutTemplate(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }
}
