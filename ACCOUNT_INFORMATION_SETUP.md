# 📝 Hướng dẫn sử dụng Account Information Module

## 🎯 Tổng quan

Module `account-information` được tạo để cho phép người dùng xem và chỉnh sửa thông tin tài khoản cá nhân.

## 📁 Cấu trúc thư mục

```
src/app/modules/account-information/
├── account-information.module.ts              ← Module chính
├── account-information-routing.module.ts      ← Routing configuration
├── README.md                                  ← Tài liệu module
│
├── model/
│   └── account-information.model.ts          ← TypeScript interfaces
│       ├── AccountInformation
│       └── AccountInformation2Update
│
├── services/
│   └── account-information.service.ts        ← API Gateway calls
│       ├── getCurrentUser()
│       ├── updateCurrentUser()
│       └── uploadAvatar()
│
└── pages/
    └── account-detail/
        ├── account-detail.component.ts       ← Logic (217 lines)
        ├── account-detail.component.html     ← Template (303 lines)
        └── account-detail.component.scss     ← Styles
```

## ✨ Tính năng chính

### 1. **Chỉnh sửa thông tin người dùng**
- ✅ Tên & Họ (bắt buộc, min 2 ký tự)
- ✅ Email (chỉ đọc, không thể thay đổi)
- ✅ Số điện thoại (bắt buộc, validate format)
- ✅ Giới tính (dropdown: Nam, Nữ, Khác)
- ✅ Ngày sinh (date picker, không chọn ngày tương lai)
- ✅ Địa chỉ (textarea, 3 rows)

### 2. **Quản lý Avatar**
- 📸 Upload ảnh từ máy tính
- 🗑️ Xoá ảnh hiện tại
- ✅ Validate: max 5MB, chỉ hình ảnh (jpg, png, webp)
- 👁️ Preview ảnh trước submit
- 🔄 Display placeholder khi không có ảnh

### 3. **Validation & User Experience**
- ✅ Real-time form validation
- ✅ Error messages chi tiết
- ✅ Dirty check (phát hiện thay đổi)
- ✅ Nút lưu chỉ enable khi form valid
- ✅ Clear buttons cho mỗi input
- ✅ Toast notifications (success/error/info)
- ✅ Loading state trong khi submit

## 🔌 API Integration

Tất cả request đi qua `ApiGatewayService`:

```typescript
// Get current user info
GET /users/current
→ Returns: AccountInformation

// Update user info
PUT /users/current
Body: AccountInformation2Update
→ Returns: AccountInformation

// Upload avatar
POST /users/current/avatar
Body: FormData with file
→ Returns: { avatarUrl: string }
```

## 🎨 Styling Pattern

Module tuân theo styling pattern của project:

### Ng-Zorro Components
```html
<nz-form-item>
  <nz-form-label [nzRequired]="true">Label</nz-form-label>
  <nz-form-control [nzErrorTip]="errorTpl">
    <nz-input-group [nzSuffix]="clearTpl">
      <input nz-input formControlName="field" />
    </nz-input-group>
  </nz-form-control>
</nz-form-item>
```

### Tailwind Classes
- `flex`, `grid`, `gap-6` - Flexbox/Grid layout
- `bg-white`, `bg-gray-50` - Background colors
- `border`, `rounded-lg` - Borders & rounded corners
- `px-4`, `py-2` - Padding
- `text-sm`, `font-medium` - Typography

### SCSS Customization
```scss
.ant-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

textarea {
  resize: none;
  font-family: -apple-system, ...;
}
```

## 🚀 Cách sử dụng

### 1. Module đã được tạo và routing đã configured

Truy cập: `http://localhost:4200/account-information`

### 2. Thêm menu item (nếu cần)

Edit `src/app/core/constants/menu.ts`:

```typescript
{
  icon: 'assets/icons/heroicons/outline/user.svg',
  label: 'My Account',
  route: '/account-information',
  moduleKey: MODULE_KEYS.ACCOUNT_INFORMATION,
}
```

### 3. Thêm MODULE_KEYS (nếu cần RBAC)

Edit `src/app/core/constants/module-function-keys.ts`:

```typescript
export const MODULE_KEYS = {
  // ... existing keys
  ACCOUNT_INFORMATION: 'account-information',
};
```

## 📦 Dependencies

Module imports:
```typescript
imports: [
  CommonModule,              // Angular directives
  FormsModule,              // Form support
  ReactiveFormsModule,      // Reactive forms
  AccountInformationRoutingModule,
  ManagementSharedModule,   // Shared components
  MaterialModule,           // Material & ng-zorro
]
```

## 🔧 Service Methods

### AccountInformationService

```typescript
constructor(private apiGateway: ApiGatewayService) {}

// Lấy thông tin user hiện tại
getCurrentUser(): Observable<AccountInformation>

// Cập nhật thông tin user
updateCurrentUser(data: AccountInformation2Update): Observable<AccountInformation>

// Upload avatar
uploadAvatar(file: File): Observable<{ avatarUrl: string }>
```

## 💾 Form State Management

```typescript
// Dirty check - phát hiện thay đổi
hasFormChanged(): boolean

// Convert form value thành comparable string
private getFormValueAsComparable(): string

// Reset form về giá trị ban đầu
resetForm(): void

// Disable date picker cho ngày trong tương lai
disableFutureDate(current: Date): boolean
```

## 🎯 Component Lifecycle

1. **OnInit** → Load current user info
2. **Initialize Form** → Set up form controls with validators
3. **Populate Form** → Fill form with user data
4. **User Edits** → Form tracks changes
5. **Submit** → Validate → Update user → Upload avatar (if exists)
6. **Success** → Toast notification → Update state
7. **OnDestroy** → Cleanup subscriptions

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| firstName | Required, min 2 chars |
| lastName | Required, min 2 chars |
| email | Required, valid email, readonly |
| phone | Required, valid phone format |
| dateOfBirth | Optional, max current date |
| gender | Optional (Nam, Nữ, Khác) |
| address | Optional, textarea |
| avatar | Optional, max 5MB, image only |

## 🐛 Error Handling

```typescript
// HTTP Errors
.subscribe({
  next: (data) => { /* success */ },
  error: (error) => this.utils.handleRequestError(error)
})

// Form Errors
@if (control.errors?.['required']) {
  <span>Field is required</span>
}

@if (control.errors?.['pattern']) {
  <span>Invalid format</span>
}
```

## 🔒 Security Notes

- Email field là read-only (không cho edit)
- Avatar upload có file size limit (5MB)
- File type validation (image only)
- All API calls with feature tracking for quota management
- Form auto-cleanup on destroy

## 📝 File Details

### account-detail.component.ts (217 lines)
- Form initialization & validation
- Avatar upload & preview
- User data loading & updating
- Dirty state tracking
- Subscription management (takeUntil pattern)

### account-detail.component.html (303 lines)
- Avatar section (upload, preview, delete)
- 2-column form grid layout
- Form controls with error messages
- Clear buttons & suffixes
- Submit/Reset buttons with loading state

### account-detail.component.scss
- Ng-Zorro input styling (focus, hover states)
- Textarea customization (no resize, font family)
- Select & date picker styling
- Clear icon hover effects

## 🚦 Status

✅ Module Created
✅ Components Implemented
✅ Services Created
✅ Routing Configured
✅ Styling Applied
✅ No Compilation Errors

## 📌 Next Steps (Optional)

1. Add password change functionality
2. Add 2FA settings
3. Add activity logs
4. Add account deletion with confirmation
5. Add export user data feature
6. Add security settings
7. Add connected devices/sessions management

## 📞 Support

For questions or improvements:
- Check README.md in module folder
- Review component .ts/.html files
- Check AccountInformationService for API details
