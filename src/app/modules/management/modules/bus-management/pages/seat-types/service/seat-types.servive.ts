import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { SeatType2Create, SeatType2Update } from '../model/seat-type.model';
import { FilesService } from '../../../../files-center-management/service/files-center.servive';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SeatTypesService {
  url = '/admin/seat-types';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  searchSeatType(
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

  processCreateBusService(seatTypeIconFile: FileList, seatType2Create: SeatType2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (seatTypeIconFile.length > 0) {
      return this.filesService.uploadFiles(seatTypeIconFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          seatType2Create.iconId = res[0]._id;
          return this.createSeatType(seatType2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createSeatType(seatType2Create);
    }
  }

  createSeatType(seatType2Create: SeatType2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, seatType2Create).pipe(
      tap((res: any) => {}),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

  processUpdateSeatType(seatTypeIconFile: FileList, seatType2Update: SeatType2Update) {
    // Kiểm tra nếu có file trong FileList
    if (seatTypeIconFile.length > 0) {
      return this.filesService.uploadFiles(seatTypeIconFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          seatType2Update.iconId = res[0]._id;
          return this.updateSeatType(seatType2Update);
        }),
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
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  deleteSeatType(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
