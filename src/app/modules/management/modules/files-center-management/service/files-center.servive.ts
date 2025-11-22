import { Injectable } from '@angular/core';
import { catchError, filter, from, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { File2Update, FileFolder2Create, FileFolder2Update } from '../model/file-center.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  url = '/admin/file';

  constructor(private apiGatewayService: ApiGatewayService) {}

  searchFile(
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
    fileFolderId: string = '',
    skipLoading: boolean = false,
  ) {
    const url = `${this.url}/search`;

    const body = {
      ...searchParams,
      fileFolderId,
    };

    return this.apiGatewayService.post(url, body, { skipLoading: skipLoading }).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  uploadFiles(filesList: FileList, folderId?: string): Observable<any> {
    const formData: FormData = new FormData();
    // Sử dụng Promise.all để chờ tất cả các file được thêm vào FormData
    const formDataPromise = Promise.all(
      Array.from(filesList).map((file) => {
        return new Promise((resolve) => {
          formData.append('files', file);
          resolve(null);
        });
      }),
    ).then(() => formData);
    const url = `${this.url}/upload-file-save-to-media/${folderId}`;

    // Chuyển đổi Promise thành Observable
    return from(formDataPromise).pipe(
      switchMap((formData: FormData) => {
        return this.apiGatewayService.post(url, formData);
      }),
    );
  }

  updateFile(file2Update: File2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, file2Update).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  updateFiles2Folder(files2Update: File2Update[], folderId: string) {
    const url = `${this.url}/update-files-folder/${folderId}`;
    return this.apiGatewayService.put(url, files2Update).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  deleteFile(id: string) {
    const url = `${this.url}/${id}`;
    return this.apiGatewayService.delete(url).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  deleteFiles(ids: string[]) {
    const url = `${this.url}/delete-files`;
    return this.apiGatewayService.post(url, ids).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }
  getFileFolder() {
    const url = `/admin/file-folder`;
    return this.apiGatewayService.get(url, true).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  createFileFolder(fileFolder2Create: FileFolder2Create) {
    const url = `/admin/file-folder`;
    return this.apiGatewayService.post(url, fileFolder2Create).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  updateFileFolder(fileFolder2Update: FileFolder2Update) {
    const url = `/admin/file-folder`;
    return this.apiGatewayService.put(url, fileFolder2Update).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }

  deleteFileFolder(_id: string) {
    const url = `/admin/file-folder/${_id}`;
    return this.apiGatewayService.delete(url).pipe(
      tap((res: any) => {}),
      catchError((err: HttpErrorResponse) => {
        const msg = err?.error?.message || err.message || 'Unexpected error';
        return throwError(() => err);
      }),
    );
  }
}
