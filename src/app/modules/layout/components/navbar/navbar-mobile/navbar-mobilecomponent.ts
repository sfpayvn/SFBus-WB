import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { NavbarMobileMenuComponent } from './navbar-mobile-menu/navbar-mobile-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { OrganizationService } from '@rsApp/core/services/organization.service';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.css'],
  imports: [NgClass, AngularSvgIconModule, NavbarMobileMenuComponent, AsyncPipe],
})
export class NavbarMobileComponent implements OnInit {
  title$ = this.organizationService.organizationName$;

  constructor(public menuService: MenuService, private organizationService: OrganizationService) {}

  ngOnInit(): void {
    // Organization name will be loaded and updated automatically
  }

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = false;
  }
}
