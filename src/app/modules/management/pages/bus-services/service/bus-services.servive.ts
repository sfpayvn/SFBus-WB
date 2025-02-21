import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusService, BusService2Create, BusService2Update } from '../model/bus-service.model';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Injectable({
  providedIn: 'root',
})
export class BusServicesService {
  url = '/bus-service';

  constructor(
    private apiGatewayService: ApiGatewayService,
    private fileUploadService: FileUploadService
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

  createBusService(busService2CreateIcon: Blob, busService2Create: BusService2Create) {
    const url = this.url;

    return this.fileUploadService.uploadFile(busService2CreateIcon, busService2Create.name + '.svg').pipe(
      switchMap((res: any) => {
        busService2Create.icon = res.ids.first();
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
