# 📚 Quick Reference Guide

## 🚀 Quick Start

### Access the page
```
http://localhost:4200/account-information
```

### What changed?
| Item | Old | New |
|------|-----|-----|
| UI | Single page form | Tabset (2 tabs) |
| Password | Not available | Full featured |
| Design | Basic | Professional |
| Code | 1 component | 3 components |

---

## 📑 File Locations

### Parent Component
```
src/app/modules/account-information/
└── pages/account-detail/
    ├── account-detail.component.ts      ← Container
    ├── account-detail.component.html    ← Tabset layout
    └── account-detail.component.scss    ← Minimal styles
```

### Child Components
```
src/app/modules/account-information/
└── pages/account-detail/components/
    ├── account-info/                   ← Tab 1: User Info
    │   ├── account-info.component.ts
    │   ├── account-info.component.html
    │   └── account-info.component.scss
    │
    └── account-password/               ← Tab 2: Change Password
        ├── account-password.component.ts
        ├── account-password.component.html
        └── account-password.component.scss
```

### Services & Models
```
src/app/modules/account-information/
├── services/
│   └── account-information.service.ts  ← API calls
│
└── model/
    └── account-information.model.ts    ← TypeScript models
```

---

## 🎯 Component Responsibilities

### AccountDetailComponent (Parent)
```typescript
// Load current user
ngOnInit() → loadCurrentUser()

// Render tabset with 2 tabs
// Pass data to child components
// Handle back button
```

### AccountInfoComponent (Tab 1)
```typescript
// User form with avatar management
@Input accountInformation
- Form fields (First, Last, Email, Phone, Gender, DoB, Address)
- Avatar upload (local or media center)
- Avatar preview & delete
- Save & Reset buttons
```

### AccountPasswordComponent (Tab 2)
```typescript
// Password change with validation
- Password input with visibility toggle
- Real-time validation checklist (5 conditions)
- Change password button
- Reset button
```

---

## 🔌 API Methods

```typescript
// In AccountInformationService:

getCurrentUser()              // GET /users/current
updateCurrentUser(data)       // PUT /users/current
uploadAvatar(file)           // POST /users/current/avatar
changePassword(newPassword)   // POST /users/current/change-password
```

---

## 📦 Module Declaration

```typescript
// account-information.module.ts
declarations: [
  AccountDetailComponent,
  AccountInfoComponent,
  AccountPasswordComponent
]

imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  AccountInformationRoutingModule,
  ManagementSharedModule,
  MaterialModule
]
```

---

## 🎨 Key CSS Classes

### Form Items
```
!min-h-[96px]    ← Minimum height
!h-[36px]        ← Input height
!rounded         ← Border radius (0.5rem)
border-gray-200  ← Border color
```

### States
```
Focus:   border-blue-500 (#1890ff)
Hover:   border-blue-400 (#40a9ff)
Error:   text-red-500 (#ff4d4f)
Success: text-green-500 (#52c41a)
```

### Layout
```
w-4/12   ← Avatar section (40%)
w-8/12   ← Form section (60%)
w-6/12   ← Half width inputs
!w-full  ← Full width fields
```

---

## ✨ Features Checklist

### Tab 1: User Info
- [ ] Avatar upload/delete
- [ ] Avatar preview
- [ ] First/Last name (required)
- [ ] Email (readonly)
- [ ] Phone (required, validated)
- [ ] Gender dropdown
- [ ] Date of Birth picker
- [ ] Address textarea
- [ ] Form validation
- [ ] Clear buttons
- [ ] Reset button
- [ ] Save button
- [ ] Dirty check (save only if changed)
- [ ] Success notification

### Tab 2: Password
- [ ] Password input
- [ ] Visibility toggle (eye icon)
- [ ] Real-time validation
- [ ] 5 requirement checklist
- [ ] Color feedback (green/gray)
- [ ] Change password button
- [ ] Dirty check
- [ ] Success notification
- [ ] Error handling

---

## 🔐 Password Requirements

Mật khẩu phải:
1. **Tối thiểu 8 ký tự**
2. **Chữ hoa & chữ thường** (Aa)
3. **Ít nhất một chữ số** (0-9)
4. **Ít nhất một ký tự đặc biệt** (! @ # $ % ^ & *)
5. **Không chứa khoảng trắng**

All 5 required ✓

---

## 📊 Layout Ratios

```
Tab 1 (User Info):
┌──────────────────┬──────────────────┐
│   Avatar (40%)   │   Form (60%)     │
│   h-28 w-28      │                  │
│   rounded-full   │  First/Last (100%)|
│   border-2       │  Email/Phone (50%)|
│                  │  Gender/DoB (50%)│
│   [Upload]       │  Address (100%) │
│   [Delete]       │  [Reset][Save]   │
└──────────────────┴──────────────────┘

Tab 2 (Password):
┌────────────────────────────────────┐
│ Mật khẩu mới                      │
│ [Input] [Eye]                      │
├────────────────────────────────────┤
│ Yêu cầu:                           │
│ ☑ 8+ ký tự                         │
│ ☐ Aa                               │
│ ☑ Số                               │
│ ☐ Ký tự đặc biệt                   │
│ ☑ Không space                      │
├────────────────────────────────────┤
│ [Hủy] [Thay đổi mật khẩu]         │
└────────────────────────────────────┘
```

---

## 🔄 Form States

### AccountInfoComponent
```
Loading:        isLoaded = false
Idle:          isLoaded = true, isSubmitting = false
Submitting:    isSubmitting = true
Success:       Toast notification, Reset form state
Error:         Toast error, Keep form intact
```

### AccountPasswordComponent
```
Idle:          isSubmitting = false
Submitting:    isSubmitting = true
Success:       Toast notification, Reset form
Error:         Toast error, Keep password
```

---

## 🎯 Routing

```typescript
// In layout-routing.module.ts:
{
  path: 'account-information',
  loadChildren: () => import('../account-information/account-information.module')
    .then((m) => m.AccountInformationModule),
}

// In account-information-routing.module.ts:
{
  path: '',
  component: AccountDetailComponent,
}
```

### URLs
```
/account-information              ← Main page with tabs
/account-information#tab-0        ← Tab 1: User Info
/account-information#tab-1        ← Tab 2: Password
```

---

## 🧪 Testing Tips

### Avatar Upload Test
```typescript
// Should accept: JPG, PNG, WebP
// Max size: 5MB
// Shows error if exceeds
// Shows preview before save
```

### Form Validation Test
```typescript
// Clear button should clear field
// Save disabled if no changes
// Save disabled if form invalid
// Email field should be readonly
// Date picker blocks future dates
```

### Password Validation Test
```typescript
// Each condition shows real-time
// All 5 must be green to enable submit
// Eye icon toggles password visibility
// Enter: Aa1!test@pwd (valid example)
```

---

## 📱 Responsive Notes

Current breakpoints:
- Avatar: `w-4/12` (40%)
- Form: `w-8/12` (60%)

Mobile optimization possible by:
- Stacking avatar + form vertically on mobile
- Changing w-4/12 and w-8/12 to responsive classes

---

## 🐛 Troubleshooting

### Module not found error
```
✅ Check: account-information.module.ts imports
✅ Check: layout-routing.module.ts includes route
✅ Check: all components declared
```

### API errors
```
✅ Check: /users/current endpoint exists
✅ Check: /users/current/change-password endpoint exists
✅ Check: API returns correct response format
```

### Styling issues
```
✅ Check: MaterialModule imported
✅ Check: ManagementSharedModule imported
✅ Check: SCSS files compile without errors
```

---

## 📚 Documentation Files

1. **COMPLETE_REDESIGN_GUIDE.md** - Full detailed guide
2. **UI_REDESIGN_SUMMARY.md** - Redesign summary
3. **VISUAL_COMPARISON.md** - Layout comparison
4. **README.md** (in module folder) - Module documentation
5. **QUICK_REFERENCE_GUIDE.md** - This file ← You are here

---

## ✅ Verification Checklist

- [ ] Module created with 3 components
- [ ] Parent component uses tabset
- [ ] Tab 1 has avatar + form
- [ ] Tab 2 has password change
- [ ] All APIs integrated
- [ ] Styling matches UserDetail
- [ ] 0 compilation errors
- [ ] Form validation working
- [ ] Avatar upload working
- [ ] Password validation checklist working
- [ ] Success/error notifications working
- [ ] Can access /account-information

---

## 🚀 Deployment

```bash
# Build
npm run build

# Test build
npm start

# Deploy to production
# (Your deployment process)
```

---

## 💡 Tips & Tricks

### Customize colors
```scss
// In component.scss
Focus color: Change #1890ff to your color
Hover color: Change #40a9ff
Error color: Change #ff4d4f
Success color: Change #52c41a
```

### Add more form fields
```typescript
// In account-info.component.ts:
this.accountForm = this.fb.group({
  // ... existing fields ...
  newField: ['', Validators.required]
});

// In account-info.component.html:
<nz-form-item>
  <!-- New field template -->
</nz-form-item>
```

### Add more password requirements
```typescript
// In account-password.component.ts:
passwordConditions: { [key: string]: boolean } = {
  // ... existing conditions ...
  newCondition: false
};

// In updatePasswordConditions():
this.passwordConditions['newCondition'] = /* your check */;
```

---

## 🎓 Learning Resources

- **User Detail Pattern**: `/modules/user-management/pages/user-detail/`
- **Form Validation**: `ReactiveFormsModule` documentation
- **Ng-Zorro**: `ng-zorro-antd.com` components
- **Tailwind CSS**: Utility classes used in template

---

## 📞 Support

**Questions?** Refer to:
1. COMPLETE_REDESIGN_GUIDE.md
2. Component .ts/.html files
3. UserDetailComponent reference
4. AccountInformationService

---

**Status: ✅ Ready to Use**

Go to: `http://localhost:4200/account-information` 🚀
