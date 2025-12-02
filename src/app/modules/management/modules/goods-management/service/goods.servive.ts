import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Goods, Goods2Create, Goods2Update } from '../model/goods.model';
import { FilesService } from '../../files-center-management/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class GoodsService {
  url = '/admin/goods';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findAllByRole(role: string) {
    const url = `${this.url}/find-all/${role}`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }
  findOne(_id: string, skipLoading?: boolean) {
    const url = `${this.url}/${_id}`;
    return this.apiGatewayService.get(url, skipLoading).pipe(tap((res: any) => {}));
  }

  searchGoods(searchParams: {
    pageIdx: number;
    startDate: Date | '';
    endDate: Date | '';
    pageSize: number;
    keyword: string;
    sortBy: {
      key: string;
      value: string;
    };
    filters: {
      key: string;
      value: string[];
    };
  }) {
    const url = `${this.url}/search`;
    const body = {
      pageIdx: searchParams.pageIdx,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      pageSize: searchParams.pageSize,
      keyword: searchParams.keyword,
      sortBy: searchParams.sortBy,
      filters: searchParams.filters,
    };

    return this.apiGatewayService.post(url, body, { skipLoading: true }).pipe(tap((res: any) => {}));
  }

  processCreateGoods(imageFile: FileList, goods2Create: Goods2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any[]) => {
          // Gắn các liên kết trả về từ uploadFiles
          goods2Create.imageIds = res.map((file) => file._id);
          return this.createGoods(goods2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createGoods(goods2Create);
    }
  }

  createGoods(goods2Create: Goods2Create) {
    const url = `${this.url}`;
    return this.apiGatewayService.post(url, goods2Create).pipe(tap((res: any) => {}));
  }

  processUpdateGoods(imageFile: FileList, goods2Update: Goods2Update) {
    const url = this.url;
    
    // Nếu có file mới, upload và thêm vào imageIds hiện tại
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any[]) => {
          // Lấy imageIds từ files mới upload
          const newImageIds = res.map((file) => file._id);
          
          // Kết hợp imageIds hiện tại với imageIds mới
          goods2Update.imageIds = [
            ...(goods2Update.imageIds || []),
            ...newImageIds
          ];
          
          return this.updateGoods(goods2Update);
        }),
      );
    } else {
      // Không có file mới, chỉ update với imageIds hiện tại
      return this.updateGoods(goods2Update);
    }
  }

  updateGoods(goods2Update: Goods2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, goods2Update).pipe(tap((res: any) => {}));
  }

  deleteGoods(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
