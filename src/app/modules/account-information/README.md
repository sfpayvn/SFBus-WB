# Account Information Module

## Mô tả
Module `account-information` cho phép người dùng xem và chỉnh sửa thông tin tài khoản cá nhân (current user).

## Cấu trúc Module

```
src/app/modules/account-information/
├── account-information.module.ts           # Module declarations
├── account-information-routing.module.ts   # Routing config
├── model/
│   └── account-information.model.ts        # TypeScript interfaces
├── services/
│   └── account-information.service.ts      # API calls & business logic
└── pages/
    └── account-detail/
        ├── account-detail.component.ts     # Component logic
        ├── account-detail.component.html   # Template
        └── account-detail.component.scss   # Styling
```

## Tính năng

### Chỉnh sửa thông tin người dùng
- Tên, Họ (bắt buộc)
- Email (chỉ đọc)
- Số điện thoại (bắt buộc, validate pattern)
- Giới tính (Nam, Nữ, Khác)
- Ngày sinh (kiểm soát để không được chọn ngày trong tương lai)
- Địa chỉ (textarea với auto-size)

### Quản lý ảnh đại diện (Avatar)
- Upload ảnh từ máy tính
- Xoá ảnh hiện tại
- Validate kích thước (max 5MB)
- Validate định dạng (chỉ hình ảnh)
- Preview ảnh trước khi lưu

### Validation
- Form validation tự động
- Error messages chi tiết
- Kiểm tra thay đổi dữ liệu (dirty check)
- Nút lưu chỉ enable khi form valid

## API Integration

Tất cả API calls được gọi qua `ApiGatewayService` với feature tracking:

```typescript
// Get current user info
GET /users/current

// Update user info
PUT /users/current

// Upload avatar
POST /users/current/avatar
```

## Styling

Module sử dụng pattern styling tương tự toàn project:

### Inputs & Form Controls
- Sử dụng `ng-zorro-antd` components (`nz-form-item`, `nz-input-group`)
- Custom clear icons cho input fields
- Focus states với border màu xanh (#1890ff)
- Error messages với text màu đỏ

### Layout
- Tailwind CSS utility classes (`flex`, `grid`, `gap-6`, etc.)
- 2-column grid layout cho các trường thông tin
- Responsive design
- Card design với border và shadow

### SCSS
```scss
.ant-input, .ant-select-selector {
  border-color: #d9d9d9;
  border-radius: 0.5rem;
  
  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}
```

## Routing

Module được gắn vào layout routing:

```typescript
{
  path: 'account-information',
  loadChildren: () => import('../account-information/account-information.module')
    .then((m) => m.AccountInformationModule),
}
```

URL: `http://localhost:4200/account-information`

## Cách sử dụng

### 1. Module đã được tạo và routing đã được cập nhật
- Có thể truy cập tại route `/account-information`

### 2. Thêm vào menu sidebar (nếu cần)
Chỉnh sửa `src/app/core/constants/menu.ts` để thêm menu item:

```typescript
{
  icon: 'assets/icons/heroicons/outline/user.svg',
  label: 'Account Information',
  route: '/account-information',
  moduleKey: MODULE_KEYS.ACCOUNT_INFORMATION,
}
```

### 3. Thêm Module Key (nếu cần RBAC)
Thêm vào `src/app/core/constants/module-function-keys.ts`:

```typescript
export const MODULE_KEYS = {
  // ... existing keys
  ACCOUNT_INFORMATION: 'account-information',
};
```

## Dependencies

Module imports:
- `CommonModule` - Angular common directives
- `FormsModule` - Reactive forms support
- `ReactiveFormsModule` - Form builder & validation
- `ManagementSharedModule` - Shared components & pipes
- `MaterialModule` - Material UI & ng-zorro components

## Services

### AccountInformationService
```typescript
// Get current user information
getCurrentUser(): Observable<AccountInformation>

// Update user information
updateCurrentUser(data: AccountInformation2Update): Observable<AccountInformation>

// Upload avatar image
uploadAvatar(file: File): Observable<{ avatarUrl: string }>
```

## Form Features

- **Dirty check**: Tracks if form has unsaved changes
- **Reset functionality**: Reset form to original values
- **Date validation**: Prevents selecting future dates
- **File upload**: Avatar upload with validation
- **Auto-save state**: Form state persisted in component
- **Loading states**: Visual feedback during submission

## Notes

- Email field là read-only (không có quyền đổi email từ profile)
- Form validation được enable ngay khi component init
- Date picker không cho chọn ngày trong tương lai
- Avatar upload có max size 5MB
- Clear button xuất hiện khi input có value

## Future Enhancements

- Password change functionality
- 2FA settings
- Account security settings
- Activity logs
- Export user data
- Account deletion with confirmation
