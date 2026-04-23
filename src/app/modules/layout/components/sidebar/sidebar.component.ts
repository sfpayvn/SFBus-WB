import { NgClass, NgIf, AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import packageJson from '../../../../../../package.json';
import { MenuService } from '../../services/menu.service';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { OrganizationService } from '@rsApp/core/services/organization.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [NgClass, NgIf, AngularSvgIconModule, SidebarMenuComponent, AsyncPipe],
})
export class SidebarComponent implements OnInit {
  public appJson: any = packageJson;
  title$ = this.organizationService.organizationName$;

  constructor(public menuService: MenuService, private organizationService: OrganizationService) {}

  ngOnInit(): void {
    // Organization name will be loaded and updated automatically
  }

  public toggleSidebar() {
    this.menuService.toggleSidebar();
  }
}
