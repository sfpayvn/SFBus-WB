import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { FilesService } from '../../files-center-management/service/files-center.servive';
import { Tenant2Create, Tenant2Update } from '../model/tenant.model';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  url = '/admin/tenant';

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

  searchTenant(searchParams: {
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

  processCreateTenant(imageFile: FileList, Tenant2Create: Tenant2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          Tenant2Create.logo = res[0].link;
          return this.createTenant(Tenant2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createTenant(Tenant2Create);
    }
  }

  createTenant(Tenant2Create: Tenant2Create) {
    const url = `${this.url}`;
    return this.apiGatewayService.post(url, Tenant2Create).pipe(tap((res: any) => {}));
  }

  processUpdateTenant(imageFile: FileList, Tenant2Update: Tenant2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          Tenant2Update.logo = res[0].link;
          return this.updateTenant(Tenant2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateTenant(Tenant2Update);
    }
  }

  updateTenant(Tenant2Update: Tenant2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, Tenant2Update).pipe(tap((res: any) => {}));
  }

  deleteTenant(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
