import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusProvince2Create, BusProvince2Update, CloneBusProvince } from '../model/bus-province.model';

@Injectable({
  providedIn: 'root',
})
export class BusProvincesService {
  url = '/admin/bus-province';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findAll(skipLoading?: boolean) {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url, null, { skipLoading }).pipe(tap((res: any) => {}));
  }

  findAllAvailable(skipLoading?: boolean) {
    const url = `${this.url}/find-all-available`;
    return this.apiGatewayService.get(url, null, { skipLoading }).pipe(tap((res: any) => {}));
  }

  searchBusProvince(
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

  createBusProvince(busService2Create: BusProvince2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, busService2Create).pipe(tap((res: any) => {}));
  }

  cloneBusProvince(cloneBusProvince: CloneBusProvince) {
    const url = `${this.url}/clone`;
    return this.apiGatewayService.post(url, cloneBusProvince).pipe(tap((res: any) => {}));
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
