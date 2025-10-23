import { Injectable, OnDestroy, signal, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@rsApp/modules/management/modules/user-management/model/user.model';
import { CredentialService } from '@rsApp/shared/services/credential.service';
import { Subscription, filter } from 'rxjs';
import { MenuAdmin } from '@rsApp/core/constants/menu-admin';
import { MenuTenant } from '@rsApp/core/constants/menu-teant';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';
import _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class MenuService implements OnDestroy {
  private router = inject(Router);
  private credentials = inject(CredentialService);

  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();

  constructor() {
    // Lần đầu (reload trang) cũng lấy menu
    this.reloadPagesAndExpand();

    // Theo dõi thay đổi route để cập nhật trạng thái expanded/active
    const sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.syncActiveStates());
    this._subscription.add(sub);
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

  set showSideBar(v: boolean) {
    this._showSidebar.set(v);
  }
  set showMobileMenu(v: boolean) {
    this._showMobileMenu.set(v);
  }

  toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }
  toggleMenu(menu: any) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }
  toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  /** GỌI HÀM NÀY sau khi login xong để rebuild menu theo role mới */
  async reloadPagesAndExpand(): Promise<void> {
    const pages = await this.getPages();
    this._pagesMenu.set(pages);
    this.syncActiveStates(); // expand theo route hiện tại
  }

  /** Expand/active theo route hiện tại */
  private syncActiveStates(): void {
    const menus = this._pagesMenu();
    if (!menus?.length) return;

    menus.forEach((menu) => {
      let activeGroup = false;
      menu.items?.forEach((sub) => {
        const active = this.isActive(sub.route);
        sub.active = active;
        sub.expanded = active;
        if (active) activeGroup = true;
        if (sub.children) this.expandDeep(sub.children);
      });
      (menu as any).active = activeGroup;
    });

    // Ghi lại signal (vì ta mutate object)
    this._pagesMenu.set([...menus]);
  }

  private expandDeep(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expandDeep(item.children);
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

  /** Lấy menu theo role của current user */
  private async getPages(): Promise<MenuItem[]> {
    const currentUser: User = await this.credentials.getCurrentUser();
    const role: string = currentUser.roles.includes('admin') ? 'admin' : 'tenant';
    const menu = role === 'admin' ? MenuAdmin : MenuTenant;

    return _.cloneDeep(menu.pages);
  }
}
