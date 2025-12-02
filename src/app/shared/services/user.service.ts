import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ApiGatewayService } from '@rsApp/api-gateway/api-gateaway.service';

export interface User {
  id: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/admin/users';

  constructor(private apiGatewayService: ApiGatewayService) {}

  updateUserField(fieldName: string, value: any): Observable<boolean> {
    const body = {
      fieldName,
      value,
    };

    const url = `${this.apiUrl}/update-user-field`;
    return this.apiGatewayService.post(url, body).pipe(
      tap((res: any) => {}),
      map((res: any) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }
}
