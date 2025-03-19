import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { User, User2Create, User2Update } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url = '/users';

  constructor(private apiGatewayService: ApiGatewayService) { }

  findAll() {
    const url = `${this.url}/find-all`;
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

  searchUser(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "") {
    const url = `${this.url}/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => { }),

    );
  }

  createUser(user2Create: User2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, user2Create).pipe(
      tap((res: any) => {
      }),

    );
  }

  updateUser(user2Update: User2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, user2Update).pipe(
      tap((res: any) => {
      }),

    );
  }

  deleteUser(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
      tap((res: any) => {
      }),

    );
  }
}
