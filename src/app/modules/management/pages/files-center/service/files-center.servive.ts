import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { File2Update, FileFolder2Create, FileFolder2Update } from '../model/file-center.model';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  url = '';

  constructor(private apiGatewayService: ApiGatewayService) { }

  searchFile(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "", filter: string = "", fileFolderId: string = "") {
    const url = `/file/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}&&filter=${filter}&fileFolderId=${fileFolderId}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }


  uploadFiles(filesList: FileList, folderId?: string): Observable<any> {
    const formData: FormData = new FormData();
    // Sử dụng Promise.all để chờ tất cả các file được thêm vào FormData
    const formDataPromise = Promise.all(Array.from(filesList).map(file => {
      return new Promise((resolve) => {
        formData.append('files', file);
        resolve(null);
      });
    })).then(() => formData);
    const url = `/file/upload-file/${folderId}`;

    // Chuyển đổi Promise thành Observable
    return from(formDataPromise).pipe(
      switchMap((formData: FormData) => {
        return this.apiGatewayService.post(url, formData);
      })
    );
  }


  updateFile(file2Update: File2Update) {
    const url = '/file';
    return this.apiGatewayService.put(url, file2Update).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  updateFiles2Folder(files2Update: File2Update[], folderId: string) {
    const url = `/file/update-files-folder/${folderId}`;
    return this.apiGatewayService.put(url, files2Update).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  deleteFile(id: string) {
    const url = `/file/${id}`;
    return this.apiGatewayService.delete(url).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  deleteFiles(ids: string[]) {
    const url = `/file/delete-files`;
    return this.apiGatewayService.post(url, ids).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }
  getFileFolder() {
    const url = `/file-folder`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  createFileFolder(fileFolder2Create: FileFolder2Create) {
    const url = `/file-folder`;
    return this.apiGatewayService.post(url, fileFolder2Create).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  updateFileFolder(fileFolder2Update: FileFolder2Update) {
    const url = `/file-folder`;
    return this.apiGatewayService.put(url, fileFolder2Update).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  deleteFileFolder(_id: string) {
    const url = `/file-folder/${_id}`;
    return this.apiGatewayService.delete(url).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }
}
