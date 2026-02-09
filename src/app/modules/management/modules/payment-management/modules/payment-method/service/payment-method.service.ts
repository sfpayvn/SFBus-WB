import { Injectable } from '@angular/core';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { PaymentMethod2Create, PaymentMethod2Update } from '../model/payment-method.model';
import { FilesService } from '@rsApp/modules/management/modules/files-center-management/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  url = '/admin/payment-method';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  findPaymentMethods() {
    return this.apiGatewayService.get(this.url).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        //write log
        return of([]);
      }),
    );
  }

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

  searchPaymentMethod(searchParams: {
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

  processCreatePaymentMethod(imageFile: FileList, PaymentMethod2Create: PaymentMethod2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          PaymentMethod2Create.image = res[0].link;
          return this.createPaymentMethod(PaymentMethod2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createPaymentMethod(PaymentMethod2Create);
    }
  }

  createPaymentMethod(PaymentMethod2Create: PaymentMethod2Create) {
    const url = `${this.url}`;

    const options = { feature: { module: 'paymentMethod', function: 'create' } };

    return this.apiGatewayService.post(url, PaymentMethod2Create, options).pipe(tap((res: any) => {}));
  }

  processUpdatePaymentMethod(imageFile: FileList, PaymentMethod2Update: PaymentMethod2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          PaymentMethod2Update.image = res[0].link;
          return this.updatePaymentMethod(PaymentMethod2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updatePaymentMethod(PaymentMethod2Update);
    }
  }

  updatePaymentMethod(PaymentMethod2Update: PaymentMethod2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, PaymentMethod2Update).pipe(tap((res: any) => {}));
  }

  deletePaymentMethod(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }
}
