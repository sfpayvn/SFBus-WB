import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusService2Create, BusService2Update } from '../model/bus-service.model';
import { FilesService } from '../../files-center/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class BusServicesService {
  url = '/bus-service';

  constructor(
    private apiGatewayService: ApiGatewayService,
    private filesService: FilesService
  ) { }

  searchBusService(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createBusService(busServiceIconFile: FileList, busService2Create: BusService2Create) {
    const url = this.url;

    return this.filesService.uploadFiles(busServiceIconFile).pipe(
      switchMap((res: any) => {
        console.log("🚀 ~ BusServicesService ~ switchMap ~ res:", res)
        busService2Create.icon = res.ids[0];
        console.log("🚀 ~ BusServicesService ~ switchMap ~ busService2Create:", busService2Create)
        return this.apiGatewayService.post(url, busService2Create).pipe(
          tap((res: any) => {
          }),
          catchError((error) => {
            //write log
            return of([]);
          }),
        );
      })
    )
  }

  updateBusService(busService2Update: BusService2Update) {
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

  deleteBusService(id: string) {
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
