import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuService } from '../../services/menu.service';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { OrganizationService } from '@rsApp/core/services/organization.service';
import { LanguageService } from '@rsApp/shared/services/language.service';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    AsyncPipe,
    AngularSvgIconModule,
    NavbarMenuComponent,
    ProfileMenuComponent,
    NavbarMobileComponent,
    NZModule,
    NgClass,
    TranslateModule,
  ],
})
export class NavbarComponent implements OnInit {
  title$ = this.organizationService.organizationName$;

  currentLanguage: string = 'en';
  availableLanguages: string[] = ['vi', 'en'];

  constructor(
    private menuService: MenuService,
    private organizationService: OrganizationService,
    private languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    // Organization name will be loaded and updated automatically
    this.subscribeToLanguageChanges();
  }

  private subscribeToLanguageChanges(): void {
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  getLanguageLabel(lang: string): string {
    return lang === 'vi' ? 'VI' : 'EN';
  }
}
