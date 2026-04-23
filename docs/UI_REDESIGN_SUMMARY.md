# 🎨 Account Information Module - UI Redesigned

## 🔄 Thay đổi từ UI cũ sang UI mới

### ❌ UI cũ (Đơn giản, basic)
- Single page form layout
- Tất cả field trên 1 trang dài
- Không có tab separation

### ✅ UI mới (Tương tự user-detail)
- **Tabset card layout** - Tương tự UserDetailComponent
- **Tab 1: Thông tin cơ bản** - Chỉnh sửa tên, email, phone, địa chỉ, etc
- **Tab 2: Thay đổi mật khẩu** - Change password với validation yêu cầu

---

## 📁 Cấu trúc mới

```
src/app/modules/account-information/
├── account-information.module.ts              ✅ Updated declarations
├── account-information-routing.module.ts
├── README.md
│
├── model/
│   └── account-information.model.ts
│
├── services/
│   └── account-information.service.ts         ✅ Added changePassword()
│
└── pages/
    └── account-detail/
        ├── account-detail.component.ts        ✅ Refactored (simplified)
        ├── account-detail.component.html      ✅ Now uses tabset
        ├── account-detail.component.scss      ✅ Simplified
        └── components/
            ├── account-info/                  ✨ NEW
            │   ├── account-info.component.ts
            │   ├── account-info.component.html
            │   └── account-info.component.scss
            └── account-password/              ✨ NEW
                ├── account-password.component.ts
                ├── account-password.component.html
                └── account-password.component.scss
```

---

## 🎯 Tính năng chi tiết

### **Tab 1: Thông tin cơ bản (account-info component)**

#### Avatar Section (40% chiều rộng)
- Avatar display (h-28 w-28, rounded-full, dashed border)
- Popover menu với 2 options:
  - 📤 **Tập tin cục bộ** - Upload từ máy tính
  - 🎨 **Trung tâm phương tiện** - Chọn từ media center
- 🗑️ **Xoá ảnh** button (khi có ảnh)

#### Form Fields (60% chiều rộng)
- **First Name** (w-full, required)
- **Last Name** (w-full, required)
- **Email** (w-6/12, required, readonly)
- **Phone** (w-6/12, required, pattern validation)
- **Gender** (w-6/12, optional, dropdown)
- **Date of Birth** (w-6/12, optional, date picker)
- **Address** (w-full, optional, textarea 2 rows)

#### Styling Pattern
- Height: `!min-h-[96px]` - Unified spacing
- Border radius: `!rounded` (0.5rem)
- Border color: `border-gray-200`
- Clear buttons: Clear icon appears on input
- Error messages: `!text-xs text-red-500`

#### Action Buttons
- **Reset** - Reset to original values
- **Lưu thay đổi** - Save (disabled if no changes or form invalid)

---

### **Tab 2: Thay đổi mật khẩu (account-password component)**

#### Password Input Section
- Label: "Mật khẩu mới"
- Type toggle: Eye icon to show/hide password
- Placeholder: "Nhập mật khẩu mới"

#### Password Requirements (Requirements box)
- Styled as rounded bordered box with gray background
- Real-time checklist with 5 conditions:
  - ✓ Tối thiểu 8 ký tự
  - ✓ Ít nhất một chữ cái viết hoa và viết thường (Aa)
  - ✓ Ít nhất một chữ số (0-9)
  - ✓ Ít nhất một ký tự đặc biệt: ! @ # $ % ^ & * ( ) _ + -
  - ✓ Không chứa khoảng trắng

#### Validation Status
- Green text (text-green-600) when condition met
- Gray text (text-gray-400) when not met
- Real-time update as user types

#### Action Buttons
- **Hủy** - Reset form
- **Thay đổi mật khẩu** - Submit (disabled if no changes or form invalid)

---

## 💻 Component Architecture

### AccountDetailComponent (Parent)
```typescript
// Responsibilities:
- Load current user from API
- Pass data to child components via @Input
- Back button navigation
```

### AccountInfoComponent (Child - Tab 1)
```typescript
// Responsibilities:
- Form management for user info
- Avatar upload & file center integration
- Save user information
- Dirty check & reset functionality
- @Input accountInformation: AccountInformation
```

### AccountPasswordComponent (Child - Tab 2)
```typescript
// Responsibilities:
- Password form with validation
- Real-time password condition checking
- Password visibility toggle
- Change password API call
- Independent from account info
```

---

## 🎨 Styling Details

### Consistent with UserDetail
- `nz-tabset [nzType]="card"` - Card styled tabs
- `nz-form-item class="!min-h-[96px]"` - Unified form item height
- `nz-input-group class="!h-[36px]"` - Input height 36px
- `border-gray-200` - Subtle gray border
- Clear icons with `ant-input-clear-icon`
- Error tips template pattern `[nzErrorTip]="template"`

### Color Scheme
- Primary: `#1890ff` (Blue)
- Success: `#52c41a` (Green)
- Error: `#ff4d4f` (Red)
- Borders: `#d9d9d9` (Gray 200)
- Hover: `#40a9ff` (Light blue)
- Background: `#f5f5f5` (Gray 50)

### Responsive Layout
- Avatar Section: `w-4/12` (40%)
- Form Section: `w-8/12` (60%)
- Full width form items: `!w-full`
- Half width form items: `w-6/12`

---

## 📊 Comparison with Original

| Aspect | Original | New |
|--------|----------|-----|
| Layout | Single long form | Tabset with multiple tabs |
| Avatar | Inline with form | Large circle, left side (40%) |
| Form fields | All together | Right side (60%), organized |
| Password change | Not included | Dedicated tab with validation |
| Styling | Basic cards | Professional user-detail style |
| Form validation | Simple | Password requirements checklist |
| Responsiveness | Fixed | Grid-based (4-12, 6-12, 8-12) |

---

## 🔌 API Integration

### Endpoints Used:
```typescript
// Get current user
GET /users/current

// Update user info
PUT /users/current

// Upload avatar
POST /users/current/avatar

// Change password (NEW)
POST /users/current/change-password
```

### Feature Tracking:
All requests tracked with:
```typescript
feature: { 
  module: 'account-information', 
  function: '[operation-name]' 
}
```

---

## ✨ Features

### Account Info Tab
- ✅ Avatar upload (local or media center)
- ✅ Avatar preview before save
- ✅ Remove avatar functionality
- ✅ Form validation with error messages
- ✅ Clear buttons on inputs
- ✅ Dirty check (only enable save if changed)
- ✅ Reset to original values
- ✅ Date picker (no future dates)
- ✅ Email readonly field
- ✅ Loading states
- ✅ Success/error notifications

### Password Tab
- ✅ Password visibility toggle
- ✅ Real-time password validation
- ✅ Visual requirement checklist
- ✅ 5 password conditions
- ✅ Dirty check
- ✅ Loading state on submit
- ✅ Error handling with toast notifications
- ✅ Auto reset after success

---

## 📦 Module Dependencies

```typescript
imports: [
  CommonModule,
  FormsModule,              // For password visibility toggle
  ReactiveFormsModule,      // Form builder & validation
  AccountInformationRoutingModule,
  ManagementSharedModule,   // Shared pipes, directives
  MaterialModule,           // ng-zorro components & Material
]

declarations: [
  AccountDetailComponent,    // Main page with tabs
  AccountInfoComponent,      // Tab: User info
  AccountPasswordComponent,  // Tab: Change password
]
```

---

## 🚀 Usage

### Access the page:
```
http://localhost:4200/account-information
```

### In navigation menu (optional):
```typescript
// Add to src/app/core/constants/menu.ts
{
  icon: 'assets/icons/heroicons/outline/user.svg',
  label: 'My Account',
  route: '/account-information',
  moduleKey: MODULE_KEYS.ACCOUNT_INFORMATION,
}
```

---

## 🔄 Data Flow

```
AccountDetailComponent (Parent)
    ├─ Load current user via API
    ├─ Pass accountInformation to:
    │   ├─ AccountInfoComponent
    │   └─ AccountPasswordComponent (no @Input needed)
    │
    ├─ Tab 1: AccountInfoComponent
    │   ├─ Form with user data
    │   ├─ Avatar upload & preview
    │   └─ Save user info → Update parent state
    │
    └─ Tab 2: AccountPasswordComponent
        ├─ Password form
        ├─ Real-time validation
        └─ Change password → Show success toast
```

---

## ✅ Status

- ✅ Components created (3)
- ✅ Services updated (changePassword method)
- ✅ Module declarations updated
- ✅ Styling implemented (tương tự user-detail)
- ✅ Tabset layout
- ✅ Password validation with checklist
- ✅ Avatar management
- ✅ 0 compilation errors
- ✅ Ready to use

---

## 📝 Files Modified/Created

### New Files:
- `account-info/account-info.component.ts`
- `account-info/account-info.component.html`
- `account-info/account-info.component.scss`
- `account-password/account-password.component.ts`
- `account-password/account-password.component.html`
- `account-password/account-password.component.scss`

### Modified Files:
- `account-detail/account-detail.component.ts` - Refactored to parent
- `account-detail/account-detail.component.html` - Now uses tabset
- `account-detail/account-detail.component.scss` - Simplified
- `account-information.module.ts` - Added declarations
- `account-information.service.ts` - Added changePassword()

---

## 🎓 UI Pattern Matching

This redesign follows the **exact same pattern** as:
- **Location**: `src/app/modules/management/modules/user-management/pages/user-detail/`
- **Pattern**: Tab-based layout with component separation
- **Styling**: Consistent card design, form item heights, border colors
- **Validation**: Real-time feedback with error messages
