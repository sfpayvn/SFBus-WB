import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusProvince2Create, BusProvince2Update } from '../model/bus-province.model';
import { FilesService } from '../../files-center/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class BusProvincesService {
  url = '/bus-province';

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

  searchBusProvince(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createBusProvince(busServiceIconFile: FileList, busService2Create: BusProvince2Create) {
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

  updateBusProvince(busService2Update: BusProvince2Update) {
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

  deleteBusProvince(id: string) {
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
