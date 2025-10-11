import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusType, BusType2Create, BusType2Update } from '../model/bus-type.model';

@Injectable({
  providedIn: 'root',
})
export class BusTypesService {
  url = '/admin/bus-type';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findOne(_id: string, skipLoading?: boolean) {
    const url = `${this.url}/${_id}`;
    return this.apiGatewayService.get(url, skipLoading).pipe(tap((res: any) => {}));
  }

  searchBusType(pageIdx: number = 0, pageSize: number = 999, keyword: string = '', sortBy: string = '') {
    const body = {
      pageIdx,
      pageSize,
      keyword,
      sortBy,
    };

    const url = `${this.url}/search`;
    return this.apiGatewayService.post(url, body, { skipLoading: true }).pipe(tap((res: any) => {}));
  }

  createBusType(busType2Create: BusType2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, busType2Create).pipe(tap((res: any) => {}));
  }

  updateBusType(busType2Update: BusType2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busType2Update).pipe(tap((res: any) => {}));
  }

  deleteBusType(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
