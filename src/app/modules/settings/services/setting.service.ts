import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchSettings, Setting, Setting2Update } from '../model/setting.model';
import { ApiGatewayService } from '@rsApp/api-gateway/api-gateaway.service';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private baseUrl = '/admin/settings';

  constructor(private api: ApiGatewayService) {}

  /** Create or update a single setting. */
  createOrUpdate(setting: Setting): Observable<Setting> {
    // POST will create or update on the backend depending on implementation
    return this.api.post(`${this.baseUrl}/create-or-update`, setting);
  }

  /** Create or update multiple settings. */
  createOrUpdates(items: Setting2Update[]): Observable<Setting2Update[]> {
    return this.api.post(`${this.baseUrl}/create-or-updates`, items);
  }

  getSettingByName(name: string): Observable<Setting> {
    return this.api.get(`${this.baseUrl}/name/${encodeURIComponent(name)}`);
  }

  getSettingByGroupName(groupName: string): Observable<Setting[]> {
    return this.api.get(`${this.baseUrl}/group/${encodeURIComponent(groupName)}`);
  }

  search(params: any): Observable<SearchSettings> {
    return this.api.post(`${this.baseUrl}/search`, params);
  }

  getAll(): Observable<Setting[]> {
    return this.api.get(`${this.baseUrl}`);
  }
}
