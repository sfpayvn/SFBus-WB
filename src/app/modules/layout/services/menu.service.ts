import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@rsApp/modules/management/modules/user-management/model/user.model';
import { CredentialService } from '@rsApp/shared/services/credential.service';
import { Subscription } from 'rxjs';
import { MenuAdmin } from '@rsApp/core/constants/menu-admin';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';
import { MenuTenant } from '@rsApp/core/constants/menu-teant';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();

  constructor(private router: Router, private credentials: CredentialService) {
    /** Set dynamic menu */

    this.getPages().then((pages) => {
      this._pagesMenu.set(pages);
      let sub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          /** Expand menu base on active route */
          this._pagesMenu().forEach((menu) => {
            let activeGroup = false;
            menu.items.forEach((subMenu) => {
              const active = this.isActive(subMenu.route);
              subMenu.expanded = active;
              subMenu.active = active;
              if (active) activeGroup = true;
              if (subMenu.children) {
                this.expand(subMenu.children);
              }
            });
            menu.active = activeGroup;
          });
        }
      });
      this._subscription.add(sub);
    });
  }

  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu() {
    return this._pagesMenu();
  }

  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  public toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }

  public toggleMenu(menu: any) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  private expand(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  private isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /** Lấy menu theo role của current user */
  async getPages(): Promise<MenuItem[]> {
    const currentUser: User = await this.credentials.getCurrentUser();
    console.log("🚀 ~ MenuService ~ getPages ~ currentUser:", currentUser)
    const role: string = (currentUser?.role || 'tenant') as string;

    const menu = role === 'admin' ? MenuAdmin : MenuTenant;

    // Trả về bản sao để không mutate cấu hình gốc
    return menu.pages;
  }
}
