# 🔐 Role-Based Access Control (RBAC) Implementation

Giải pháp toàn diện để kiểm soát quyền truy cập dựa trên role của user.

## 📋 Tổng quan

Hệ thống RBAC bao gồm 4 lớp kiểm soát:

1. **Route Protection** - Chặn truy cập URL không được phép
2. **Component Protection** - Ẩn/Disable UI elements
3. **Action Protection** - Kiểm tra quyền trước khi thực hiện action
4. **Backend Protection** - Kiểm tra lại quyền phía server (luôn làm)

---

## 🎯 Các File Tạo Mới

### 1. **role-permissions.constant.ts**
📍 `src/app/core/constants/role-permissions.constant.ts`

Định nghĩa quyền chi tiết cho từng role:
- Admin: Có quyền truy cập tất cả modules, tất cả actions
- Tenant: Quản lý xe, routes, schedules
- Tenant-Operator: Chỉ quản lý schedules
- Driver: Xem schedules
- Client: Đặt vé
- POS: Quản lý booking

**Cấu trúc:**
```typescript
{
  [ROLE]: {
    modules: ['module-key-1', 'module-key-2'],
    functions: {
      'module-key-1': ['list', 'create', 'update', 'delete', 'view']
    }
  }
}
```

### 2. **role-access.guard.ts**
📍 `src/app/guards/role-access.guard.ts`

Angular Guard để kiểm tra quyền trên route:
- Kiểm tra user có role không
- Kiểm tra module access
- Redirect `/errors/403` nếu deny

**Sử dụng:**
```typescript
const routes = [
  {
    path: 'buses',
    canActivate: [RoleAccessGuard],
    data: { moduleKey: 'bus-management' }
  }
];
```

### 3. **role-access.service.ts**
📍 `src/app/core/services/role-access.service.ts`

Service chính để kiểm tra quyền:

**Methods:**
- `canAccessModule(moduleKey)` - Kiểm tra module access
- `canAction(moduleKey, action)` - Kiểm tra action cụ thể
- `canActions(moduleKey, actions)` - Kiểm tra TẤT CẢ actions
- `canAnyAction(moduleKey, actions)` - Kiểm tra BẤT KỲ action nào
- `hasRole(roles)` - Kiểm tra user có role
- `checkAccess(...)` - Kiểm tra chi tiết kèm reason
- `canAccessModule$()`, `canAction$()` - Observable versions

**Sử dụng:**
```typescript
// Synchronous
if (this.roleAccessService.canAction('bus-management', 'delete')) {
  showDeleteButton();
}

// Observable
<button *ngIf="(roleAccessService.canAction$('bus-management', 'delete') | async)">
  Delete
</button>
```

### 4. **authorized.directive.ts**
📍 `src/app/core/directives/authorized.directive.ts`

Directive để ẩn/disable elements dựa trên permission:

**Modes:**
- `hide` (default) - Ẩn element nếu không có quyền
- `disable` - Disable element nếu không có quyền

**Sử dụng:**
```html
<!-- Ẩn button -->
<button *appAuthorized="{ module: 'bus-management', action: 'create' }">
  Thêm
</button>

<!-- Disable button -->
<button [appAuthorized]="{ module: 'bus-management', action: 'delete', mode: 'disable' }">
  Xóa
</button>

<!-- Multiple actions (ALL) -->
<button *appAuthorized="{ module: 'bus-management', actions: ['create', 'update'] }">
  Edit
</button>

<!-- Multiple actions (ANY) -->
<button *appAuthorized="{ module: 'bus-management', actions: ['create', 'update'], anyOf: true }">
  Modify
</button>
```

### 5. **required-role.decorator.ts**
📍 `src/app/core/decorators/required-role.decorator.ts`

Decorator để protect methods:

**Sử dụng:**
```typescript
export class BusService extends WithAuthorizationCheck {
  constructor(protected roleAccessService = inject(RoleAccessService)) {
    super();
  }

  // Throw error nếu không có quyền
  @RequiredRole({ module: 'bus-management', action: 'create' })
  createBus(data: any) { ... }

  // Return false nếu không có quyền
  @RequiredRole({ 
    module: 'bus-management', 
    action: 'delete',
    throwError: false 
  })
  deleteBus(id: string) { ... }
}
```

### 6. **error403.component.**
📍 `src/app/modules/error/pages/error403/`

Trang lỗi 403 - Truy cập bị từ chối

---

## 🚀 Quick Start

### STEP 1: Import Guard vào Routing

**File:** `src/app/modules/management/management-routing.module.ts`

```typescript
import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';

const routes: Routes = [
  {
    path: 'bus-management',
    canActivate: [ModuleBlockGuard, RoleAccessGuard],
    data: { moduleKey: MODULE_KEYS.BUS_MANAGEMENT },
    loadChildren: () => import('./modules/bus-management/...')
  }
];
```

### STEP 2: Inject Service vào Component

```typescript
import { RoleAccessService } from '@rsApp/core/services/role-access.service';

export class BusComponent implements OnInit {
  private roleAccessService = inject(RoleAccessService);

  canCreate = false;

  ngOnInit() {
    this.canCreate = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create');
  }
}
```

### STEP 3: Thêm Directive trong Template

```html
<button *appAuthorized="{ module: 'bus-management', action: 'create' }">
  Thêm xe
</button>
```

---

## 📊 Permission Matrix

### ROLE_CONSTANTS.ADMIN
- ✓ Tất cả modules
- ✓ Tất cả actions (create, read, update, delete)

### ROLE_CONSTANTS.TENANT
- ✓ Files, Goods, Bus Management
- ✓ User Management (Client, Driver, POS, Operator)
- ✓ Tất cả actions

### ROLE_CONSTANTS.TENANT_OPERATOR
- ✓ Bus Management (chỉ schedule, design)
- ✓ Create, Update, Delete schedules
- ✓ View design templates

### ROLE_CONSTANTS.DRIVER
- ✓ Bus Schedule
- ✓ Chỉ list, view actions

### ROLE_CONSTANTS.CLIENT
- ✓ Booking Management
- ✓ List, Create, View actions

### ROLE_CONSTANTS.POS
- ✓ Booking Management
- ✓ Tất cả actions

---

## 🛡️ Best Practices

✅ **DO**
- Kiểm tra quyền cả Frontend AND Backend
- Sử dụng module keys từ hằng số
- Ẩn UI thay vì throw errors
- Cache permission results
- Refresh cache sau khi update role
- Log unauthorized attempts
- Validate backend lại quyền

❌ **DON'T**
- Chỉ kiểm tra quyền phía frontend
- Sử dụng string literals cho module names
- Disable form thay vì ẩn buttons
- Trust client-side permission checks
- Cache permission indefinitely
- Expose sensitive info trong error messages

---

## 🧪 Testing

```typescript
// Setup mock user
spyOn(credentialService, 'getCurrentUser').and.returnValue(
  Promise.resolve({
    id: '1',
    roles: [ROLE_CONSTANTS.TENANT]
  })
);

// Test module access
expect(service.canAccessModule(MODULE_KEYS.BUS_MANAGEMENT)).toBe(true);
expect(service.canAccessModule(MODULE_KEYS.USERS_MANAGEMENT)).toBe(false);

// Test action access
expect(service.canAction(MODULE_KEYS.BUSES, 'create')).toBe(true);
expect(service.canAction(MODULE_KEYS.USERS_MANAGEMENT, 'create')).toBe(false);
```

---

## 🔧 Troubleshooting

**Q: Directive không hoạt động?**
A: Import AuthorizedDirective trong component.standalone hoặc module declarations.

**Q: Guard redirect 403 nhưng page không tìm?**
A: Thêm Error403Component vào error-routing.module.ts

**Q: Service trả về false khi chắc user có quyền?**
A: Gọi `roleAccessService.refreshCache()` sau khi update user role.

**Q: Permission cache không update?**
A: Call `refreshCache()` trong auth service sau khi login/logout.

---

## 📖 Documentation Files

- `ROLE_BASED_ACCESS_CONTROL.guide.ts` - Hướng dẫn chi tiết
- `ROLE_BASED_ACCESS_EXAMPLE.ts` - Ví dụ routing integration
- `EXAMPLE_COMPONENT_WITH_RBAC.ts` - Component ví dụ hoàn chỉnh
- `ROLE_BASED_ACCESS_CONTROL_CHECKLIST.md` - Checklist implementation

---

## 🎓 Advanced Usage

### Observable Pattern (Async Pipe)

```html
<button *ngIf="(roleAccessService.canAction$('bus-management', 'create') | async)">
  Thêm
</button>
```

### Decorator Pattern

```typescript
@Injectable()
export class BusService extends WithAuthorizationCheck {
  @RequiredRole({ module: 'bus-management', action: 'create' })
  createBus(data: any) { ... }
}
```

### Check Result with Reason

```typescript
const result = this.roleAccessService.checkAccess(
  MODULE_KEYS.BUSES,
  undefined,
  'delete'
);

if (!result.canAccess) {
  console.log('Denied:', result.reason); // Lý do deny
}
```

---

## 📞 Support

Để hiểu rõ hơn về từng file, xem các comments trong source code.

**Key Functions:**
1. Start with `RoleAccessService` untuk hiểu core logic
2. Xem `role-permissions.constant.ts` để hiểu permission structure
3. Xem ví dụ trong `EXAMPLE_COMPONENT_WITH_RBAC.ts`
4. Đọc hướng dẫn trong `ROLE_BASED_ACCESS_CONTROL.guide.ts`

---

**Version:** 1.0  
**Last Updated:** January 14, 2026  
**Created by:** Senior Developer - Role-Based Access Control System
