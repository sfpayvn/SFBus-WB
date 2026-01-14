/**
 * QUICK SETUP - ROLE-BASED ACCESS CONTROL
 * 
 * ✓ Only modify constants to control access
 * ✓ No need to touch guard logic
 * ✓ Works automatically with routing
 */

// ==========================================
// STEP 1: Add moduleKey to route
// ==========================================

// File: src/app/app-routing.module.ts
import { MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';
import { RoleAccessGuard } from '@rsApp/guards/role-access.guard';

const routes = [
  {
    path: 'management',
    canActivate: [RoleAccessGuard],  // ← Add guard here
    children: [
      {
        path: 'bus-management',
        component: BusManagementComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.BUS_MANAGEMENT }  // ← Add this
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleAccessGuard],
        data: { moduleKey: MODULE_KEYS.USERS_MANAGEMENT }  // ← Add this
      },
    ]
  }
];

// ==========================================
// STEP 2: Control access via constants
// ==========================================

// File: src/app/core/constants/role-permissions.constant.ts

// If you want TENANT to access bus-management:
export const ROLE_PERMISSIONS = {
  [ROLE_CONSTANTS.TENANT]: {
    modules: [
      MODULE_KEYS.BUS_MANAGEMENT,  // ← Tenant can access this
      MODULE_KEYS.GOODS_MANAGEMENT,
    ],
    functions: {
      [MODULE_KEYS.BUS_MANAGEMENT]: ALL_ACTIONS,  // ← Can do create/read/update/delete
    }
  }
};

// If you want TENANT_OPERATOR to be READ-ONLY:
export const ROLE_PERMISSIONS = {
  [ROLE_CONSTANTS.TENANT_OPERATOR]: {
    modules: [
      MODULE_KEYS.BUS_MANAGEMENT,  // ← Can access
    ],
    functions: {
      [MODULE_KEYS.BUS_MANAGEMENT]: READ_ONLY_ACTIONS,  // ← Only list/view
    }
  }
};

// ==========================================
// STEP 3: Done!
// ==========================================

// No changes needed anywhere else!
// - Guard handles permission checking automatically
// - Components can use RoleAccessService if needed
// - Route is now protected based on constants

// ==========================================
// EXTRA: Quick Permission Change Examples
// ==========================================

// Example 1: Remove module access
// BEFORE: modules: ['bus-management', 'users-management']
// AFTER: modules: ['bus-management']  ← Removed users-management
// Result: Role can't access /management/users anymore

// Example 2: Change action permissions
// BEFORE: [MODULE_KEYS.USERS]: ALL_ACTIONS
// AFTER: [MODULE_KEYS.USERS]: READ_ONLY_ACTIONS
// Result: Role can list/view users but can't create/update/delete

// Example 3: Add new role permission
// [NEW_ROLE]: {
//   modules: [MODULE_KEYS.BUSES],
//   functions: {
//     [MODULE_KEYS.BUSES]: ['list', 'view']  // Minimal access
//   }
// }

// ==========================================
// API REFERENCE (in Components)
// ==========================================

// Service methods you can use if needed:
constructor(private roleAccess: RoleAccessService) {}

// Check module access
if (this.roleAccess.canAccessModule('bus-management')) { }

// Check action
if (this.roleAccess.canAction('bus-management', 'create')) { }

// Check multiple actions (ALL must be true)
if (this.roleAccess.canActions('bus-management', ['create', 'update'])) { }

// Check ANY action (at least 1 must be true)
if (this.roleAccess.canAnyAction('bus-management', ['create', 'update', 'delete'])) { }

// Check user role
if (this.roleAccess.hasRole('admin')) { }

// Get detailed result with reason
const result = this.roleAccess.checkAccess('bus-management', 'create');
console.log(result.canAccess, result.reason);
