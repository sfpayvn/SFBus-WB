/**
 * Role-Based Access Decorator
 * 
 * TypeScript decorator để kiểm tra quyền truy cập trước khi gọi method
 * Sẽ throw error hoặc return false nếu user không có quyền
 * 
 * Ví dụ sử dụng:
 * 
 * ```typescript
 * export class BusManagementComponent {
 *   constructor(private roleAccessService: RoleAccessService) {}
 * 
 *   // Kiểm tra action create
 *   @RequiredRole({ module: 'bus-management', action: 'create' })
 *   createBus(data: any) {
 *     // Code chỉ chạy nếu user có quyền 'create' trên 'bus-management'
 *   }
 * 
 *   // Kiểm tra multiple actions (ALL)
 *   @RequiredRole({ module: 'bus-management', actions: ['update', 'delete'] })
 *   updateBus(data: any) {
 *     // Code chỉ chạy nếu user có cả 'update' và 'delete'
 *   }
 * 
 *   // Kiểm tra ANY action
 *   @RequiredRole({ module: 'bus-management', actions: ['create', 'update'], anyOf: true })
 *   editBus(data: any) {
 *     // Code chỉ chạy nếu user có 'create' hoặc 'update'
 *   }
 * 
 *   // Return false thay vì throw error
 *   @RequiredRole({ module: 'bus-management', action: 'delete', throwError: false })
 *   deleteBus(id: string) {
 *     // Return false nếu không có quyền
 *   }
 * }
 * ```
 */

import { RoleAccessService, ActionType } from '@rsApp/core/services/role-access.service';

export interface RequiredRoleConfig {
  module: string;
  action?: ActionType;
  actions?: ActionType[];
  anyOf?: boolean; // true: ANY action, false: ALL actions (default)
  throwError?: boolean; // true: throw error (default), false: return false
  errorMessage?: string;
}

/**
 * Decorator để protect method từ unauthorized access
 * Phải sử dụng trên instance methods của class có RoleAccessService injected
 */
export function RequiredRole(config: RequiredRoleConfig) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Lấy service từ 'this' context
      const roleAccessService = (this as any).roleAccessService as RoleAccessService;
      const thisContext = this as any;

      if (!roleAccessService) {
        console.error(
          `[@RequiredRole] ${target.constructor.name}.${propertyKey}: RoleAccessService không được inject`,
        );
        return false;
      }

      // Kiểm tra quyền
      let isAuthorized = false;
      if (thisContext.checkMethodAuthorization && typeof thisContext.checkMethodAuthorization === 'function') {
        isAuthorized = thisContext.checkMethodAuthorization(config, roleAccessService);
      } else {
        // Fallback: use helper function
        isAuthorized = createAuthorizationChecker()(config, roleAccessService);
      }

      if (!isAuthorized) {
        const errorMsg =
          config.errorMessage ||
          `User không có quyền thực hiện '${config.action || 'action'}' trên module '${config.module}'`;

        if (config.throwError !== false) {
          throw new Error(errorMsg);
        }

        console.warn(`[@RequiredRole] ${target.constructor.name}.${propertyKey}: ${errorMsg}`);
        return false;
      }

      // Gọi method gốc nếu có quyền
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Helper để kiểm tra authorization trong decorator
 * Thêm method này vào class muốn sử dụng decorator
 * 
 * ```typescript
 * export class YourComponent {
 *   private roleAccessService = inject(RoleAccessService);
 * 
 *   // Thêm method này
 *   protected checkMethodAuthorization(
 *     config: RequiredRoleConfig,
 *     roleAccessService: RoleAccessService
 *   ): boolean {
 *     // ... implementation
 *   }
 * }
 * ```
 */
export function createAuthorizationChecker() {
  return function (config: RequiredRoleConfig, roleAccessService: RoleAccessService): boolean {
    if (!config.module) {
      console.warn('[RequiredRole] Module không được cấu hình');
      return false;
    }

    // Kiểm tra action
    if (config.action) {
      return roleAccessService.canAction(config.module, config.action);
    }

    // Kiểm tra multiple actions
    if (config.actions && config.actions.length > 0) {
      return config.anyOf
        ? roleAccessService.canAnyAction(config.module, config.actions)
        : roleAccessService.canActions(config.module, config.actions);
    }

    // Mặc định: kiểm tra module access
    return roleAccessService.canAccessModule(config.module);
  };
}

/**
 * Mixin class để dễ sử dụng decorator trong component/service
 * 
 * ```typescript
 * @Component(...)
 * export class MyComponent extends WithAuthorizationCheck {
 *   constructor(protected roleAccessService = inject(RoleAccessService)) {
 *     super();
 *   }
 * 
 *   @RequiredRole({ module: 'bus-management', action: 'create' })
 *   createBus() { ... }
 * }
 * ```
 */
export class WithAuthorizationCheck {
  protected roleAccessService: RoleAccessService | null = null;

  protected checkMethodAuthorization(
    config: RequiredRoleConfig,
    roleAccessService: RoleAccessService,
  ): boolean {
    if (!config.module) {
      console.warn('[RequiredRole] Module không được cấu hình');
      return false;
    }

    // Kiểm tra action
    if (config.action) {
      return roleAccessService.canAction(config.module, config.action);
    }

    // Kiểm tra multiple actions
    if (config.actions && config.actions.length > 0) {
      return config.anyOf
        ? roleAccessService.canAnyAction(config.module, config.actions)
        : roleAccessService.canActions(config.module, config.actions);
    }

    // Mặc định: kiểm tra module access
    return roleAccessService.canAccessModule(config.module);
  }
}
