import { Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { User, User2Create, User2Update } from '../model/user.model';
import { FilesService } from '../../files-center-management/service/files-center.servive';
import { FUNCTION_KEYS, MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  private getUrl(userRole: string): string {
    const urlMap: Record<string, string> = {
      client: '/admin/users/client',
      pos: '/admin/users/pos',
      tenant: '/admin/users/tenant',
      'tenant-operator': '/admin/users/tenant-operator',
      driver: '/admin/users/driver',
    };
    return urlMap[userRole];
  }

  private getModuleKey(userRole: string): string {
    const moduleKeyMap: Record<string, string> = {
      client: MODULE_KEYS.USER_CLIENT,
      pos: MODULE_KEYS.USER_POS,
      tenant: MODULE_KEYS.USER_TENANT,
      'tenant-operator': MODULE_KEYS.USER_TENANT_OPERATOR,
      driver: MODULE_KEYS.USER_DRIVER,
    };
    return moduleKeyMap[userRole];
  }

  private getCreateFunctionKey(userRole: string): string {
    const functionKeyMap: Record<string, string> = {
      client: FUNCTION_KEYS.USER_CLIENT.CREATE,
      pos: FUNCTION_KEYS.USER_POS.CREATE,
      tenant: FUNCTION_KEYS.USER_TENANT.CREATE,
      'tenant-operator': FUNCTION_KEYS.USER_TENANT_OPERATOR.CREATE,
      driver: FUNCTION_KEYS.USER_DRIVER.CREATE,
    };
    return functionKeyMap[userRole];
  }

  findAll(userRole: string) {
    const url = `${this.getUrl(userRole)}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findAllByRole(userRole: string, role: string) {
    const url = `${this.getUrl(userRole)}/find-all/${role}`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findOne(userRole: string, _id: string, skipLoading?: boolean) {
    const url = `${this.getUrl(userRole)}/${_id}`;
    return this.apiGatewayService.get(url, skipLoading).pipe(tap((res: any) => {}));
  }

  searchUser(
    userRole: string,
    searchParams: {
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
    },
  ) {
    const url = `${this.getUrl(userRole)}/search`;
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

  processCreateUser(userRole: string, avatarFile: FileList, user2Create: User2Create) {
    if (avatarFile.length > 0) {
      return this.filesService.uploadFiles(avatarFile).pipe(
        switchMap((res: any) => {
          user2Create.avatarId = res[0]._id;
          return this.createUser(userRole, user2Create);
        }),
      );
    } else {
      return this.createUser(userRole, user2Create);
    }
  }

  createUser(userRole: string, user2Create: User2Create) {
    const url = `${this.getUrl(userRole)}/register`;
    const options = { feature: { module: this.getModuleKey(userRole), function: this.getCreateFunctionKey(userRole) } };
    return this.apiGatewayService.post(url, user2Create, options).pipe(tap((res: any) => {}));
  }

  processUpdateUser(userRole: string, avatarFile: FileList, user2Update: User2Update) {
    if (avatarFile.length > 0) {
      return this.filesService.uploadFiles(avatarFile).pipe(
        switchMap((res: any) => {
          user2Update.avatarId = res[0]._id;
          return this.updateUser(userRole, user2Update);
        }),
      );
    } else {
      return this.updateUser(userRole, user2Update);
    }
  }

  updateUser(userRole: string, user2Update: User2Update) {
    const url = `${this.getUrl(userRole)}/profile`;
    return this.apiGatewayService.put(url, user2Update).pipe(tap((res: any) => {}));
  }

  deleteUser(userRole: string, id: string) {
    const url = `${this.getUrl(userRole)}/${id}`;
    const options = { feature: { module: this.getModuleKey(userRole), function: this.getCreateFunctionKey(userRole) } };
    return this.apiGatewayService.delete(url, options).pipe(tap((res: any) => {}));
  }

  setPassword(userRole: string, userId: string, newPassword: string) {
    const url = `${this.getUrl(userRole)}/set-password-temp/${userId}`;
    const body = {
      newPassword,
    };
    return this.apiGatewayService.put(url, body).pipe(tap((res: any) => {}));
  }
}
