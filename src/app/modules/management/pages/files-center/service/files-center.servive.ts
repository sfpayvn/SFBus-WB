import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { File2Create, File2Update, FileFolder2Create, FileFolder2Update } from '../model/file-center.model';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  url = '';

  constructor(private apiGatewayService: ApiGatewayService) { }

  searchFile(pageIdx: number = 0, pageSize: number = 999, keyword: string = "", sortBy: string = "", fileFolderId: string = "") {
    const url = `/file/search?pageIdx=${pageIdx}&pageSize=${pageSize}&keyword=${keyword}&sortBy=${sortBy}&fileFolderId=${fileFolderId}`;
    return this.apiGatewayService.get(url).pipe(
      tap((res: any) => { }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  createFile(file2Create: File2Create) {
    const url = this.url;
    return this.apiGatewayService.post(url, file2Create).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  updateFile(file2Update: File2Update) {
    const url = this.url;
    return this.apiGatewayService.put(url, file2Update).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        //write log
        return of(null);
      }),
    );
  }

  deleteFile(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(
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
