import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusStation2Create, BusStation2Update } from '../model/bus-station.model';
import { FilesService } from '@rsApp/modules/management/modules/files-center-management/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class BusStationsService {
  url = '/admin/bus-station';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  findAll(skipLoadding?: boolean) {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url, null, { skipLoading: skipLoadding }).pipe(tap((res: any) => {}));
  }

  findAllAvailable(skipLoadding?: boolean) {
    const url = `${this.url}/find-all-available`;
    return this.apiGatewayService.get(url, null, { skipLoading: skipLoadding }).pipe(tap((res: any) => {}));
  }

  searchBusStation(
    searchParams = {
      pageIdx: 1,
      pageSize: 5,
      keyword: '',
      sortBy: {
        key: 'createdAt',
        value: 'descend',
      },
      filters: [] as any[],
    },
  ) {
    const url = `${this.url}/search`;
    return this.apiGatewayService.post(url, searchParams, { skipLoading: true }).pipe(tap((res: any) => {}));
  }

  processCreateBusStation(busStationImageFile: FileList, busStation2Create: BusStation2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (busStationImageFile.length > 0) {
      return this.filesService.uploadFiles(busStationImageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          busStation2Create.imageId = res[0]._id;
          return this.createBusStation(busStation2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createBusStation(busStation2Create);
    }
  }

  createBusStation(busStation2Create: BusStation2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busStation2Create).pipe(tap((res: any) => {}));
  }

  processUpdateBusStation(busStationImageFile: FileList, busStation2Update: BusStation2Update) {
    // Kiểm tra nếu có file trong FileList
    if (busStationImageFile.length > 0) {
      return this.filesService.uploadFiles(busStationImageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          busStation2Update.imageId = res[0]._id;
          return this.updateBusStation(busStation2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateBusStation(busStation2Update);
    }
  }

  updateBusStation(busStation2Update: BusStation2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busStation2Update).pipe(tap((res: any) => {}));
  }

  updateBusStations(busStations2Update: BusStation2Update[]) {
    const url = `${this.url}/updates`;
    return this.apiGatewayService.put(url, busStations2Update).pipe(tap((res: any) => {}));
  }

  deleteBusStation(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
