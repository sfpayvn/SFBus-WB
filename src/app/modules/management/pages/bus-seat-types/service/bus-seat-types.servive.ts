import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { BusSeatType2Create, BusSeatType2Update } from '../model/bus-seat-type.model';
import { FilesService } from '../../files-center/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class BusSeatTypesService {
  url = '/seat-types';

  constructor(
    private apiGatewayService: ApiGatewayService,
    private filesService: FilesService
  ) { }

  findAll() {
    const url = `${this.url}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  searchBusSeatType(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  createBusSeatType(busSeatTypeIconFile: FileList, busSeatType2Create: BusSeatType2Create) {
    const url = this.url;

    return this.filesService.uploadFiles(busSeatTypeIconFile).pipe(
      switchMap((res: any) => {
        busSeatType2Create.icon = res[0].link;
        if (!busSeatType2Create.isEnv) {
          busSeatType2Create.blockIcon = res[1].link;
          busSeatType2Create.selectedIcon = res[2].link;
        }
        return this.apiGatewayService.post(url, busSeatType2Create).pipe(
          tap((res: any) => {
          }),
          catchError((error) => {
            //write log
            return of([]);
          }),
        );
      })
    )
  }

  processUpdateBusSeatType(busSeatTypeIconFile: FileList, busSeatType2Update: BusSeatType2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (busSeatTypeIconFile.length > 0) {
      return this.filesService.uploadFiles(busSeatTypeIconFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          busSeatType2Update.icon = res[0].link;
          if (!busSeatType2Update.isEnv) {
            busSeatType2Update.blockIcon = res[1].link;
            busSeatType2Update.selectedIcon = res[2].link;
          }
          return this.updateBusSeatType(busSeatType2Update);
        })
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateBusSeatType(busSeatType2Update);
    }
  }

  updateBusSeatType(busSeatType2Update: BusSeatType2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    return this.apiGatewayService.put(url, busSeatType2Update).pipe(
      tap((res: any) => {
        // Xử lý response nếu cần
      }),
      catchError((error) => {
        // Ghi log lỗi
        console.error(error);
        return of([]);
      }),
    );
  }

  deleteBusSeatType(id: string) {
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
