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
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  searchBusService(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  processCreateBusService(busServiceIconFile: FileList, busService2Create: BusService2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (busServiceIconFile.length > 0) {
      return this.filesService.uploadFiles(busServiceIconFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          busService2Create.icon = res[0].link;
          return this.createBusService(busService2Create);
        })
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createBusService(busService2Create);
    }
  }

  createBusService(busService2Create: BusService2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, busService2Create).pipe(
      tap((res: any) => {
      }),

    );
  }

  processUpdateBusService(busServiceIconFile: FileList, busService2Update: BusService2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (busServiceIconFile.length > 0) {
      return this.filesService.uploadFiles(busServiceIconFile).pipe(
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

    );
  }

  deleteBusService(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
