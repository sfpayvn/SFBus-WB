import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Options, Options2Create } from '../model/options.model';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  url = 'options';

  constructor(private apiGatewayService: ApiGatewayService) { }

  searchOptions(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createOption(option: Options2Create) {
    const updateOptionOptionUrl = this.url;
    return this.apiGatewayService.post(updateOptionOptionUrl, option).pipe(
      tap((res: any) => {
        console.log('🚀 ~ OptionsService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ OptionsService ~ getOptions ~ error:', error);
        return of([]);
      }),
    );
  }

  updateOption(option: Options) {
    const updateOptionOptionUrl = this.url;
    return this.apiGatewayService.put(updateOptionOptionUrl, option).pipe(
      tap((res: any) => {
        console.log('🚀 ~ OptionsService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ OptionsService ~ getOptions ~ error:', error);
        return of([]);
      }),
    );
  }

  deleteOption(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
        console.log('🚀 ~ OptionsService ~ tap ~ res:', res);
      }),
      catchError((error) => {
        //write log
        console.log('🚀 ~ OptionsService ~ getOptions ~ error:', error);
        return of([]);
      }),
    );
  }
}
