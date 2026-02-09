import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { User, UserAddress } from '../../model/user.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { RoleAccessService } from '@rsApp/core/services/role-access.service';
import { CredentialService } from '@rsApp/shared/services/credential.service';
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
import _ from 'lodash';
import { Driver } from '../../model/driver.model';
import { ROLE_CONSTANTS, ROLE_LABELS } from '@rsApp/core/constants/roles.constants';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  standalone: false,
})
export class UserDetailComponent implements OnInit {
  user!: User;
  userRole: string = ROLE_CONSTANTS.CLIENT;
  userRoleLabel = ROLE_LABELS;

  addresses!: UserAddress[];
  showDriverTab: boolean = false;

  private roleAccessService = inject(RoleAccessService);
  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private utilsModal: UtilsModal,
    private credentialService: CredentialService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['user']) {
      this.user = params['user'] ? JSON.parse(params['user']) : null;
    }
    if (params && params['userRole']) {
      this.userRole = params['userRole'] ? params['userRole'] : ROLE_CONSTANTS.CLIENT;

      // Kiểm tra permission: User có quyền view/edit users của role này không?
      const canManageUsers = await this.checkUserRolePermission(this.userRole);
      if (!canManageUsers) {
        // Nếu không có quyền → Redirect tới 403
        this.router.navigate(['/errors/403']);
        return;
      }
    }
  }

  /**
   * Kiểm tra xem current user có quyền quản lý users của role chỉ định không
   * @param role - Role của user cần check (client, driver, tenant, etc.)
   * @returns true nếu current user có quyền
   */
  private async checkUserRolePermission(role: string): Promise<boolean> {
    // Kiểm tra role-based permission cho users management
    const hasUserManagementAccess = this.roleAccessService.canAccessModule(MODULE_KEYS.USERS_MANAGEMENT);
    
    if (!hasUserManagementAccess) {
      return false; // Không có quyền quản lý users
    }

    // Additional role-specific checks
    // Ví dụ: Tenant chỉ có thể quản lý users của role khác, không phải tenant
    const currentUserRoles = await this.getCurrentUserRoles();
    
    if (currentUserRoles.includes(ROLE_CONSTANTS.TENANT) && role === ROLE_CONSTANTS.TENANT) {
      // Tenant không thể edit/view Tenant users (chỉ có thể view/manage CLIENT, DRIVER, POS)
      return false;
    }

    return true;
  }

  /**
   * Lấy roles của current user
   */
  private async getCurrentUserRoles(): Promise<string[]> {
    try {
      // Giả sử có method để get current user roles
      // Nếu không có, sử dụng inject CredentialService
      const currentUser = await this.credentialService.getCurrentUser();
      return currentUser?.roles || [];
    } catch (error) {
      console.error('Error getting current user roles:', error);
      return [];
    }
  }

  backPage() {
    this.location.back();
  }

  onRolesChange(roles: string[]) {
    this.showDriverTab = roles.includes('driver');
  }

  onCreateUser(user: User) {
    this.user = user;
    this.onRolesChange(this.user.roles || []);
  }
}
