import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Goods, Goods2Create, Goods2Update } from '../model/goods.model';
import { FilesService } from '../../files-center-management/service/files-center.servive';
import { GoodsCategory2Create, GoodsCategory2Update } from '../model/goods-category.model';

@Injectable({
  providedIn: 'root',
})
export class GoodsCategoriesService {
  url = '/admin/goods-category';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findOne(_id: string, skipLoading?: boolean) {
    const url = `${this.url}/${_id}`;
    return this.apiGatewayService.get(url, skipLoading).pipe(tap((res: any) => {}));
  }

  searchGoodsCategories(searchParams: {
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

  processCreateGoodsCategories(imageFile: FileList, goodsCategory2Create: GoodsCategory2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          goodsCategory2Create.iconId = res[0]._Id;
          return this.createGoodsCategories(goodsCategory2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createGoodsCategories(goodsCategory2Create);
    }
  }

  createGoodsCategories(goodsCategory2Create: GoodsCategory2Create) {
    const url = `${this.url}`;
    return this.apiGatewayService.post(url, goodsCategory2Create).pipe(tap((res: any) => {}));
  }

  processUpdateGoodsCategories(imageFile: FileList, goodsCategory2Update: GoodsCategory2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          goodsCategory2Update.iconId = res[0]._id;
          return this.updateGoodsCategories(goodsCategory2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateGoodsCategories(goodsCategory2Update);
    }
  }

  updateGoodsCategories(goodsCategory2Update: GoodsCategory2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, goodsCategory2Update).pipe(tap((res: any) => {}));
  }

  deleteGoodsCategories(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
