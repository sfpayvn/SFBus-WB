import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusStation2Create, BusStation2Update } from '../model/bus-station.model';
import { FilesService } from '../../files-center/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class BusStationsService {
  url = '/bus-station';

  constructor(
    private apiGatewayService: ApiGatewayService,
  ) { }



  findAll() {
    const url = `${this.url}/findAll`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  searchBusStation(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createBusStation(busServiceIconFile: FileList, busService2Create: BusStation2Create) {
    const url = this.url;

    return this.apiGatewayService.post(url, busService2Create).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  updateBusStation(busStation2Update: BusStation2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, busStation2Update).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  updateBusStations(busStations2Update: BusStation2Update[]) {
    console.log("🚀 ~ BusStationsService ~ updateBusStationFollowProvinceId ~ busStations2Update:", busStations2Update)

    const url = `${this.url}/updates`;
    return this.apiGatewayService.put(url, busStations2Update).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  deleteBusStation(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }
}
