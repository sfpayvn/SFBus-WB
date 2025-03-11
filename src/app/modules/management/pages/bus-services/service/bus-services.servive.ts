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
        busService2Create.icon = res[0].link;
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

  processUpdateBusService(BusServiceIconFile: FileList, busService2Update: BusService2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (BusServiceIconFile.length > 0) {
      return this.filesService.uploadFiles(BusServiceIconFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          busService2Update.icon = res[0].link;
          return this.updateBusService(busService2Update);
        })
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateBusService(busService2Update);
    }
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
