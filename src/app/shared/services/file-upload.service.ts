import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    private url = '/upload';

    constructor(private apiGatewayService: ApiGatewayService) { }

    uploadFile(file: Blob, fileName: string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, fileName);
        const url = `${this.url}/upload-file`
        return this.apiGatewayService.post(url, formData);
    }
}
