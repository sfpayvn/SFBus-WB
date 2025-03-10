import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Bus2Create, Bus2Update } from '../model/bus.model';
import { FilesService } from '../../files-center/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  url = '/buses';

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

  searchBus(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createBus(busServiceIconFile: FileList, busService2Create: Bus2Create) {
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

  updateBus(busService2Update: Bus2Update) {
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

  deleteBus(id: string) {
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
