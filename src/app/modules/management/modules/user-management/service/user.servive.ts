import { Injectable } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { User, User2Create, User2Update } from '../model/user.model';
import { FilesService } from '../../files-center-management/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url = '/admin/users';

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

  searchUser(searchParams: {
    pageIdx: number;
    startDate: Date | '';
    endDate: Date | '';
    pageSize: number;
    keyword: string;
    sortBy: {
      key: string;
      value: string;
    };
    filters: { key: string; value: any }[];
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

  processCreateUser(avatarFile: FileList, user2Create: User2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (avatarFile.length > 0) {
      return this.filesService.uploadFiles(avatarFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          user2Create.avatarId = res[0]._id;
          return this.createUser(user2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createUser(user2Create);
    }
  }

  createUser(user2Create: User2Create) {
    const url = `${this.url}/register`;
    return this.apiGatewayService.post(url, user2Create).pipe(tap((res: any) => {}));
  }

  processUpdateUser(avatarFile: FileList, user2Update: User2Update) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (avatarFile.length > 0) {
      return this.filesService.uploadFiles(avatarFile).pipe(
        switchMap((res: any) => {
          // Gắn các liên kết trả về từ uploadFiles
          user2Update.avatarId = res[0]._id;
          return this.updateUser(user2Update);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.updateUser(user2Update);
    }
  }

  updateUser(user2Update: User2Update) {
    const url = `${this.url}/profile`;
    return this.apiGatewayService.put(url, user2Update).pipe(tap((res: any) => {}));
  }

  deleteUser(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }

  setPassword(userId: string, newPassword: string) {
    const url = `${this.url}/set-password-temp/${userId}`;
    const body = {
      newPassword,
    };
    return this.apiGatewayService.put(url, body).pipe(tap((res: any) => {}));
  }
}
