import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from '@rsApp/api-gateway/api-gateaway.service';
import { User, User2Update } from '@rsApp/modules/management/modules/user-management/model/user.model';
import { FilesService } from '@rsApp/modules/management/modules/files-center-management/service/files-center.servive';

@Injectable({
  providedIn: 'root',
})
export class AccountInformationService {
  url = '/admin/users';

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {}

  processUpdateUserProfile(avatarFile: FileList, user2Update: User2Update) {
    if (avatarFile.length > 0) {
      return this.filesService.uploadFiles(avatarFile).pipe(
        switchMap((res: any) => {
          user2Update.avatarId = res[0]._id;
          return this.updateUserProfile(user2Update);
        }),
      );
    } else {
      return this.updateUserProfile(user2Update);
    }
  }

  updateUserProfile(user2Update: User2Update) {
    const url = `${this.url}/profile`;
    return this.apiGatewayService.put(url, user2Update).pipe(tap((res: any) => {}));
  }
}
