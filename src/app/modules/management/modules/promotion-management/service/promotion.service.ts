import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { FilesService } from '../../files-center-management/service/files-center.servive';
import { Promotion2Create, Promotion2Update } from '../model/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  url = '/admin/promotion';

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

  searchPromotion(searchParams: {
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

    return this.apiGatewayService.post(url, body, true).pipe(tap((res: any) => {}));
  }

  processCreatePromotion(imageFile: FileList, Promotion2Create: Promotion2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          Promotion2Create.image = res[0].link;
          return this.createPromotion(Promotion2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createPromotion(Promotion2Create);
    }
  }

  createPromotion(Promotion2Create: Promotion2Create) {
    const url = `${this.url}`;
    return this.apiGatewayService.post(url, Promotion2Create).pipe(tap((res: any) => {}));
  }

  processUpdatePromotion(imageFile: FileList, Promotion2Update: Promotion2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          Promotion2Update.image = res[0].link;
          return this.updatePromotion(Promotion2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updatePromotion(Promotion2Update);
    }
  }

  updatePromotion(Promotion2Update: Promotion2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, Promotion2Update).pipe(tap((res: any) => {}));
  }

  deletePromotion(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
