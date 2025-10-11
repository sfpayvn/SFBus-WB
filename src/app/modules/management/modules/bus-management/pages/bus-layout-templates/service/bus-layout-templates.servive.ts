import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusLayoutTemplate2Create, BusLayoutTemplate2Update } from '../model/bus-layout-templates.model';

@Injectable({
  providedIn: 'root',
})
export class BusLayoutTemplatesService {
  url = '/admin/bus-layout-templates';

  constructor(private apiGatewayService: ApiGatewayService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findOne(_id: string) {
    const url = `${this.url}/find-one/${_id}`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  searchBusLayoutTemplate(pageIdx: number = 0, pageSize: number = 999, keyword: string = '', sortBy: string = '') {
    const body = {
      pageIdx,
      pageSize,
      keyword,
      sortBy,
    };

    const url = `${this.url}/search`;
    return this.apiGatewayService.post(url, body, { skipLoading: true }).pipe(tap((res: any) => {}));
  }

  createBusLayoutTemplate(busService2Create: BusLayoutTemplate2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, busService2Create).pipe(tap((res: any) => {}));
  }

  updateBusLayoutTemplate(busService2Update: BusLayoutTemplate2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busService2Update).pipe(tap((res: any) => {}));
  }

  deleteBusLayoutTemplate(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
