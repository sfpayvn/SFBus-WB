import { Injectable, OnDestroy, signal, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@rsApp/modules/management/modules/user-management/model/user.model';
import { CredentialService } from '@rsApp/shared/services/credential.service';
import { CapsService } from '@rsApp/shared/services/caps.service';
import { RoleAccessService } from '@rsApp/core/services/role-access.service';
import { Subscription, filter } from 'rxjs';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';
import _ from 'lodash';
import { Menu } from '@rsApp/core/constants/menu';
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

@Injectable({ providedIn: 'root' })
export class MenuService implements OnDestroy {
  private router = inject(Router);
  private credentials = inject(CredentialService);
  private capsService = inject(CapsService);
  private roleAccessService = inject(RoleAccessService);

  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();

  constructor() {
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
    const menu = Menu;
    const pages = _.cloneDeep(menu.pages);
    console.log("🚀 ~ MenuService ~ getPages ~ pages:", pages)
    // Filter menu items nếu module bị block
    return this.filterBlockedMenus(pages);
  }

  /** Filter menu items nếu module bị block - sử dụng đệ quy để check tất cả children */
  private filterBlockedMenus(items: MenuItem[]): MenuItem[] {
    return items
      .filter((menu) => !this.isMenuBlocked(menu))
      .map((menu) => ({
        ...menu,
        items: this.filterBlockedSubMenus(menu.items) || [],
      }));
  }

  /** Filter sub menu items đệ quy */
  private filterBlockedSubMenus(items: SubMenuItem[] | undefined): SubMenuItem[] {
    if (!items) return [];
    return items
      .filter((sub) => !this.isMenuBlocked(sub))
      .map((sub) => {
        const filteredChildren = this.filterBlockedSubMenus(sub.children);
        return {
          ...sub,
          children: filteredChildren.length > 0 ? filteredChildren : undefined,
        };
      });
  }

  /** Kiểm tra xem menu item có bị block hay không dựa trên role permissions + caps blocking */
  private isMenuBlocked(item: any): boolean {
    if (item.moduleKey === MODULE_KEYS.FILES_CENTER_MANAGEMENT) {
    }
    // Ưu tiên moduleKey nếu có, nếu không thì extract từ route
    const moduleKey = item.moduleKey || this.extractModuleKeyFromRoute(item.route);

    if (!moduleKey) return false;

    // Check 1: Kiểm tra role permission (RBAC)
    const hasRolePermission = this.roleAccessService.canAccessModule(moduleKey);
    if (!hasRolePermission) {
      return true; // Block: User doesn't have role permission
    }

    // Check 2: Kiểm tra caps blocking (quota/capacity)
    const isCapsBlocked = this.capsService.isBlocked(moduleKey);
    if (isCapsBlocked) {
      return true; // Block: Module is blocked by caps service (quota exceeded, etc.)
    }

    // Allow: User has role permission AND module is not caps-blocked
    return false;
  }

  /** Extract moduleKey từ route */
  private extractModuleKeyFromRoute(route: string): string | null {
    if (!route) return null;
    // Extract moduleKey từ route (e.g., '/management/auto-schedule' => 'auto-schedule')
    const parts = route.split('/').filter((p) => p);
    // Giả sử module key là phần cuối của route: 'management/auto-schedule' => 'auto-schedule'
    return parts.length >= 2 ? parts[parts.length - 1] : null;
  }
}
