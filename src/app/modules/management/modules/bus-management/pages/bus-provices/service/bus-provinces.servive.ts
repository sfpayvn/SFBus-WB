import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusProvince2Create, BusProvince2Update } from '../model/bus-province.model';

@Injectable({
  providedIn: 'root',
})
export class BusProvincesService {
  url = '/admin/bus-province';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  searchBusProvince(pageIdx: number = 0, pageSize: number = 999, keyword: string = '', sortBy: string = '') {
    const body = {
      pageIdx,
      pageSize,
      keyword,
      sortBy,
    };

    const url = `${this.url}/search`;
    return this.apiGatewayService.post(url, body).pipe(tap((res: any) => {}));
  }

  createBusProvince(busService2Create: BusProvince2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busService2Create).pipe(tap((res: any) => {}));
  }

  updateBusProvince(busService2Update: BusProvince2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busService2Update).pipe(tap((res: any) => {}));
  }

  deleteBusProvince(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
