import { Injectable } from '@angular/core';
import { catchError, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { FilesService } from '@rsApp/modules/management/modules/files-center-management/service/files-center.servive';
import { ContentLayout2Create, ContentLayout2Update } from '../model/content-layout.model';

@Injectable({
  providedIn: 'root',
})
export class ContentLayoutService {
  url = '/admin/content-layouts';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  searchContentLayout(
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

  processCreateContentLayout(contentLayoutImageFile: FileList, contentLayout2Create: ContentLayout2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (contentLayoutImageFile.length > 0) {
      return this.filesService.uploadFiles(contentLayoutImageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          contentLayout2Create.imageId = res[0]._id;
          return this.createContentLayout(contentLayout2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createContentLayout(contentLayout2Create);
    }
  }

  createContentLayout(contentLayout2Create: ContentLayout2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, contentLayout2Create).pipe(tap((res: any) => {}));
  }

  processUpdateContentLayout(contentLayoutImageFile: FileList, contentLayout2Update: ContentLayout2Update) {
    // Kiểm tra nếu có file trong FileList
    if (contentLayoutImageFile.length > 0) {
      return this.filesService.uploadFiles(contentLayoutImageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          contentLayout2Update.imageId = res[0]._id;
          return this.updateContentLayout(contentLayout2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateContentLayout(contentLayout2Update);
    }
  }

  updateContentLayout(contentLayout2Update: ContentLayout2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    return this.apiGatewayService.put(url, contentLayout2Update).pipe(tap((res: any) => {}));
  }

  deleteContentLayout(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
