import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusStation2Create, BusStation2Update } from '../model/bus-station.model';

@Injectable({
  providedIn: 'root',
})
export class BusStationsService {
  url = '/admin/bus-station';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findAll(skipLoadding?: boolean) {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url, skipLoadding).pipe(tap((res: any) => {}));
  }

  searchBusStation(pageIdx: number = 0, pageSize: number = 999, keyword: string = '', sortBy: string = '') {
    const body = {
      pageIdx,
      pageSize,
      keyword,
      sortBy,
    };

    const url = `${this.url}/search`;
    return this.apiGatewayService.post(url, body).pipe(tap((res: any) => {}));
  }

  createBusStation(busServiceIconFile: FileList, busService2Create: BusStation2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busService2Create).pipe(tap((res: any) => {}));
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
