/**
 * Role-Based Access Directive
 * 
 * Dùng để ẩn/hiện element hoặc disable button dựa trên role/permission
 * 
 * Ví dụ sử dụng:
 * 1. Ẩn element nếu user không có quyền:
 *    <button *appAuthorized="{ module: 'bus-management', action: 'delete' }">Delete</button>
 * 
 * 2. Disable button nếu user không có quyền:
 *    <button [appAuthorized]="{ module: 'bus-management', action: 'update', mode: 'disable' }">Update</button>
 * 
 * 3. Kiểm tra multiple actions:
 *    <button *appAuthorized="{ module: 'bus-management', actions: ['create', 'update'] }">Edit</button>
 * 
 * 4. Kiểm tra ANY action trong list:
 *    <button *appAuthorized="{ module: 'bus-management', actions: ['update', 'delete'], anyOf: true }">Modify</button>
 */

import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { RoleAccessService, ActionType } from '@rsApp/core/services/role-access.service';

export interface AuthorizedConfig {
  module: string;
  action?: ActionType;
  actions?: ActionType[];
  anyOf?: boolean; // true: kiểm tra ANY action, false: kiểm tra ALL actions (default)
  mode?: 'hide' | 'disable'; // hide: ẩn element, disable: disable element (default: hide)
  fallbackText?: string; // Text hiển thị khi không có quyền (chỉ dùng cho disable mode)
}

@Directive({
  selector: '[appAuthorized]',
  standalone: true,
})
export class AuthorizedDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private roleAccessService = inject(RoleAccessService);

  private config: AuthorizedConfig = { module: '' };
  private isAuthorized = false;

  @Input()
  set appAuthorized(value: AuthorizedConfig) {
    this.config = value;
    this.updateView();
  }

  constructor() {
    // Kiểm tra lại permission khi role thay đổi
    effect(() => {
      this.roleAccessService.getUserRoles();
      this.updateView();
    });
  }

  /**
   * Cập nhật view dựa trên permission
   */
  private updateView(): void {
    this.isAuthorized = this.checkAuthorization();

    if (this.config.mode === 'disable') {
      this.handleDisableMode();
    } else {
      this.handleHideMode();
    }
  }

  /**
   * Kiểm tra user có quyền hay không
   */
  private checkAuthorization(): boolean {
    const { module, action, actions, anyOf } = this.config;

    if (!module) {
      console.warn('[AppAuthorized] Module không được cấu hình');
      return false;
    }

    // Kiểm tra action nếu có
    if (action) {
      return this.roleAccessService.canAction(module, action);
    }

    // Kiểm tra multiple actions
    if (actions && actions.length > 0) {
      return anyOf
        ? this.roleAccessService.canAnyAction(module, actions)
        : this.roleAccessService.canActions(module, actions);
    }

    // Mặc định: kiểm tra module access
    return this.roleAccessService.canAccessModule(module);
  }

  /**
   * Hide mode: ẩn element nếu không có quyền
   */
  private handleHideMode(): void {
    if (this.isAuthorized) {
      // Tạo view nếu chưa tạo
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      // Xóa view nếu không có quyền
      this.viewContainer.clear();
    }
  }

  /**
   * Disable mode: disable element nếu không có quyền
   */
  private handleDisableMode(): void {
    // Luôn tạo view, nhưng disable nếu không có quyền
    if (this.viewContainer.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }

    // Lấy element đầu tiên trong view
    const viewRef = this.viewContainer.get(0) as any;
    const element = viewRef?.rootNodes?.[0] as HTMLElement | undefined;
    if (element) {
      if (this.isAuthorized) {
        element.removeAttribute('disabled');
        element.style.opacity = '1';
        element.style.cursor = 'pointer';
      } else {
        (element as any).disabled = true;
        element.style.opacity = '0.5';
        element.style.cursor = 'not-allowed';
        element.title = this.config.fallbackText || 'Bạn không có quyền thực hiện hành động này';
      }
    }
  }
}
