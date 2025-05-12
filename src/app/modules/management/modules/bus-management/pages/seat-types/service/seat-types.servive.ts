import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { SeatType2Create, SeatType2Update } from '../model/seat-type.model';
import { FilesService } from 'src/app/modules/management/pages/files-center/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class SeatTypesService {
  url = '/seat-types';

  constructor(
    private apiGatewayService: ApiGatewayService,
    private filesService: FilesService
  ) { }

  findAll() {
    const url = `${this.url}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),

    );
  }

  searchSeatType(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  createSeatType(seatTypeIconFile: FileList, seatType2Create: SeatType2Create) {
    const url = this.url;

    return this.filesService.uploadFiles(seatTypeIconFile).pipe(
      switchMap((res: any) => {
        seatType2Create.iconId = res[0]._id;
        return this.apiGatewayService.post(url, seatType2Create).pipe(
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

  processUpdateSeatType(seatTypeIconFile: FileList, seatType2Update: SeatType2Update) {
    // Kiểm tra nếu có file trong FileList
    if (seatTypeIconFile.length > 0) {
      return this.filesService.uploadFiles(seatTypeIconFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          seatType2Update.iconId = res[0]._id;
          return this.updateSeatType(seatType2Update);
        })
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateSeatType(seatType2Update);
    }
  }

  updateSeatType(seatType2Update: SeatType2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    return this.apiGatewayService.put(url, seatType2Update).pipe(
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

  deleteSeatType(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
