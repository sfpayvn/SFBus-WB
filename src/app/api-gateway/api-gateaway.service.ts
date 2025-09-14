import { HttpClient, HttpHeaders, HttpContext, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SkipLoading } from '../shared/Interceptor/loading-interceptor';
import { ENV } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiGatewayService {
  protected api = ENV.apiUrl;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  private createHeaders(skipLoading: boolean): { headers: HttpHeaders; context: HttpContext } {
    let headers = new HttpHeaders();
    let context = new HttpContext().set(SkipLoading, skipLoading);

    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    headers = headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization',
    );

    return { headers, context };
  }

  request(method: string, url: string, body: any = null, skipLoading: boolean = false): Observable<any> {
    const { headers, context } = this.createHeaders(skipLoading);
    url = this.api + url;

    switch (method) {
      case 'GET':
        return this.http.get(url, { headers, context, params: body }).pipe(catchError(this.handleError.bind(this)));
      case 'POST':
        return this.http.post(url, body, { headers, context }).pipe(catchError(this.handleError.bind(this)));
      case 'PUT':
        return this.http.put(url, body, { headers, context }).pipe(catchError(this.handleError.bind(this)));
      case 'DELETE':
        return this.http.delete(url, { headers, context }).pipe(catchError(this.handleError.bind(this)));
      default:
        throw new Error('Unsupported request method');
    }
  }

  get(url: string, params: any = null, skipLoading: boolean = false): Observable<any> {
    return this.request('GET', url, params, skipLoading);
  }

  post(url: string, body: any, skipLoading: boolean = false): Observable<any> {
    return this.request('POST', url, body, skipLoading);
  }

  put(url: string, body: any, skipLoading: boolean = false): Observable<any> {
    return this.request('PUT', url, body, skipLoading);
  }

  delete(url: string, skipLoading: boolean = false): Observable<any> {
    return this.request('DELETE', url, null, skipLoading);
  }
}
