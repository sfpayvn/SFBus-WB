import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { FilesService } from '../../files-center-management/service/files-center.servive';
import { Tenant2Create, Tenant2Update } from '../model/tenant.model';

@Injectable({
  providedIn: 'root',
})
export class TenantSubscriptionService {
  url = '/admin/tenant-subscription';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  searchTenantSubscription(searchParams: {
    pageIdx: number;
    startDate: Date | '';
    endDate: Date | '';
    pageSize: number;
    keyword: string;
    sortBy: {
      key: string;
      value: string;
    };
    filters: [{ key: string; value: string | string[] }];
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
}
