import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusTemplate2Create, BusTemplate2Update } from '../model/bus-template.model';

@Injectable({
  providedIn: 'root',
})
export class BusTemplatesService {
  url = '/admin/bus-templates';

  constructor(
    private apiGatewayService: ApiGatewayService,
  ) { }


  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),

    );
  }

  searchBusTemplate(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search`;
    return this.apiGatewayService.post(url, { pageIdx, pageSize, keyword, sortBy }, true).pipe(
      tap((res: any) => { }),
    );
  }

  createBusTemplate(busTemplate2Create: BusTemplate2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busTemplate2Create).pipe(
      tap((res: any) => { }),
    );
  }

  updateBusTemplate(busTemplate2Update: BusTemplate2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busTemplate2Update).pipe(
      tap((res: any) => { }),
    );
  }

  deleteBusTemplate(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => { }),
    );
  }
}
