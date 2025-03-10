import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusTemplate2Create, BusTemplate2Update } from '../model/bus-template.model';
import { FilesService } from '../../files-center/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class BusTemplatesService {
  url = '/bus-templates';

  constructor(
    private apiGatewayService: ApiGatewayService,
    private filesService: FilesService
  ) { }

  searchBusTemplate(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createBusTemplate(busServiceIconFile: FileList, busService2Create: BusTemplate2Create) {
    const url = this.url;

    return this.filesService.uploadFiles(busServiceIconFile).pipe(
      switchMap((res: any) => {
        console.log("🚀 ~ BusTemplatesService ~ switchMap ~ res:", res)
        busService2Create.icon = res.ids[0];
        console.log("🚀 ~ BusTemplatesService ~ switchMap ~ busService2Create:", busService2Create)
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

  updateBusTemplate(busService2Update: BusTemplate2Update) {
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

  deleteBusTemplate(id: string) {
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
