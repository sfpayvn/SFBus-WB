# 🎨 Visual Comparison: Old vs New UI

## Layout Architecture

### OLD UI (Single Page)
```
┌─────────────────────────────────────────────────────┐
│  Header Section                                     │
│  - Back Button                                      │
└─────────────────────────────────────────────────────┘
│                                                     │
│  Card Container                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │                                               │ │
│  │  Avatar Section (inline)                      │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │ Avatar │ First Name                     │ │ │
│  │  │ Upload │ Last Name                      │ │ │
│  │  │        │ Email                          │ │ │
│  │  │        │ Phone                          │ │ │
│  │  │        │ Gender                         │ │ │
│  │  │        │ Date of Birth                  │ │ │
│  │  │        │ Address (textarea)             │ │ │
│  │  │        │                                │ │ │
│  │  │        │ [Reset] [Save]                 │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### NEW UI (Tabset)
```
┌─────────────────────────────────────────────────────┐
│  [Back Button]                                      │
└─────────────────────────────────────────────────────┘
│                                                     │
│  Card Container                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  My Name                                      │ │
│  │  ┌─────────────────┬──────────────────────┐  │ │
│  │  │ Thông tin cơ bản│ Thay đổi mật khẩu  │  │ │
│  │  └─────────────────┴──────────────────────┘  │ │
│  │                                               │ │
│  │  TAB 1: Thông tin cơ bản                     │ │
│  │  ┌───────────────────────────────────────┐  │ │
│  │  │ Avatar (left 40%)  │  Form Fields    │  │ │
│  │  │ ┌─────────────┐    │  (right 60%)   │  │ │
│  │  │ │             │    │ ┌─────────────┐│  │ │
│  │  │ │   [Avatar]  │    │ │ First Name  ││  │ │
│  │  │ │  (Rounded)  │    │ │ Last Name   ││  │ │
│  │  │ │             │    │ │ Email       ││  │ │
│  │  │ │ [Choose]    │    │ │ Phone       ││  │ │
│  │  │ │ [Delete]    │    │ │ Gender      ││  │ │
│  │  │ └─────────────┘    │ │ Date Birth  ││  │ │
│  │  │                    │ │ Address     ││  │ │
│  │  │  ┌────────┐        │ │             ││  │ │
│  │  │  │ Upload │        │ │             ││  │ │
│  │  │  │ Media  │        │ │             ││  │ │
│  │  │  └────────┘        │ └─────────────┘│  │ │
│  │  │                    │ [Reset] [Save] │  │ │
│  │  └───────────────────────────────────────┘  │ │
│  │                                               │ │
│  │  TAB 2: Thay đổi mật khẩu (hidden)         │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### OLD: Single Component
```
AccountDetailComponent
├── accountForm (FormGroup)
├── avatarUrl
├── avatarFile
├── genderOptions
└── All logic in one component
```

### NEW: Parent-Child Architecture
```
AccountDetailComponent (Container/Parent)
├── Properties:
│   ├── accountInformation
│   ├── isLoaded
│   └── backPage()
│
├─ AccountInfoComponent (Tab 1 Child)
│  ├── @Input accountInformation
│  ├── accountForm (FormGroup)
│  ├── Handles:
│  │  ├── Avatar upload
│  │  ├── User info form
│  │  └── Save functionality
│  │
│  └─ Outputs: Success notifications
│
└─ AccountPasswordComponent (Tab 2 Child)
   ├── passwordForm (FormGroup)
   ├── passwordConditions
   ├── Handles:
   │  ├── Password validation
   │  ├── Real-time requirements check
   │  └── Change password API call
   │
   └─ Outputs: Success notifications
```

---

## Form Layout Comparison

### OLD: Grid-based, Single Column
```
┌───────────────────────────┐
│ First Name │ Last Name   │
├───────────────────────────┤
│ Email                     │
├───────────────────────────┤
│ Phone                     │
├───────────────────────────┤
│ Gender                    │
├───────────────────────────┤
│ Date of Birth             │
├───────────────────────────┤
│ Address (textarea)        │
├───────────────────────────┤
│        [Reset] [Save]     │
└───────────────────────────┘
```

### NEW: Split Layout (Avatar + Form)
```
┌────────────────┬──────────────────────┐
│                │ First Name           │
│   [Avatar]     ├──────────────────────┤
│ Rounded        │ Last Name            │
│ Circle         ├──────────────────────┤
│                │ Email │ Phone        │
│ [Upload]       ├───────┴──────────────┤
│ Menu           │ Gender │ Date Birth  │
│ ┌────────────┐ ├───────┴──────────────┤
│ │ Local File │ │ Address (full width)│
│ │ Media      │ ├──────────────────────┤
│ └────────────┘ │  [Reset] [Save]     │
│                │                      │
│ [Delete]       │                      │
│                │                      │
└────────────────┴──────────────────────┘
  40% width        60% width
```

---

## Password Tab UI

### NEW: Password Tab
```
┌─────────────────────────────────────────┐
│                                         │
│ Password Input Section                  │
│ ┌─────────────────────────────────────┐│
│ │ Mật khẩu mới                       ││
│ │ [Password Input] [Eye Toggle]       ││
│ │ Error message if needed             ││
│ └─────────────────────────────────────┘│
│                                         │
│ Requirements Box (rounded, gray bg)    │
│ ┌─────────────────────────────────────┐│
│ │ Mật khẩu phải chứa:                ││
│ │                                     ││
│ │ ☑ Tối thiểu 8 ký tự [GREEN]       ││
│ │ ☐ Chữ hoa & thường [GRAY]         ││
│ │ ☑ Ít nhất một chữ số [GREEN]       ││
│ │ ☐ Ký tự đặc biệt [GRAY]           ││
│ │ ☑ Không khoảng trắng [GREEN]       ││
│ │                                     ││
│ └─────────────────────────────────────┘│
│                                         │
│          [Hủy] [Thay đổi mật khẩu]    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Styling Dimensions

### OLD
- No consistent heights
- Variable spacing
- Simple borders

### NEW: Aligned with UserDetail Pattern
```
Form Items:
  Height: !min-h-[96px]
  Label height: !h-[36px]
  Input height: !h-[36px]
  Border radius: !rounded (0.5rem)
  Border color: border-gray-200

Avatar:
  Size: h-28 w-28
  Border: border-2 dashed border-blue-500
  Border-radius: rounded-full
  
Password Input:
  Height: !h-[36px]
  Label height: !h-[48px]
  Border radius: !rounded
  
Tab Container:
  Type: card (nzType="card")
  Padding: p-6
```

---

## Color & Styling

### Input States
```
Default:
  Border: #d9d9d9 (gray-300)
  Background: white

Hover:
  Border: #40a9ff (light blue)
  
Focus:
  Border: #1890ff (blue)
  Box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2)
  
Error:
  Text: #ff4d4f (red)
  Icon: red-600

Success:
  Text: #52c41a (green)
  Icon: green-600
```

---

## Validation Experience

### OLD: Basic
```
Form valid? → Show Save button
Form invalid? → Disable Save button
Error? → Show red text
```

### NEW: Enhanced
```
Tab 1 (Account Info):
  ├─ Real-time field validation
  ├─ Clear error messages
  ├─ Dirty check (only enable save if changed)
  ├─ Clear buttons on inputs
  └─ Email readonly indicator

Tab 2 (Password):
  ├─ Real-time condition checking
  ├─ Visual checklist with colors
  │  ├─ Green ✓ when condition met
  │  └─ Gray when not met
  ├─ Password visibility toggle
  ├─ Dirty check
  └─ Success notification
```

---

## Responsive Behavior

### OLD
- Fixed layout
- May break on mobile

### NEW
- Grid-based (Tailwind)
- Avatar: `w-4/12` (40%)
- Form: `w-8/12` (60%)
- Form items: `w-full` or `w-6/12`
- Better mobile adaptation possible

---

## Summary Table

| Aspect | OLD | NEW |
|--------|-----|-----|
| **Layout Type** | Single page form | Tabset (2 tabs) |
| **Components** | 1 monolithic | 1 parent + 2 children |
| **Avatar Display** | Inline top | Large circle, left 40% |
| **Form Layout** | Full width 2-col grid | Sidebar + form 60% |
| **Password Change** | Not included | Full featured in Tab 2 |
| **Styling** | Basic | Professional (UserDetail style) |
| **Form Heights** | Variable | Consistent (!h-[36px], !min-h-[96px]) |
| **Validation** | Simple | Enhanced with checklist |
| **User Experience** | Basic | Interactive, real-time feedback |
| **Code Organization** | Monolithic | Modular, reusable |
| **Maintenance** | Difficult | Easy |

---

## 🎯 Benefits of New UI

1. **Better UX**
   - Clear separation of concerns
   - Tab-based navigation reduces cognitive load
   - Real-time password validation feedback

2. **Better DX**
   - Modular components (reusable)
   - Easier to maintain
   - Easier to test
   - Clear responsibilities

3. **Visual Consistency**
   - Matches UserDetailComponent pattern
   - Professional appearance
   - Consistent with project design system

4. **Scalability**
   - Easy to add more tabs
   - Can extract components for reuse
   - Better state management

5. **Accessibility**
   - Clear form structure
   - Proper error messages
   - Visual feedback for all interactions
