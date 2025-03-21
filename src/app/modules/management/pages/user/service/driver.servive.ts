import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Driver, Driver2Create, Driver2Update } from '../model/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  url = '/drivers';

  constructor(private apiGatewayService: ApiGatewayService) { }

  findAllUserDriver() {
    const url = `${this.url}/find-all-user-driver`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),

    );
  }

  findOne(_id: string, skipLoading?: boolean) {
    const url = `${this.url}/${_id}`;
    return this.apiGatewayService.get(url, skipLoading).pipe(
      tap((res: any) => { }),

    );
  }

  findOneByUser(userId: string, skipLoading?: boolean) {
    const url = `${this.url}/find-one-by-user/${userId}`;
    return this.apiGatewayService.get(url, skipLoading).pipe(
      tap((res: any) => { }),

    );
  }

  searchDriver(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  createDriver(user2Create: Driver2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, user2Create).pipe(
      tap((res: any) => {
      }),

    );
  }

  updateDriver(user2Update: Driver2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, user2Update).pipe(
      tap((res: any) => {
      }),

    );
  }

  deleteDriver(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
