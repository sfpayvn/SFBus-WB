import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { LoaddingScreenComponent } from './shared/components/loadding-screen/loadding-screen.component';
import { ThemeService } from './core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationService } from './core/services/organization.service';
import { SettingCacheService } from '@rsApp/modules/settings/services/setting-cache.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster, LoaddingScreenComponent],
})
export class AppComponent implements OnInit {
  protected readonly toast = toast;

  constructor(
    public themeService: ThemeService,
    private settingCacheService: SettingCacheService,
    private translate: TranslateService,
    private organizationService: OrganizationService,
  ) {
    this.translate.setDefaultLang('vi');
  }

  async ngOnInit(): Promise<void> {
    // Wait for settings cache ready
    await this.settingCacheService.whenReady();

    // Load organization name and update everywhere
    this.organizationService.loadAndSetOrganizationName();
  }
}
