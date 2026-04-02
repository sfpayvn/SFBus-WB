import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { SettingCacheService } from '@rsApp/modules/settings/services/setting-cache.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private organizationNameSubject = new BehaviorSubject<string>('SFBus');
  public organizationName$ = this.organizationNameSubject.asObservable();

  constructor(
    private settingCacheService: SettingCacheService,
    private titleService: Title,
  ) {}

  /**
   * Load organization name từ settings và update everywhere
   */
  async loadAndSetOrganizationName(): Promise<void> {
    try {
      const setting = await firstValueFrom(this.settingCacheService.getSettingByName('organizationName'));
      const orgName = setting?.value || 'SFBus';

      // Update subject để broadcasts tới tất cả subscribers
      this.organizationNameSubject.next(orgName);

      // Update browser title
      this.updateBrowserTitle(orgName);
    } catch (error) {
      console.warn('Failed to load organization name', error);
    }
  }

  /**
   * Update browser title
   */
  private updateBrowserTitle(organizationName: string): void {
    this.titleService.setTitle(organizationName + ' WB');
  }

  /**
   * Get current organization name
   */
  getOrganizationName(): string {
    return this.organizationNameSubject.value;
  }

  /**
   * Manual update organization name (khi user save settings)
   */
  updateOrganizationName(name: string): void {
    this.organizationNameSubject.next(name);
    this.updateBrowserTitle(name);
  }
}
