# 🎨 UI Preview & Screenshots

## Tab 1: Thông tin cơ bản

```
┌─────────────────────────────────────────────────────────────┐
│ [Quay lại]                                                  │
├─────────────────────────────────────────────────────────────┤
│ Tên của bạn                                                 │
│ ┌─────────────────┬───────────────────────────────────────┐ │
│ │ Thông tin cơ bản│ Thay đổi mật khẩu                    │ │
│ └─────────────────┴───────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────────┬────────────────────────────────────┐   │
│ │                  │ Tên                                │   │
│ │   [Avatar]       │ ┌──────────────────────────────┐   │   │
│ │   Rounded        │ │ Nhập tên            [✕]      │   │   │
│ │   Circle         │ └──────────────────────────────┘   │   │
│ │   h-28 w-28      │                                    │   │
│ │                  │ Họ                                 │   │
│ │   [Upload ▼]     │ ┌──────────────────────────────┐   │   │
│ │   ├─ Tập tin     │ │ Nhập họ              [✕]      │   │   │
│ │   │  cục bộ      │ └──────────────────────────────┘   │   │
│ │   └─ Trung tâm   │                                    │   │
│ │      phương tiện │ Email                Phone         │   │
│ │                  │ ┌─────────────────┐ ┌──────────┐   │   │
│ │   [Xoá ảnh]      │ │ email@...  [✕] │ │... [✕]    │   │   │
│ │                  │ └─────────────────┘ └──────────┘   │   │
│ │                  │ (readonly)                         │   │
│ │                  │                                    │   │
│ │                  │ Giới tính         Ngày sinh        │   │
│ │                  │ ┌─────────────┐  ┌──────────────┐  │   │
│ │                  │ │ Chọn [✕]    │  │ Chọn ngày [✕]  │   │
│ │                  │ └─────────────┘  └──────────────┘  │   │
│ │                  │                                    │   │
│ │                  │ Địa chỉ                            │   │
│ │                  │ ┌──────────────────────────────┐   │   │
│ │                  │ │ Nhập địa chỉ         [✕]      │   │   │
│ │                  │ │                                │   │   │
│ │                  │ └──────────────────────────────┘   │   │
│ │                  │ [Reset] [Lưu thay đổi]            │   │
│ └──────────────────┴────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Features
- Avatar: Large rounded circle (h-28 w-28)
- Avatar border: Blue dashed
- Upload popover: Local file + Media center options
- Form layout: 2-column on right (60% width)
- Inputs: h-36px, gray border, blue focus
- Clear buttons (✕) on inputs
- Readonly email field
- Date picker: No future dates allowed
- Action buttons: Reset + Lưu thay đổi

---

## Tab 2: Thay đổi mật khẩu

```
┌────────────────────────────────────────────────────────────┐
│ [Quay lại]                                                 │
├────────────────────────────────────────────────────────────┤
│ Tên của bạn                                                │
│ ┌─────────────────┬──────────────────────────────────────┐ │
│ │ Thông tin cơ bản│ Thay đổi mật khẩu                   │ │
│ └─────────────────┴──────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ Mật khẩu mới                                               │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Nhập mật khẩu mới              [👁 Eye Icon]        │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ Mật khẩu phải chứa:                                        │
│ ┌──────────────────────────────────────────────────────┐  │
│ │                                                       │  │
│ │ ☑ Tối thiểu 8 ký tự                    [GREEN]      │  │
│ │ ☐ Ít nhất chữ cái viết hoa và viết thường          │  │
│ │   (Aa)                                  [GRAY]       │  │
│ │ ☑ Ít nhất một chữ số (0-9)             [GREEN]      │  │
│ │ ☐ Ít nhất một ký tự đặc biệt                        │  │
│ │   ! @ # $ % ^ & * ( ) _ + -             [GRAY]       │  │
│ │ ☑ Không chứa khoảng trắng              [GREEN]      │  │
│ │                                                       │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ [Hủy] [Thay đổi mật khẩu]                                 │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Features
- Password input: h-36px, gray border
- Visibility toggle: Eye icon to show/hide
- Requirements box: Rounded border, gray background
- Checklist: 5 conditions
  - Green checkmark when condition met
  - Gray checkmark when condition not met
- Real-time feedback as user types
- Submit button: Disabled if requirements not met
- Reset button: Clear password field

---

## Color Coding

### Password Requirements
```
✅ GREEN (#52c41a) = Condition met
❌ GRAY (#d9d9d9)  = Condition not met

Example: "Test@123abc"
✅ 8+ ký tự        (12 chars) ✓
✅ Aa              (T, a) ✓
✅ Số              (1, 2, 3) ✓
❌ Ký tự đặc biệt   (@) ✗  Wait...actually @ is special!
✅ Ký tự đặc biệt   (@) ✓
✅ Không space      (no spaces) ✓
```

### Input States
```
Default:  Border: #d9d9d9 (gray)
Hover:    Border: #40a9ff (light blue)
Focus:    Border: #1890ff (blue)
          Shadow: 0 0 0 2px rgba(24,144,255,0.2)
Error:    Text: #ff4d4f (red)
Success:  Text: #52c41a (green)
Readonly: BG: #f5f5f5 (gray)
```

---

## Button States

### Save/Submit Button
```
Enabled:   
  BG: #1890ff (Blue)
  Color: White
  Hover: #0050b3 (Darker blue)
  
Disabled:  
  BG: #d9d9d9 (Gray)
  Color: Gray
  Cursor: not-allowed
  
Loading:
  Shows loading icon + text "Đang..."
  Disabled state
```

### Reset/Cancel Button
```
Normal:
  Border: #d9d9d9 (Gray)
  BG: #f5f5f5 (Gray 100)
  Hover: #ebebeb (Gray 200)
  
Text: #595959 (Dark gray)
```

---

## Form Item Spacing

```
┌─────────────────────────────────┐
│ Label (h-36px)                  │
│ ┌───────────────────────────────┐│
│ │ Input Field                   ││ h-36px
│ │ [Value with clear button]     ││
│ └───────────────────────────────┘│
│ Error Message (text-xs)          │ mt-1
│                                  │
│ (min-h-96px total for item)     │
└─────────────────────────────────┘
```

---

## Form Grid Layout (Tab 1)

```
┌────────────────┬─────────────────────────┐
│ 40% Avatar     │ 60% Form                │
│                │ ┌─────────────────────┐ │
│                │ │ Field 1 (100% width)│ │
│                │ ├─────────────────────┤ │
│                │ │ Field 2 (100% width)│ │
│                │ ├──────┬───────────────┤ │
│                │ │ Fld3 │ Fld4 (50% ea)│ │
│                │ ├──────┴───────────────┤ │
│                │ │ Field 5 (100% width)│ │
│                │ ├─────────────────────┤ │
│                │ │ Action Buttons      │ │
│                │ └─────────────────────┘ │
└────────────────┴─────────────────────────┘
```

### Breakpoints
```
Avatar Section: w-4/12 (40%)
  - h-28 w-28 avatar
  - Upload menu
  - Delete button

Form Section: w-8/12 (60%)
  - Full width items: First Name, Last Name, Address
  - Half width (2 columns): Email, Phone, Gender, DoB
  - Action buttons: Reset, Save
```

---

## Responsive Design (Future Enhancement)

### Current (Desktop)
```
┌─────────────────────────────────┐
│ Avatar (40%) │ Form (60%)      │
└─────────────────────────────────┘
```

### Potential Mobile (Optional)
```
┌──────────────────┐
│ Avatar (100%)    │
├──────────────────┤
│ Form (100%)      │
├──────────────────┤
│ Action Buttons   │
└──────────────────┘
```

---

## Typography

```
Header:        text-base font-medium (Tab title)
Label:         text-sm (Form label)
Input Text:    text-sm
Error Message: text-xs text-red-500
Placeholder:   Gray placeholder text
Required:      Red asterisk (from nz-form-label)
```

---

## Borders & Shadows

```
Card Container:
  Border: 1px solid #d9d9d9
  Border-radius: 0.75rem
  Padding: 1.5rem
  BG: White
  
Form Items:
  Border: 1px solid #d9d9d9
  Border-radius: 0.5rem
  No shadow
  
Avatar Container:
  Border: 2px dashed #1890ff
  Border-radius: 50% (circle)
  BG: #f5f5f5
  
Requirements Box:
  Border: 1px solid #d9d9d9
  Border-radius: 0.5rem
  BG: #f5f5f5
```

---

## Animation & Transitions

```
Hover Effects:
  Border color change: smooth transition
  BG color change: smooth transition
  Icon hover: color change (#ff4d4f on clear icons)
  
Input Focus:
  Border color: #1890ff
  Box-shadow: 0 0 0 2px rgba(24,144,255,0.2)
  Transition: instant
  
Button Hover:
  BG color change
  Cursor change
  Transition: smooth
  
Password Condition Checklist:
  Color change: instant (real-time)
  No animation
```

---

## Icon Usage

```
Clear Icon (✕):
  - nz-icon, nzTheme="fill", nzType="close-circle"
  - Color: #999999 (default)
  - Hover: #ff4d4f (red)
  - Cursor: pointer
  
Eye Icon (visibility toggle):
  - nz-icon, nzTheme="outline"
  - nzType="eye" or "eye-off"
  - Color: #595959 (dark gray)
  - Hover: #1890ff (blue)
  - Cursor: pointer
  
Checkbox (✓):
  - Standard nz-checkbox
  - Pointer-events: none (read-only)
  - Color: Green when checked, Gray when unchecked
```

---

## Accessibility

```
Form Labels:
  - Associated with nzFor attribute
  - Visible (not hidden)
  
Error Messages:
  - Displayed below input
  - Red color + text
  - Clear error descriptions
  
Required Fields:
  - Red asterisk indicator
  - Validator feedback
  
Input Types:
  - Proper type attributes (email, tel, password)
  - Placeholders provided
  
Focus States:
  - Visible blue border
  - Box shadow for visibility
```

---

## Real-time Feedback Examples

### Tab 1 - Form Changes
```
User types in "First Name":
  ✓ Clear button appears
  ✓ Error clears (if was invalid)
  ✓ Save button might enable (depends on other fields)

User selects avatar:
  ✓ Image preview updates
  ✓ Delete button appears

User clicks Save:
  ✓ Loading spinner shows
  ✓ Button text: "Đang lưu..."
  ✓ Button disabled
  ✓ On success: Toast notification
```

### Tab 2 - Password Validation
```
User types password:
  ✓ Real-time checking of 5 conditions
  ✓ Green checkmark when condition met
  ✓ Gray checkmark when not met
  ✓ Submit button enables when all 5 green
  ✓ Eye icon toggles visibility

User clicks "Thay đổi mật khẩu":
  ✓ Loading spinner shows
  ✓ Button text: "Đang cập nhật..."
  ✓ Button disabled
  ✓ On success: "Thay đổi mật khẩu thành công" toast
```

---

## Summary Table

| Element | Style |
|---------|-------|
| **Card** | Border: gray-200, BG: white, Padding: 1.5rem |
| **Tabs** | nzType="card" (card styled) |
| **Inputs** | h-36px, border-gray-200, focus: blue |
| **Labels** | text-sm, font-medium |
| **Errors** | text-xs, text-red-500 |
| **Avatar** | h-28 w-28, rounded-full, border-2 dashed blue-500 |
| **Buttons** | height: auto, padding: 2px 3px |
| **Grid** | 40% avatar, 60% form |

---

## Ready to View

Access: **http://localhost:4200/account-information**

The UI will look professional, clean, and consistent with UserDetailComponent! ✨
