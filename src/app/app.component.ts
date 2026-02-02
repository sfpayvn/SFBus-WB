import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { SettingCacheService } from '@rsApp/modules/settings/services/setting-cache.service';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { LoaddingScreenComponent } from './shared/components/loadding-screen/loadding-screen.component';
import { ThemeService } from './core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster, LoaddingScreenComponent],
})
export class AppComponent implements OnInit {
  protected readonly toast = toast;
  title = 'SFBus WB';

  constructor(
    public themeService: ThemeService,
    private settingCacheService: SettingCacheService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('vi');
    this.translate.use('vi');
  }

  ngOnInit(): void {
    this.settingCacheService.whenReady();
  }
}
