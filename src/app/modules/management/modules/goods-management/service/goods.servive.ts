import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Goods, Goods2Create, Goods2Update } from '../model/goods.model';
import { FilesService } from '../../files-center-management/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class GoodsService {
  url = '/admin/goods';

  constructor(
    private apiGatewayService: ApiGatewayService,
    private filesService: FilesService
  ) { }

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),

    );
  }

  findAllByRole(role: string) {
    const url = `${this.url}/find-all/${role}`;
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

  searchGoods(searchParams: {
    pageIdx: number;
    startDate: Date | '';
    endDate: Date | '';
    pageSize: number;
    keyword: string;
    sortBy: {
      key: string,
      value: string
    },
    filters: {
      key: string,
      value: string[]
    },
  }) {
    const url = `${this.url}/search-paging`;
    const body = {
      pageIdx: searchParams.pageIdx,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      pageSize: searchParams.pageSize,
      keyword: searchParams.keyword,
      sortBy: searchParams.sortBy,
      filters: searchParams.filters
    };

    return this.apiGatewayService.post(url, body, true).pipe(
      tap((res: any) => { })
    );
  }

  processCreateGoods(imageFile: FileList, Goods2Create: Goods2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          Goods2Create.image = res[0].link;
          return this.createGoods(Goods2Create);
        })
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createGoods(Goods2Create);
    }
  }

  createGoods(Goods2Create: Goods2Create) {
    const url = `${this.url}`;
    return this.apiGatewayService.post(url, Goods2Create).pipe(
      tap((res: any) => {
      }),

    );
  }

  processUpdateGoods(imageFile: FileList, Goods2Update: Goods2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          Goods2Update.image = res[0].link;
          return this.updateGoods(Goods2Update);
        })
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateGoods(Goods2Update);
    }
  }

  updateGoods(Goods2Update: Goods2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, Goods2Update).pipe(
      tap((res: any) => {
      }),

    );
  }

  deleteGoods(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
