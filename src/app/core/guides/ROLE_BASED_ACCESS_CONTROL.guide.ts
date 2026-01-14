/**
 * HƯỚNG DẪN SỬ DỤNG ROLE-BASED ACCESS CONTROL
 * 
 * Giải pháp hoàn chỉnh để kiểm soát quyền truy cập trong ứng dụng:
 * ✓ Chặn URL/Route không được phép
 * ✓ Kiểm soát hiển thị Component
 * ✓ Kiểm soát Button/Action
 * ✓ Type-safe và Senior-level code
 */

/**
 * ==========================================
 * 1. SETUP - Thêm guard vào routing
 * ==========================================
 * 
 * File: src/app/app-routing.module.ts
 * 
 * import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';
 * 
 * const routes: Routes = [
 *   {
 *     path: 'management',
 *     component: ManagementComponent,
 *     canActivate: [RoleAccessGuard],
 *     children: [
 *       {
 *         path: 'bus-management',
 *         component: BusManagementComponent,
 *         canActivate: [RoleAccessGuard],
 *         data: { moduleKey: 'bus-management' }
 *       },
 *       {
 *         path: 'users-management',
 *         component: UsersManagementComponent,
 *         canActivate: [RoleAccessGuard],
 *         data: { moduleKey: 'users-management' }
 *       }
 *     ]
 *   }
 * ];
 */

/**
 * ==========================================
 * 2. KIỂM TRA QUYỀN TRONG COMPONENT
 * ==========================================
 * 
 * Cách 1: Sử dụng RoleAccessService (Recommended)
 * 
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
 * 
 * @Component({ ... })
 * export class BusManagementComponent {
 *   // Inject service
 *   constructor(private roleAccessService: RoleAccessService) {}
 * 
 *   ngOnInit() {
 *     // Kiểm tra quyền module
 *     if (this.roleAccessService.canAccessModule(MODULE_KEYS.BUS_MANAGEMENT)) {
 *       console.log('User có quyền truy cập Bus Management');
 *     }
 * 
 *     // Kiểm tra quyền action cụ thể
 *     if (this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create')) {
 *       this.showCreateButton = true;
 *     }
 * 
 *     // Kiểm tra multiple actions (ALL)
 *     if (this.roleAccessService.canActions(MODULE_KEYS.BUSES, ['create', 'update', 'delete'])) {
 *       this.enableFullManagement = true;
 *     }
 * 
 *     // Kiểm tra ANY action
 *     if (this.roleAccessService.canAnyAction(MODULE_KEYS.BUSES, ['create', 'update', 'delete'])) {
 *       this.showEditSection = true;
 *     }
 * 
 *     // Kiểm tra role
 *     if (this.roleAccessService.hasRole('admin')) {
 *       this.isAdmin = true;
 *     }
 * 
 *     if (this.roleAccessService.hasRole(['admin', 'tenant'])) {
 *       // User là admin hoặc tenant
 *     }
 *   }
 * }
 */

/**
 * ==========================================
 * 3. KIỂM TRA QUYỀN TRONG TEMPLATE
 * ==========================================
 * 
 * Cách 1: Sử dụng property của component
 * 
 * <button 
 *   *ngIf="canCreateBus"
 *   (click)="onCreateBus()"
 *   class="btn btn-primary">
 *   Thêm xe mới
 * </button>
 * 
 * Cách 2: Sử dụng directive appAuthorized (Recommended - Cleaner)
 * 
 * <!-- Ẩn element nếu không có quyền -->
 * <button 
 *   *appAuthorized="{ module: 'bus-management', action: 'create' }"
 *   (click)="onCreateBus()"
 *   class="btn btn-primary">
 *   Thêm xe mới
 * </button>
 * 
 * <!-- Disable button nếu không có quyền -->
 * <button 
 *   [appAuthorized]="{ module: 'bus-management', action: 'delete', mode: 'disable' }"
 *   (click)="onDeleteBus()"
 *   class="btn btn-danger">
 *   Xóa
 * </button>
 * 
 * <!-- Kiểm tra multiple actions (user phải có CẢ quyền) -->
 * <button 
 *   *appAuthorized="{ module: 'bus-management', actions: ['update', 'delete'] }"
 *   class="btn btn-warning">
 *   Sửa/Xóa
 * </button>
 * 
 * <!-- Kiểm tra ANY action (user có ÍT NHẤT 1 quyền) -->
 * <button 
 *   *appAuthorized="{ module: 'bus-management', actions: ['create', 'update', 'delete'], anyOf: true }"
 *   class="btn btn-secondary">
 *   Chỉnh sửa
 * </button>
 * 
 * Cách 3: Sử dụng async pipe với Observable
 * 
 * <button 
 *   *ngIf="(roleAccessService.canAction$(moduleName, 'create') | async)"
 *   class="btn btn-primary">
 *   Thêm
 * </button>
 */

/**
 * ==========================================
 * 4. KIỂM TRA QUYỀN TRONG METHOD/SERVICE
 * ==========================================
 * 
 * Cách 1: Sử dụng @RequiredRole decorator
 * 
 * import { RequiredRole } from '@rsApp/core/decorators/required-role.decorator';
 * 
 * @Component({ ... })
 * export class BusManagementComponent extends WithAuthorizationCheck {
 *   constructor(protected roleAccessService = inject(RoleAccessService)) {
 *     super();
 *   }
 * 
 *   // Kiểm tra trước khi gọi method
 *   @RequiredRole({ module: 'bus-management', action: 'create' })
 *   createBus(data: Bus) {
 *     // Code chỉ chạy nếu user có quyền 'create'
 *     // Nếu không có quyền → throw Error
 *   }
 * 
 *   // Return false thay vì throw error
 *   @RequiredRole({ 
 *     module: 'bus-management', 
 *     action: 'delete',
 *     throwError: false 
 *   })
 *   deleteBus(id: string) {
 *     // Nếu không có quyền → return false
 *   }
 * 
 *   // Kiểm tra multiple actions
 *   @RequiredRole({
 *     module: 'bus-management',
 *     actions: ['create', 'update'],
 *     anyOf: true // user có create HOẶC update
 *   })
 *   editBusData(data: Bus) {
 *     // Code chỉ chạy nếu user có create hoặc update
 *   }
 * }
 * 
 * Cách 2: Manual check
 * 
 * @Component({ ... })
 * export class BusService {
 *   constructor(private roleAccessService: RoleAccessService) {}
 * 
 *   updateBus(id: string, data: Bus) {
 *     const result = this.roleAccessService.checkAccess(
 *       MODULE_KEYS.BUS_MANAGEMENT,
 *       MODULE_KEYS.BUS_TEMPLATES,
 *       'update'
 *     );
 * 
 *     if (!result.canAccess) {
 *       throw new Error(result.reason);
 *     }
 * 
 *     // Thực hiện update
 *     return this.api.put(`/buses/${id}`, data);
 *   }
 * }
 */

/**
 * ==========================================
 * 5. ADVANCED USAGE - PERMISSION MATRIX
 * ==========================================
 * 
 * File: src/app/core/constants/role-permissions.constant.ts
 * 
 * Định nghĩa quyền cho từng role:
 * 
 * ROLE_CONSTANTS.ADMIN:
 *   - Có quyền truy cập TẤT CẢ modules
 *   - Có đầy đủ quyền CRUD (create, read, update, delete)
 * 
 * ROLE_CONSTANTS.TENANT:
 *   - Có quyền quản lý xe, tuyến đường, lịch trình
 *   - Có đầy đủ quyền CRUD trên các module này
 * 
 * ROLE_CONSTANTS.TENANT_OPERATOR:
 *   - Chỉ có quyền xem lịch trình
 *   - Có quyền tạo/cập nhật lịch tự động
 * 
 * ROLE_CONSTANTS.DRIVER:
 *   - Chỉ có quyền xem lịch trình
 * 
 * ROLE_CONSTANTS.CLIENT:
 *   - Chỉ có quyền đặt vé
 * 
 * ROLE_CONSTANTS.POS:
 *   - Có đầy đủ quyền CRUD trên đặt vé
 */

/**
 * ==========================================
 * 6. REAL-WORLD EXAMPLES
 * ==========================================
 */

/**
 * EXAMPLE 1: Bus Management Component
 * 
 * import { Component, OnInit, inject } from '@angular/core';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * import { MODULE_KEYS, FUNCTION_KEYS } from '@rsApp/core/constants/module-function-keys';
 * 
 * @Component({
 *   selector: 'app-bus-management',
 *   templateUrl: './bus-management.component.html',
 *   styleUrls: ['./bus-management.component.css']
 * })
 * export class BusManagementComponent implements OnInit {
 *   private roleAccessService = inject(RoleAccessService);
 *   
 *   // Properties để dùng trong template
 *   canCreate = false;
 *   canUpdate = false;
 *   canDelete = false;
 *   canView = false;
 *   
 *   ngOnInit() {
 *     // Kiểm tra từng quyền
 *     this.canCreate = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create');
 *     this.canUpdate = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'update');
 *     this.canDelete = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'delete');
 *     this.canView = this.roleAccessService.canAccessModule(MODULE_KEYS.BUSES);
 *   }
 *   
 *   // Hoặc sử dụng trực tiếp trong method
 *   onAddBus() {
 *     if (!this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create')) {
 *       alert('Bạn không có quyền thêm xe');
 *       return;
 *     }
 *     // Thêm xe
 *   }
 * }
 * 
 * <!-- Template -->
 * <div class="bus-management">
 *   <!-- Kiểm tra quyền trong template -->
 *   <button 
 *     *appAuthorized="{ module: 'bus-management', action: 'create' }"
 *     (click)="onAddBus()"
 *     class="btn btn-primary">
 *     Thêm xe
 *   </button>
 * 
 *   <!-- Table rows -->
 *   <table>
 *     <tr *ngFor="let bus of buses">
 *       <td>{{ bus.name }}</td>
 *       <td>
 *         <!-- Disable nếu không có quyền update -->
 *         <button
 *           [appAuthorized]="{ module: 'bus-management', action: 'update', mode: 'disable' }"
 *           (click)="onEditBus(bus)"
 *           class="btn btn-info">
 *           Sửa
 *         </button>
 *       </td>
 *       <td>
 *         <!-- Ẩn nếu không có quyền delete -->
 *         <button 
 *           *appAuthorized="{ module: 'bus-management', action: 'delete' }"
 *           (click)="onDeleteBus(bus)"
 *           class="btn btn-danger">
 *           Xóa
 *         </button>
 *       </td>
 *     </tr>
 *   </table>
 * </div>
 */

/**
 * EXAMPLE 2: User Management Service
 * 
 * import { Injectable, inject } from '@angular/core';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
 * import { RequiredRole, WithAuthorizationCheck } from '@rsApp/core/decorators/required-role.decorator';
 * 
 * @Injectable({ providedIn: 'root' })
 * export class UserManagementService extends WithAuthorizationCheck {
 *   constructor(protected roleAccessService = inject(RoleAccessService)) {
 *     super();
 *   }
 * 
 *   // Kiểm tra quyền tự động bằng decorator
 *   @RequiredRole({ 
 *     module: 'users-management', 
 *     action: 'create',
 *     errorMessage: 'Bạn không có quyền tạo user mới'
 *   })
 *   createUser(userData: any) {
 *     // API call
 *     return this.api.post('/users', userData);
 *   }
 * 
 *   @RequiredRole({
 *     module: 'users-management',
 *     action: 'delete',
 *     throwError: false // Return false nếu không có quyền
 *   })
 *   deleteUser(userId: string) {
 *     return this.api.delete(`/users/${userId}`);
 *   }
 * 
 *   // Kiểm tra ANY quyền
 *   @RequiredRole({
 *     module: 'users-management',
 *     actions: ['update', 'delete'],
 *     anyOf: true // User có update HOẶC delete
 *   })
 *   modifyUser(userId: string, data: any) {
 *     return this.api.put(`/users/${userId}`, data);
 *   }
 * }
 */

/**
 * EXAMPLE 3: Dialog Component
 * 
 * import { Component, inject } from '@angular/core';
 * import { MatDialogRef } from '@angular/material/dialog';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
 * 
 * @Component({
 *   selector: 'app-bus-detail-dialog',
 *   templateUrl: './bus-detail-dialog.component.html',
 *   styleUrls: ['./bus-detail-dialog.component.css']
 * })
 * export class BusDetailDialogComponent {
 *   private roleAccessService = inject(RoleAccessService);
 *   private dialogRef = inject(MatDialogRef<BusDetailDialogComponent>);
 *   
 *   canEditBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'update');
 *   canDeleteBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'delete');
 * 
 *   onSave(formData: any) {
 *     if (!this.canEditBus) {
 *       alert('Bạn không có quyền sửa xe');
 *       return;
 *     }
 *     // Save logic
 *   }
 * 
 *   onDelete() {
 *     if (!this.canDeleteBus) {
 *       alert('Bạn không có quyền xóa xe');
 *       return;
 *     }
 *     // Delete logic
 *   }
 * }
 * 
 * <!-- Template -->
 * <mat-dialog-content>
 *   <form>
 *     <!-- Form fields -->
 *   </form>
 * </mat-dialog-content>
 * 
 * <mat-dialog-actions align="end">
 *   <button mat-button (click)="dialogRef.close()">Hủy</button>
 *   
 *   <!-- Ẩn save nếu không có quyền -->
 *   <button 
 *     *appAuthorized="{ module: 'bus-management', action: 'update' }"
 *     mat-raised-button 
 *     color="primary" 
 *     (click)="onSave(form.value)">
 *     Lưu
 *   </button>
 *   
 *   <!-- Ẩn delete nếu không có quyền -->
 *   <button 
 *     *appAuthorized="{ module: 'bus-management', action: 'delete' }"
 *     mat-raised-button 
 *     color="warn" 
 *     (click)="onDelete()">
 *     Xóa
 *   </button>
 * </mat-dialog-actions>
 */

/**
 * ==========================================
 * 7. TESTING
 * ==========================================
 * 
 * import { TestBed } from '@angular/core/testing';
 * import { RoleAccessService } from '@rsApp/core/services/role-access.service';
 * import { CredentialService } from '@rsApp/shared/services/credential.service';
 * import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
 * import { ROLE_CONSTANTS } from '@rsApp/core/constants/roles.constants';
 * 
 * describe('RoleAccessService', () => {
 *   let service: RoleAccessService;
 *   let credentialService: CredentialService;
 * 
 *   beforeEach(() => {
 *     TestBed.configureTestingModule({});
 *     service = TestBed.inject(RoleAccessService);
 *     credentialService = TestBed.inject(CredentialService);
 *   });
 * 
 *   it('should allow admin to access all modules', async () => {
 *     // Mock admin user
 *     spyOn(credentialService, 'getCurrentUser').and.returnValue(
 *       Promise.resolve({
 *         id: '1',
 *         roles: [ROLE_CONSTANTS.ADMIN]
 *       })
 *     );
 * 
 *     expect(service.canAccessModule(MODULE_KEYS.BUS_MANAGEMENT)).toBe(true);
 *     expect(service.canAccessModule(MODULE_KEYS.USERS_MANAGEMENT)).toBe(true);
 *   });
 * 
 *   it('should restrict tenant-operator to specific modules', async () => {
 *     spyOn(credentialService, 'getCurrentUser').and.returnValue(
 *       Promise.resolve({
 *         id: '2',
 *         roles: [ROLE_CONSTANTS.TENANT_OPERATOR]
 *       })
 *     );
 * 
 *     expect(service.canAccessModule(MODULE_KEYS.BUS_SCHEDULE)).toBe(true);
 *     expect(service.canAccessModule(MODULE_KEYS.USERS_MANAGEMENT)).toBe(false);
 *   });
 * });
 */

/**
 * ==========================================
 * 8. BEST PRACTICES
 * ==========================================
 * 
 * ✓ Luôn kiểm tra quyền cả frontend AND backend
 * ✓ Sử dụng module keys từ hằng số thay vì string literals
 * ✓ Kiểm tra quyền sớm (guard trên route)
 * ✓ Ẩn UI elements không được phép thay vì throw error
 * ✓ Log unauthorized access attempts
 * ✓ Cache permission results để tối ưu hiệu năng
 * ✓ Refresh cache sau khi update user role
 * ✓ Sử dụng @RequiredRole decorator cho methods nhạy cảm
 * ✓ Cung cấp user feedback rõ ràng khi denied access
 * ✓ Định kỳ audit access logs
 */
