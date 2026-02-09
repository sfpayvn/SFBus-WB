/**
 * BUS MANAGEMENT COMPONENT - REAL-WORLD EXAMPLE
 * 
 * Đây là ví dụ hoàn chỉnh cách sử dụng Role-Based Access Control
 * Bao gồm:
 * - Route guard
 * - Service injection
 * - Template directives
 * - Method protection
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

// Services
import { RoleAccessService } from '@rsApp/core/services/role-access.service';
import { ApiGatewayService } from '@rsApp/api-gateway/api-gateaway.service';

// Constants
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
import { ROLE_CONSTANTS } from '@rsApp/core/constants/roles.constants';

// Directive
import { AuthorizedDirective } from '@rsApp/core/directives/authorized.directive';

// Model
interface Bus {
  id: string;
  name: string;
  licensePlate: string;
  type: string;
  capacity: number;
  createdAt: string;
}

@Component({
  selector: 'app-bus-management-example',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    AuthorizedDirective, // ← Thêm directive vào imports
  ],
  template: `
    <div class="bus-management-container p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Quản lý Xe Buýt</h1>

        <!-- Add Button - Ẩn nếu user không có quyền create -->
        <button
          *appAuthorized="{ module: 'bus-management', action: 'create' }"
          (click)="onAddBus()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <i class="icon-plus"></i> Thêm xe
        </button>
      </div>

      <!-- Permissions Info (Development only) -->
      <div class="mb-4 p-4 bg-gray-100 rounded" *ngIf="isDebugMode">
        <h3 class="font-semibold mb-2">📋 Quyền hiện tại:</h3>
        <ul class="text-sm">
          <li>
            Quyền Create: <strong>{{ canCreateBus ? '✓ Có' : '✗ Không' }}</strong>
          </li>
          <li>
            Quyền Update: <strong>{{ canUpdateBus ? '✓ Có' : '✗ Không' }}</strong>
          </li>
          <li>
            Quyền Delete: <strong>{{ canDeleteBus ? '✓ Có' : '✗ Không' }}</strong>
          </li>
          <li>
            Current Roles: <strong>{{ currentUserRoles.join(', ') }}</strong>
          </li>
        </ul>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead class="bg-gray-200">
            <tr>
              <th class="border p-2 text-left">Tên xe</th>
              <th class="border p-2 text-left">Biển số</th>
              <th class="border p-2 text-left">Loại</th>
              <th class="border p-2 text-left">Sức chứa</th>
              <th class="border p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bus of buses" class="hover:bg-gray-50">
              <td class="border p-2">{{ bus.name }}</td>
              <td class="border p-2">{{ bus.licensePlate }}</td>
              <td class="border p-2">{{ bus.type }}</td>
              <td class="border p-2 text-center">{{ bus.capacity }}</td>
              <td class="border p-2 text-center action-column">
                <!-- View Button - Luôn hiển thị -->
                <button
                  (click)="onViewBus(bus)"
                  class="px-2 py-1 bg-gray-500 text-white rounded text-sm mr-2 hover:bg-gray-600"
                >
                  Xem
                </button>

                <!-- Update Button - Disable nếu không có quyền -->
                <button
                  [appAuthorized]="{
                    module: 'bus-management',
                    action: 'update',
                    mode: 'disable',
                    fallbackText: 'Bạn không có quyền sửa thông tin xe'
                  }"
                  (click)="onEditBus(bus)"
                  class="px-2 py-1 bg-blue-500 text-white rounded text-sm mr-2 hover:bg-blue-600"
                >
                  Sửa
                </button>

                <!-- Delete Button - Ẩn nếu không có quyền -->
                <button
                  *appAuthorized="{ module: 'bus-management', action: 'delete' }"
                  (click)="onDeleteBus(bus)"
                  class="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6">
        <mat-paginator
          [length]="totalCount"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25, 100]"
          (page)="onPageChange($event)"
        ></mat-paginator>
      </div>
    </div>
  `,
  styles: [
    `
      .bus-management-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .action-column {
        white-space: nowrap;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class BusManagementExampleComponent implements OnInit {
  // Services
  private roleAccessService = inject(RoleAccessService);
  private apiGateway = inject(ApiGatewayService);
  private dialog = inject(MatDialog);

  // State
  buses: Bus[] = [];
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;

  // Permissions
  canCreateBus = false;
  canUpdateBus = false;
  canDeleteBus = false;
  canListBuses = false;

  // Debug
  isDebugMode = true;
  currentUserRoles: string[] = [];

  ngOnInit(): void {
    this.initializePermissions();
    this.loadBuses();
  }

  /**
   * Khởi tạo permissions
   */
  private initializePermissions(): void {
    // Kiểm tra quyền cho từng action
    this.canCreateBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create');
    this.canUpdateBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'update');
    this.canDeleteBus = this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'delete');
    this.canListBuses = this.roleAccessService.canAccessModule(MODULE_KEYS.BUSES);

    // Lấy current user roles
    this.currentUserRoles = this.roleAccessService.getUserRoles();

    console.log('🔐 Permissions initialized:', {
      canCreateBus: this.canCreateBus,
      canUpdateBus: this.canUpdateBus,
      canDeleteBus: this.canDeleteBus,
      canListBuses: this.canListBuses,
      userRoles: this.currentUserRoles,
    });
  }

  /**
   * Load danh sách xe
   */
  private loadBuses(): void {
    if (!this.canListBuses) {
      console.warn('❌ User không có quyền xem danh sách xe');
      return;
    }

    // Mock data
    this.buses = [
      {
        id: '1',
        name: 'Xe Buýt A1',
        licensePlate: '29A-12345',
        type: 'Giường nằm',
        capacity: 40,
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        name: 'Xe Buýt B2',
        licensePlate: '30B-67890',
        type: 'Ghế ngồi',
        capacity: 50,
        createdAt: '2024-01-02',
      },
    ];
    this.totalCount = 100;
  }

  /**
   * Thêm xe
   */
  onAddBus(): void {
    // Kiểm tra quyền trước khi mở dialog
    if (!this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'create')) {
      alert('❌ Bạn không có quyền thêm xe');
      console.warn('Unauthorized: Create Bus');
      return;
    }

    console.log('✓ Opening add bus dialog');
    // TODO: Mở dialog thêm xe
  }

  /**
   * Xem chi tiết xe
   */
  onViewBus(bus: Bus): void {
    console.log('👁️ Viewing bus:', bus);
    // TODO: Mở dialog xem chi tiết
  }

  /**
   * Sửa xe
   */
  onEditBus(bus: Bus): void {
    // Manual check
    const permission = this.roleAccessService.checkAccess(MODULE_KEYS.BUSES, undefined, 'update');

    if (!permission.canAccess) {
      alert(`❌ ${permission.reason}`);
      console.warn('Unauthorized: Edit Bus', permission);
      return;
    }

    console.log('✏️ Editing bus:', bus);
    // TODO: Mở dialog sửa xe
  }

  /**
   * Xóa xe
   */
  onDeleteBus(bus: Bus): void {
    if (!this.roleAccessService.canAction(MODULE_KEYS.BUSES, 'delete')) {
      alert('❌ Bạn không có quyền xóa xe');
      return;
    }

    if (confirm(`Bạn chắc chắn muốn xóa xe "${bus.name}"?`)) {
      console.log('🗑️ Deleting bus:', bus.id);
      // TODO: Gọi API xóa
    }
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadBuses();
  }
}

/**
 * ===================================================================
 * USAGE IN ROUTING
 * ===================================================================
 * 
 * const routes: Routes = [
 *   {
 *     path: 'buses',
 *     component: BusManagementExampleComponent,
 *     canActivate: [RoleAccessGuard],
 *     data: { moduleKey: 'bus-management' }
 *   }
 * ];
 */

/**
 * ===================================================================
 * HOW IT WORKS
 * ===================================================================
 * 
 * 1. ROUTE GUARD (RoleAccessGuard)
 *    - Kiểm tra user có quyền truy cập route không
 *    - Nếu không → Redirect /errors/403
 * 
 * 2. COMPONENT INIT (ngOnInit)
 *    - Kiểm tra từng permission (create, update, delete)
 *    - Lưu vào properties để dùng trong template
 * 
 * 3. TEMPLATE DIRECTIVE (*appAuthorized)
 *    - Ẩn/disable buttons dựa trên permission
 *    - Hide: Nếu không có quyền → không hiển thị
 *    - Disable: Nếu không có quyền → disable button
 * 
 * 4. METHOD PROTECTION
 *    - Kiểm tra quyền trước khi gọi method
 *    - Nếu không có quyền → hiển thị error hoặc return early
 * 
 * 5. API CALL
 *    - Gửi X-Feature-Module và X-Feature-Function headers
 *    - Backend kiểm tra lại quyền (luôn kiểm tra cả 2 sides)
 */
