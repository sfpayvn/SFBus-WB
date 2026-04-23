# Role-Based Access Control (RBAC) - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    ROUTE PROTECTION                           │  │
│  │                  (RoleAccessGuard)                            │  │
│  │                                                               │  │
│  │  User requests /management/bus-management                    │  │
│  │         ↓                                                     │  │
│  │  Guard checks: user.roles has access to 'bus-management'?   │  │
│  │         ↓                                                     │  │
│  │  YES → Allow  │  NO → Redirect to /errors/403               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   COMPONENT LAYER                             │  │
│  │                                                               │  │
│  │  Component injects RoleAccessService                         │  │
│  │         ↓                                                     │  │
│  │  ngOnInit() {                                                │  │
│  │    this.canCreate = roleAccessService.canAction(             │  │
│  │      'bus-management', 'create'                              │  │
│  │    );                                                         │  │
│  │  }                                                            │  │
│  │         ↓                                                     │  │
│  │  Template uses [appAuthorized] directive                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                 TEMPLATE PROTECTION                           │  │
│  │              (AuthorizedDirective)                            │  │
│  │                                                               │  │
│  │  <button *appAuthorized="{                                   │  │
│  │    module: 'bus-management', action: 'create'                │  │
│  │  }">Add</button>                                              │  │
│  │         ↓                                                     │  │
│  │  Directive checks permission → Hide if denied                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  METHOD PROTECTION                            │  │
│  │            (@RequiredRole Decorator)                          │  │
│  │                                                               │  │
│  │  @RequiredRole({                                             │  │
│  │    module: 'bus-management', action: 'create'                │  │
│  │  })                                                           │  │
│  │  createBus(data) { ... }                                     │  │
│  │         ↓                                                     │  │
│  │  Decorator checks permission → Throw error if denied         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                                │
│                     (RoleAccessService)                             │
│                                                                     │
│  Methods:                                                           │
│  • canAccessModule(moduleKey) → boolean                            │
│  • canAction(moduleKey, action) → boolean                          │
│  • canActions(moduleKey, actions) → boolean (ALL)                 │
│  • canAnyAction(moduleKey, actions) → boolean (ANY)               │
│  • hasRole(roles) → boolean                                        │
│  • checkAccess(...) → { canAccess, reason }                       │
│                                                                     │
│  Cache:                                                             │
│  • permissionCache: Map<string, boolean>                           │
│  • Invalidated on: user role change, refreshCache() call          │
│                                                                     │
│  Data:                                                              │
│  • userRoles: string[] (from CredentialService)                   │
│  • permissionMatrix: ROLE_PERMISSIONS (from constants)             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      CONFIGURATION LAYER                            │
│                  (role-permissions.constant.ts)                     │
│                                                                     │
│  ROLE_PERMISSIONS = {                                              │
│    [admin]: {                                                       │
│      modules: [all modules],                                       │
│      functions: {                                                   │
│        'bus-management': ['create', 'read', 'update', 'delete']   │
│      }                                                              │
│    },                                                               │
│    [tenant]: {                                                      │
│      modules: [limited modules],                                   │
│      functions: { ... }                                            │
│    },                                                               │
│    ...                                                              │
│  }                                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flow Diagram

### Login → Access → Deny Flow

```
1. USER LOGIN
   ↓
   AuthService.login()
   ↓
   Token stored in cookies
   ↓
   User data stored in CredentialService

2. APP BOOTSTRAP
   ↓
   APP_INITIALIZER → AuthService.init()
   ↓
   RoleAccessService initializes with user roles
   ↓
   MenuService.reloadPagesAndExpand()
   ↓
   Navigate to /dashboard

3. ROUTE CHANGE
   ↓
   RoleAccessGuard.canActivate()
   ↓
   Check: user.roles has module access?
   ├─ YES → Continue to component
   └─ NO → Navigate /errors/403

4. COMPONENT RENDER
   ↓
   RoleAccessService checks permissions
   ├─ Set canCreate, canUpdate, canDelete
   ├─ Template renders with directives
   └─ Buttons/Forms shown/hidden/disabled

5. USER ACTION
   ├─ Click button
   │  ↓
   │  [appAuthorized] directive
   │  ├─ Directive check permission (already done)
   │  └─ Element hide/disable if needed
   │
   ├─ Call method
   │  ↓
   │  Service method with @RequiredRole
   │  ├─ Decorator checks permission
   │  └─ Execute or throw error
   │
   └─ API Call
      ↓
      ApiGatewayService adds headers:
      ├─ X-Feature-Module: bus-management
      └─ X-Feature-Function: create-bus
      ↓
      Backend validates quyền lại
      ├─ 200 → Success
      ├─ 403 → Forbidden
      └─ 429 → Quota exceeded
```

---

## 📊 Class Diagram

```
┌─────────────────────────────────┐
│    CredentialService            │
├─────────────────────────────────┤
│ - cookies: CookieService        │
├─────────────────────────────────┤
│ + getCurrentUser(): User        │
│ + setCurrentUser(user)          │
│ + getToken(): string            │
│ + setToken(token)               │
└─────────────────────────────────┘
         ▲
         │ uses
         │
         │
┌─────────────────────────────────────────────────┐
│         RoleAccessService                       │
├─────────────────────────────────────────────────┤
│ - credentialService: CredentialService          │
│ - userRolesCache: Signal<string[]>              │
│ - permissionCache: Map<string, boolean>         │
├─────────────────────────────────────────────────┤
│ + canAccessModule(moduleKey): boolean           │
│ + canAction(moduleKey, action): boolean         │
│ + canActions(moduleKey, actions): boolean       │
│ + canAnyAction(moduleKey, actions): boolean     │
│ + hasRole(roles): boolean                       │
│ + checkAccess(...): RoleAccessCheckResult       │
│ + refreshCache(): void                          │
│ + canAccessModule$(moduleKey): Observable       │
│ + canAction$(moduleKey, action): Observable     │
└─────────────────────────────────────────────────┘
         ▲              ▲
         │ uses         │ uses
         │              │
         │              │
┌────────────────────┐  ┌──────────────────────┐
│  RoleAccessGuard   │  │  AuthorizedDirective │
├────────────────────┤  ├──────────────────────┤
│ + canActivate()    │  │ + appAuthorized      │
└────────────────────┘  └──────────────────────┘
         ▲                       ▲
         │ implements            │ uses
         │                       │
         │              ┌────────────────────┐
         │              │WithAuthorizationCheck
         │              ├────────────────────┤
         │              │@RequiredRole       │
         │              └────────────────────┘
         │
     CanActivate (Angular Interface)


┌────────────────────────────────────────────┐
│     ROLE_PERMISSIONS Configuration         │
├────────────────────────────────────────────┤
│ {                                          │
│   admin: {                                 │
│     modules: [all],                        │
│     functions: { [module]: [actions] }     │
│   },                                       │
│   tenant: { ... },                         │
│   operator: { ... },                       │
│   ...                                      │
│ }                                          │
└────────────────────────────────────────────┘
         ▲
         │ uses
         │
    RoleAccessService
```

---

## 🔐 Permission Evaluation Algorithm

```
canAction(moduleKey, action) {
  1. Check cache first
     if (cache.has(key)) return cache.get(key)
  
  2. Get user roles
     const userRoles = this.userRolesCache()
     if (!userRoles || empty) return false
  
  3. For each user role
     for (role of userRoles) {
       const rolePerms = ROLE_PERMISSIONS[role]
       const moduleFuncs = rolePerms.functions[moduleKey]
       
       if (moduleFuncs && moduleFuncs.includes(action)) {
         cache.set(key, true)
         return true
       }
     }
  
  4. No role has permission
     cache.set(key, false)
     return false
}

Time Complexity: O(n + m)
  n = number of user roles (typically 1-3)
  m = number of allowed actions (typically 5)

Space Complexity: O(k)
  k = cache size (bounded by unique permission checks)
```

---

## 🎯 Decision Tree

```
User requests route
       │
       ├─ Has valid token?
       │  ├─ NO → Redirect /auth/login
       │  └─ YES → Continue
       │
       ├─ User roles loaded?
       │  ├─ NO → Wait for initialization
       │  └─ YES → Continue
       │
       ├─ Route has moduleKey?
       │  ├─ NO → Allow (public route)
       │  └─ YES → Continue
       │
       ├─ User has module access?
       │  ├─ NO → Redirect /errors/403
       │  └─ YES → Continue
       │
       └─ Component renders
          │
          ├─ Button with *appAuthorized?
          │  ├─ User has action permission?
          │  │  ├─ NO → Hide/Disable element
          │  │  └─ YES → Show element
          │  └─ Click triggered
          │
          └─ Method with @RequiredRole?
             ├─ User has permission?
             │  ├─ NO → Throw error / Return false
             │  └─ YES → Execute method
             │
             └─ API Call
                ├─ Backend validates again
                │  ├─ NO → 403 Forbidden
                │  └─ YES → 200 Success
                │
                └─ Update UI
```

---

## 📈 Cache Strategy

```
Cache Hit Scenario:
  1st call:  canAction('buses', 'create')
    └─ Compute: O(n) → cache miss
    └─ Store in cache
    
  2nd call:  canAction('buses', 'create')
    └─ Lookup: O(1) → cache hit
    └─ Return cached value
    
  3rd call:  canAction('buses', 'update')
    └─ Lookup: O(1) → cache hit
    └─ Return cached value

Cache Invalidation:
  - onUserRoleChanged() → refreshCache()
  - onLogout() → refreshCache()
  - onPermissionUpdate() → refreshCache()

Cache Key Format:
  - module:{moduleKey}
  - action:{moduleKey}:{action}

Example:
  - module:bus-management
  - action:bus-management:create
  - action:bus-management:delete
```

---

## 🌐 Data Flow Diagram

```
Browser
  │
  ├─ Local Storage
  │  ├─ theme preference
  │  └─ other app state
  │
  ├─ Cookies
  │  ├─ token (JWT)
  │  └─ user (serialized JSON)
  │
  └─ HTTP Requests
     │
     ├─ Header: Authorization: Bearer {token}
     ├─ Header: X-Feature-Module: bus-management
     ├─ Header: X-Feature-Function: list-buses
     │
     └─ API Gateway Service
        │
        ├─ Request Interceptor
        │  ├─ Add headers
        │  └─ Add quota tracking
        │
        ├─ Response Interceptor
        │  ├─ Handle 403 Forbidden
        │  ├─ Handle 429 Quota Exceeded
        │  └─ Log errors
        │
        └─ Backend Server
           │
           ├─ Validate token
           ├─ Extract user roles
           ├─ Check X-Feature-Module in user permissions
           ├─ Check X-Feature-Function allowed actions
           ├─ Execute business logic
           │
           └─ Response
              ├─ 200 OK (allowed)
              ├─ 403 Forbidden (denied)
              ├─ 429 Too Many Requests (quota)
              └─ 500 Server Error (internal)
```

---

## 🔒 Security Layers

```
Layer 1: Route Guard
  ├─ Check module access
  ├─ Redirect if denied
  └─ Prevent unauthorized navigation

Layer 2: Template Directive
  ├─ Hide/disable UI elements
  ├─ Prevent accidental clicks
  └─ Visual feedback

Layer 3: Component Logic
  ├─ Check permission before action
  ├─ Show error message
  └─ Prevent invalid submissions

Layer 4: Backend Validation
  ├─ Validate token
  ├─ Check user roles
  ├─ Validate module access
  ├─ Validate action permission
  └─ Log unauthorized attempts

⚠️ NEVER trust frontend-only security!
   Always validate backend as well.
```

---

## 📊 Permission Matrix Structure

```
ROLE_PERMISSIONS {
  ├─ admin
  │  ├─ modules: [users-mgmt, bus-mgmt, ...]
  │  └─ functions:
  │     ├─ users-mgmt: [list, create, update, delete, view]
  │     ├─ bus-mgmt: [list, create, update, delete, view]
  │     └─ ...
  │
  ├─ tenant
  │  ├─ modules: [bus-mgmt, goods-mgmt, ...]
  │  └─ functions:
  │     ├─ bus-mgmt: [list, create, update, delete, view]
  │     └─ ...
  │
  ├─ tenant-operator
  │  ├─ modules: [bus-schedule, ...]
  │  └─ functions:
  │     └─ bus-schedule: [list, create, update, delete, view]
  │
  ├─ driver
  │  ├─ modules: [bus-schedule, ...]
  │  └─ functions:
  │     └─ bus-schedule: [list, view]
  │
  ├─ client
  │  ├─ modules: [booking-mgmt, ...]
  │  └─ functions:
  │     └─ booking-mgmt: [list, create, view]
  │
  └─ pos
     ├─ modules: [booking-mgmt, ...]
     └─ functions:
        └─ booking-mgmt: [list, create, update, delete, view]
}
```

---

**Architecture Design:** Senior-level, production-ready RBAC system  
**Last Updated:** January 14, 2026
