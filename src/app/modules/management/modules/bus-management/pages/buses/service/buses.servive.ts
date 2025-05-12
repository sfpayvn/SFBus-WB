import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Bus2Create, Bus2Update } from '../model/bus.model';

@Injectable({
  providedIn: 'root',
})
export class BusesService {
  url = '/buses';

  constructor(
    private apiGatewayService: ApiGatewayService,
  ) { }


  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),

    );
  }

  searchBus(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  createBus(bus2Create: Bus2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, bus2Create).pipe(
      tap((res: any) => {
      }),

    );
  }

  updateBus(bus2Update: Bus2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, bus2Update).pipe(
      tap((res: any) => {
      }),

    );
  }

  deleteBus(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
