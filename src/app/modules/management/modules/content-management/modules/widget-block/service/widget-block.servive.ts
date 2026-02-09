import { Injectable } from '@angular/core';
import { catchError, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { FilesService } from '@rsApp/modules/management/modules/files-center-management/service/files-center.servive';
import { WidgetBlock2Create, WidgetBlock2Update } from '../model/widget-block.model';

@Injectable({
  providedIn: 'root',
})
export class WidgetBlockService {
  url = '/admin/widget-blocks';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  searchWidgetBlock(
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

  processCreateWidgetBlock(widgetBlockImageFile: FileList, widgetBlock2Create: WidgetBlock2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (widgetBlockImageFile.length > 0) {
      return this.filesService.uploadFiles(widgetBlockImageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          widgetBlock2Create.imageId = res[0]._id;
          return this.createWidgetBlock(widgetBlock2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createWidgetBlock(widgetBlock2Create);
    }
  }

  createWidgetBlock(widgetBlock2Create: WidgetBlock2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, widgetBlock2Create).pipe(tap((res: any) => {}));
  }

  processUpdateWidgetBlock(widgetBlockImageFile: FileList, widgetBlock2Update: WidgetBlock2Update) {
    // Kiểm tra nếu có file trong FileList
    if (widgetBlockImageFile.length > 0) {
      return this.filesService.uploadFiles(widgetBlockImageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          widgetBlock2Update.imageId = res[0]._id;
          return this.updateWidgetBlock(widgetBlock2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateWidgetBlock(widgetBlock2Update);
    }
  }

  updateWidgetBlock(widgetBlock2Update: WidgetBlock2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    return this.apiGatewayService.put(url, widgetBlock2Update).pipe(tap((res: any) => {}));
  }

  deleteWidgetBlock(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
