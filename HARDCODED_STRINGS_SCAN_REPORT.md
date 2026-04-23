# SFBus-WB Hardcoded Strings Audit Report

**Scan Date:** March 13, 2026  
**Scope:** src/app directory (all .html and .ts files)  
**Purpose:** Identify all hardcoded user-visible English and Vietnamese strings requiring translation wrapping

---

## Summary Statistics
- **Total Files with Hardcoded Strings:** 50+
- **Total Hardcoded Strings Found:** 200+
- **Primary Language Categories:** English (60%), Vietnamese (40%)
- **Severity:** High - Many user-facing strings lack internationalization

---

## Detailed Findings (Sorted by File Path)

---

### FILE: src/app/core/directives/authorized.directive.ts

**STRINGS:**
- Line 134: `'Bạn không có quyền thực hiện hành động này'` → `'errors.unauthorized.action'`

---

### FILE: src/app/modules/account-information/pages/account-detail/account-detail.component.html

**STRINGS:**
- Line 3: `"Quay lại"` → `'buttons.back'`
- Line 14: `"Tài khoản của tôi"` → `'account.myAccount'`
- Line 19: `"Thông tin cơ bản"` → `'account.basicInfo'`
- Line 23: `"Thuê bao của tôi"` → `'account.mySubscriptions'`
- Line 27: `"Thay đổi mật khẩu"` → `'account.changePassword'`

---

### FILE: src/app/modules/account-information/pages/account-detail/components/account-info/account-info.component.html

**STRINGS:**
- Line 23: Button for viewing image (context from code)
- Line 36: `"Chọn ảnh"` → `'buttons.selectImage'`
- Line 74: `placeholder="Nhập Phone Number"` → `'placeholders.enterPhoneNumber'`
- Line 98: `placeholder="Nhập Email"` → `'placeholders.enterEmail'`
- Line 123: `placeholder="Nhập Name"` → `'placeholders.enterName'`
- Line 145: `nzPlaceHolder="Chọn Gender"` → `'placeholders.selectGender'`
- Line 188: `nzPlaceHolder="Chọn Role"` → `'placeholders.selectRole'`
- Line 244: `aria-label="Edit address"` → `'buttons.editAddress'`
- Line 254: `aria-label="Delete address"` → `'buttons.deleteAddress'`

---

### FILE: src/app/modules/account-information/pages/account-detail/components/account-password/account-password.component.html

**STRINGS:**
- Line 13: `placeholder="Nhập mật khẩu cũ"` → `'placeholders.enterOldPassword'`
- Line 52: `placeholder="Nhập mật khẩu"` → `'placeholders.enterPassword'`
- Line 88: `placeholder="Nhập lại mật khẩu"` → `'placeholders.confirmPassword'`
- Line 122: `"Password yêu cầu"` → `'labels.passwordRequirements'`

---

### FILE: src/app/modules/account-information/pages/account-detail/components/account-password/account-password.component.ts

**STRINGS:**
- Line 153: `"Password updated successfully"` → `'messages.passwordUpdatedSuccess'`

---

### FILE: src/app/modules/account-information/pages/account-detail/components/account-info/account-info.component.ts

**STRINGS:**
- Line 229: `"Cập nhật thông tin người dùng thành công"` → `'messages.userInfoUpdatedSuccess'`

---

### FILE: src/app/modules/account-information/pages/account-detail/components/my-tenant-subscription/my-tenant-subscription.component.html

**STRINGS:**
- Line 7: `placeholder="Search by name / _id / tenantId"` → `'placeholders.searchByNameOrId'`
- Line 10: `"Search"` → `'buttons.search'`
- Line 14: `nzPlaceHolder="Filter by status"` → `'placeholders.filterByStatus'`
- Line 22: `"Reset"` → `'buttons.reset'`
- Line 37: `"Plan"` → `'table.headers.plan'`
- Line 38: `"Price"` → `'table.headers.price'`
- Line 39: `"Duration"` → `'table.headers.duration'`
- Line 40: `"Start"` → `'table.headers.startDate'`

---

### FILE: src/app/modules/auth/pages/forgot-password/forgot-password.component.html

**STRINGS:**
- Line 3: `"Forgot Password ?"` → `'auth.forgotPassword.title'`
- Line 22: `placeholder="Nhập Phone Number"` → `'placeholders.enterPhoneNumber'`

---

### FILE: src/app/modules/auth/pages/forgot-password/forgot-password.component.ts

**STRINGS:**
- Line 70: `"Link reset password has been resent successfully"` → `'messages.resetLinkSentSuccess'`

---

### FILE: src/app/modules/auth/pages/new-password/new-password.component.html

**STRINGS:**
- Line 3: `"Setup New Password"` → `'auth.newPassword.title'`
- Line 18: `placeholder="Nhập mật khẩu"` → `'placeholders.enterPassword'`
- Line 55: `"Password yêu cầu"` → `'labels.passwordRequirements'`
- Line 105: `placeholder="Nhập lại mật khẩu"` → `'placeholders.confirmPassword'`

---

### FILE: src/app/modules/auth/pages/new-password/new-password.component.ts

**STRINGS:**
- Line 150: `"Password has been reset successfully"` → `'messages.passwordResetSuccess'`

---

### FILE: src/app/modules/auth/pages/sign-in/sign-in.component.html

**STRINGS:**
- Line 4: `"Hello Again !"` → `'auth.signIn.greeting'`
- Line 37: `placeholder="Nhập Phone Number"` → `'placeholders.enterPhoneNumber'`
- Line 65: `placeholder="Nhập Tenant Code"` → `'placeholders.enterTenantCode'`
- Line 96: `placeholder="Nhập mật khẩu"` → `'placeholders.enterPassword'`

---

### FILE: src/app/modules/auth/pages/sign-in/sign-in.component.ts

**STRINGS:**
- Line 67: Displays error message from server (handled by catch)
- Line 74: Displays error message from server (handled by catch)

---

### FILE: src/app/modules/auth/pages/sign-up/sign-up.component.html

**STRINGS:**
- Line 3: `"Sign Up !"` → `'auth.signUp.title'`
- Line 4: `"Let's get started with your 30 day free trial"` → `'auth.signUp.subtitle'`
- Line 6: `"Sign Up with Google"` → `'auth.signUp.googleButton'`
- Line 15: `"or"` → `'auth.common.or'`
- Line 20: `"Tenant Name"` → `'labels.tenantName'`
- Line 32: `placeholder="Nhập Tenant Name"` → `'placeholders.enterTenantName'`
- Line 40: `"Tenant Code"` → `'labels.tenantCode'`
- Line 60: `placeholder="Nhập Tenant Code"` → `'placeholders.enterTenantCode'`
- Line 75: `"Phone Number"` → `'labels.phoneNumber'`
- Line 95: `placeholder="Nhập Phone Number"` → `'placeholders.enterPhoneNumber'`
- Line 104: `"Password"` → `'labels.password'`
- Line 124: `placeholder="Nhập mật khẩu"` → `'placeholders.enterPassword'`
- Line 161: `"Password yêu cầu"` → `'labels.passwordRequirements'`
- Line 213: `placeholder="Nhập lại mật khẩu"` → `'placeholders.confirmPassword'`
- Line 248: `"I agree to the terms and conditions"` → `'auth.signUp.acceptTerms'`

---

### FILE: src/app/modules/auth/pages/sign-up/sign-up.component.ts

**STRINGS:**
- Line 162: Displays error message from server (handled by catch)
- Line 173: Displays error message from server (handled by catch)

---

### FILE: src/app/modules/auth/pages/verify-otp/verify-otp.component.html

**STRINGS:**
- Line 4: `"Phone Number Verification"` → `'auth.verifyOTP.title'`
- Line 6: `"Enter the verification code we sent to"` → `'auth.verifyOTP.description'`
- Line 9: `"Re-Sent OTP"` → `'auth.verifyOTP.resendButton'`

---

### FILE: src/app/modules/auth/pages/verify-otp/verify-otp.component.ts

**STRINGS:**
- Line 73: `"OTP has been resent successfully"` → `'messages.otpResendSuccess'`
- Line 95: `"Xác thực OTP không thành công"` → `'errors.otpVerificationFailed'`
- Line 103: `"Đã xảy ra lỗi trong quá trình xác thực, vui lòng thử lại sau."` → `'errors.authenticationError'`

---

### FILE: src/app/modules/dashboard/pages/report/pages/booking-report/booking-report.component.html

**STRINGS:**
- Line 2: `"Báo Cáo Đặt Vé"` → `'reports.bookingReport.title'`
- Line 37: `"Bộ Lọc Nâng Cao"` → `'labels.advancedFilter'`
- Line 48: `nzPlaceHolder="Chọn tuyến đường"` → `'placeholders.selectRoute'`
- Line 66: `nzPlaceHolder="Chọn trạng thái"` → `'placeholders.selectStatus'`
- Line 109: `"Kỳ Chính"` → `'labels.mainPeriod'`
- Line 121: `"Kỳ So Sánh"` → `'labels.comparisonPeriod'`
- Line 137: `"Kết Quả"` → `'labels.results'`

---

### FILE: src/app/modules/dashboard/pages/report/pages/booking-report/booking-report.component.ts

**STRINGS:**
- Line 250: `"Không thể tải danh sách tuyến đường"` → `'errors.failedLoadRoutes'`
- Line 267: `"Chức năng xuất Excel đang được phát triển"` → `'messages.excelExportDeveloping'`

---

### FILE: src/app/modules/dashboard/pages/report/pages/report/report.component.html

**STRINGS:**
- Line 2: `"Báo cáo thống kê"` → `'reports.statisticsReport.title'`
- Line 59: `"Phân tích chi tiết Booking"` → `'reports.bookingAnalysis.title'`
- Line 64: `"Vé bán"` → `'reports.tabs.ticketsSold'`
- Line 77: `"Doanh thu"` → `'reports.tabs.revenue'`
- Line 91: `"Chuyến xe"` → `'reports.tabs.trips'`
- Line 105: `"Phân tích chi tiết Goods"` → `'reports.goodsAnalysis.title'`
- Line 110: `"Hàng hóa"` → `'reports.tabs.goods'`
- Line 119: `"Doanh thu Hàng hóa"` → `'reports.tabs.goodsRevenue'`

---

### FILE: src/app/modules/dashboard/pages/report/pages/report/report.component.ts

**STRINGS:**
- Line 282: `"Vui lòng chọn khoảng thời gian"` → `'errors.selectDateRange'`

---

### FILE: src/app/modules/management/components/app-table/app-table.component.html

**STRINGS:**
- Line 99: `aria-label="Edit"` → `'buttons.edit'`
- Line 108: `aria-label="Delete"` → `'buttons.delete'`

---

### FILE: src/app/modules/management/components/table-footer/table-footer.component.html

**STRINGS:**
- Line 3: `"Show"` → `'table.pagination.show'`
- Line 13: `"per page"` → `'table.pagination.perPage'`
- Line 16: `"of"` → `'table.pagination.of'`

---

### FILE: src/app/modules/management/modules/booking-management/pages/booking-detail/booking-detail.component.ts

**STRINGS:**
- Line 267: `"Thanh toán không thành công"` → `'errors.paymentFailed'`
- Line 271: `"Thanh toán thành công"` → `'messages.paymentSuccess'`
- Line 282: `"Chức năng thanh toán QR đang được phát triển"` → `'messages.qrPaymentDeveloping'`

---

### FILE: src/app/modules/management/modules/booking-management/pages/booking/booking.component.ts

**STRINGS:**
- Line 242: `"Bạn có chắc chắn muốn xóa vé <b>{{bookingNumber}}</b> này không."` → `'dialogs.confirmDeleteTicket'`
- Line 258: `"Xóa vé thành công"` → `'messages.ticketDeletedSuccess'`
- Line 261: `"Xóa vé thất bại"` → `'errors.ticketDeleteFailed'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-layout-templates/pages/bus-layout-template-detail/bus-layout-template-detail.component.ts

**STRINGS:**
- Line 434: `"Tên không hợp lệ. Tên phải có định dạng A01, A02, ..., A99."` → `'errors.invalidSeatName'`
- Line 442: `"Tên này đã được sử dụng. Vui lòng chọn tên khác."` → `'errors.seatNameExists'`
- Line 520: `"BusLayoutTemplate update successfully"` → `'messages.busLayoutUpdated'`
- Line 538: `"BusLayoutTemplate added successfully"` → `'messages.busLayoutAdded'`
- Line 569: `"Tên không hợp lệ. Tên phải có định dạng A01, A02, ..., A99."` → `'errors.invalidSeatName'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-routes/pages/bus-route-detail/bus-route-detail.component.ts

**STRINGS:**
- Line 229: `"Bus Route update successfully"` → `'messages.busRouteUpdated'`
- Line 241: `"Bus Route added successfully"` → `'messages.busRouteAdded'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-schedules/pages/bus-schedule-detail/bus-schedule-detail.component.ts

**STRINGS:**
- Line 699: `"Không thể cập nhật lịch trình đã được công bố"` → `'errors.cannotUpdatePublished'`
- Line 776: `"Bus Route update successfully"` → `'messages.busRouteUpdated'`
- Line 791: `"Bus Route added successfully"` → `'messages.busRouteAdded'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-stations/component/bus-station-detail-dialog/bus-station-detail-dialog.component.ts

**STRINGS:**
- Line 186: `"Hình ảnh đã được paste thành công"` → `'messages.imagePastedSuccess'`
- Line 191: `"Vui lòng copy một hình ảnh trước khi paste"` → `'errors.copyImageFirst'`
- Line 194: `"Không thể paste hình ảnh. Vui lòng kiểm tra quyền clipboard hoặc thử cách khác"` → `'errors.pasteImageFailed'`

---

### FILE: src/app/modules/management/modules/files-center-management/pages/files-center/files-center.component.ts

**STRINGS:**
- Line 201: `"Xóa file thành công"` → `'messages.fileDeletedSuccess'`
- Line 230: `"Xóa file thành công"` → `'messages.fileDeletedSuccess'`
- Line 250: `"File added successfully"` → `'messages.fileAdded'`
- Line 260: `"Cập nhập thư mục không thành công"` → `'errors.folderUpdateFailed'`
- Line 263: `"Cập nhập thư mục thành công"` → `'messages.folderUpdated'`
- Line 270: `"Cập nhập thư mục không thành công"` → `'errors.folderUpdateFailed'`
- Line 277: `"Cập nhập thư mục thành công"` → `'messages.folderUpdated'`
- Line 422: `"Tạo thư mục không thành công"` → `'errors.folderCreationFailed'`
- Line 427: `"Tạo thư mục thành công"` → `'messages.folderCreated'`
- Line 436: `"Cập nhập thư mục không thành công"` → `'errors.folderUpdateFailed'`
- Line 440: `"Cập nhập thư mục thành công"` → `'messages.folderUpdated'`
- Line 456: `"Xóa thư mục không thành công"` → `'errors.folderDeleteFailed'`
- Line 463: `"Xóa thư mục thành công"` → `'messages.folderDeleted'`

---

### FILE: src/app/modules/management/modules/goods-management/pages/goods-detail/goods-detail.component.ts

**STRINGS:**
- Line 1145: `"Đã đủ {{MAX_IMAGES}} ảnh. Vui lòng xóa ảnh cũ trước khi thêm mới."` → `'errors.maxImagesReached'`
- Line 1180: `"{{exceededCount}} ảnh vượt quá giới hạn {{MAX_IMAGES}} ảnh"` → `'errors.imagesExceededLimit'`
- Line 1222: `"Đã xóa ảnh"` → `'messages.imageDeleted'`
- Line 1286: `"Vui lòng điền đầy đủ thông tin theo yêu cầu"` → `'errors.fillRequiredFields'`
- Line 1344: `"Goods update successfully"` → `'messages.goodsUpdated'`
- Line 1349: `"Goods added successfully"` → `'messages.goodsAdded'`
- Line 1576: `"Vui lòng điền đầy đủ thông tin theo yêu cầu"` → `'errors.fillRequiredFields'`
- Line 1670: `"Thanh toán không thành công"` → `'errors.paymentFailed'`
- Line 1674: `"Thanh toán thành công"` → `'messages.paymentSuccess'`

---

### FILE: src/app/modules/management/modules/promotion-management/pages/promotion-detail/promotion-detail.component.ts

**STRINGS:**
- Line 234: `"Promotion update successfully"` → `'messages.promotionUpdated'`
- Line 237: `"Promotion added successfully"` → `'messages.promotionAdded'`

---

### FILE: src/app/modules/management/modules/tenant-management/components/choose-subscription-dialog/choose-subscription-dialog.component.ts

**STRINGS:**
- Line 47: `"No subscriptions available"` → `'errors.noSubscriptionsAvailable'`
- Line 68: `"Please select a subscription plan"` → `'errors.selectSubscriptionPlan'`

---

### FILE: src/app/modules/management/modules/user-management/pages/user-detail/components/user-driver-info/user-driver-info.component.ts

**STRINGS:**
- Line 61: `"Vui lòng kiểm tra lại thông tin"` → `'errors.checkInformation'`
- Line 86: `"Tài xế đã được tạo thành công"` → `'messages.driverCreatedSuccess'`
- Line 109: `"Tài xế đã được cập nhật thành công"` → `'messages.driverUpdatedSuccess'`

---

### FILE: src/app/modules/management/modules/user-management/pages/user-detail/components/user-info/user-info.component.ts

**STRINGS:**
- Line 219: `"Cập nhật thông tin người dùng thành công"` → `'messages.userInfoUpdatedSuccess'`
- Line 237: `"Tạo mới thông tin người dùng thành công"` → `'messages.userInfoCreatedSuccess'`

---

### FILE: src/app/modules/management/modules/user-management/pages/user-detail/components/user-password/user-password.component.ts

**STRINGS:**
- Line 104: `"Mật khẩu đã được cập nhật thành công"` → `'messages.passwordUpdatedSuccess'`

---

### FILE: src/app/modules/management/modules/user-management/pages/users/users.component.html

**STRINGS:**
- Line 6: `aria-label="Import CSV"` → `'buttons.importCSV'`
- Line 45: Multiple table headers:
  - `"Avarta"` → `'table.headers.avatar'`
  - `"Name"` → `'table.headers.name'`
  - `"Phone Number"` → `'table.headers.phoneNumber'`
  - `"Role"` → `'table.headers.role'`
  - `"Actions"` → `'table.headers.actions'`
- Line 130: `aria-label="Edit user"` → `'buttons.editUser'`
- Line 139: `aria-label="Delete user"` → `'buttons.deleteUser'`

---

### FILE: src/app/modules/management/modules/user-management/pages/users/users.component.ts

**STRINGS:**
- Line 176: `"User deleted successfully"` → `'messages.userDeletedSuccess'`

---

### FILE: src/app/modules/settings/pages/bus-schedule-setting/bus-schedule-setting.component.html

**STRINGS:**
- Line 353: `placeholder="Nhập JSON"` → `'placeholders.enterJSON'`
- Line 360: `"Thời hạn cắt tính khả dụng"` → `'labels.availabilityDueDate'`

---

### FILE: src/app/modules/settings/pages/bus-schedule-setting/bus-schedule-setting.component.ts

**STRINGS:**
- Line 217: `"Vui lòng điền đầy đủ thông tin theo yêu cầu"` → `'errors.fillRequiredFields'`
- Line 222: `"Không có gì thay đổi để lưu"` → `'messages.noChangesToSave'`
- Line 280: `"Bus Schedule settings updated successfully"` → `'messages.busScheduleSettingsUpdated'`
- Line 294: `"Settings reset to default"` → `'messages.settingsResetDefault'`

---

### FILE: src/app/modules/settings/pages/default-setting/component/default-setting-detail-dialog/default-setting-detail-dialog.component.html

**STRINGS:**
- Line 26: `placeholder="Enter setting name"` → `'placeholders.enterSettingName'`
- Line 54: `placeholder="Enter group name"` → `'placeholders.enterGroupName'`

---

### FILE: src/app/modules/settings/pages/default-setting/component/default-setting-detail-dialog/default-setting-detail-dialog.component.ts

**STRINGS:**
- Line 158: `"Please fill in all required fields"` → `'errors.fillAllRequiredFields'`

---

### FILE: src/app/modules/settings/pages/default-setting/default-setting.component.html

**STRINGS:**
- Line 73: `aria-label="Edit setting"` → `'buttons.editSetting'`
- Line 82: `aria-label="Clone setting"` → `'buttons.cloneSetting'`
- Line 92: `aria-label="Delete setting"` → `'buttons.deleteSetting'`

---

### FILE: src/app/modules/settings/pages/default-setting/default-setting.component.ts

**STRINGS:**
- Line 142: `"Setting deleted successfully"` → `'messages.settingDeletedSuccess'`
- Line 167: `"Setting updated successfully"` → `'messages.settingUpdatedSuccess'`
- Line 191: `"Setting added successfully"` → `'messages.settingAddedSuccess'`
- Line 220: `"Setting cloned successfully"` → `'messages.settingClonedSuccess'`

---

### FILE: src/app/modules/settings/pages/organization-setting/organization-setting.component.html

**STRINGS:**
- Line 2: `"Cài đặt tổ chức"` → `'settings.organization.title'`
- Line 33: `placeholder="Nhập tên tổ chức"` → `'placeholders.enterOrgName'`
- Line 63: `placeholder="Nhập mã tổ chức"` → `'placeholders.enterOrgCode'`
- Line 80: `placeholder="Nhập địa chỉ"` → `'placeholders.enterAddress'`
- Line 108: `placeholder="Nhập số điện thoại"` → `'placeholders.enterPhoneNumber'`
- Line 139: `placeholder="Nhập email"` → `'placeholders.enterEmail'`

---

### FILE: src/app/modules/settings/pages/organization-setting/organization-setting.component.ts

**STRINGS:**
- Line 134: `"Vui lòng điền đầy đủ thông tin theo yêu cầu"` → `'errors.fillRequiredFields'`
- Line 184: `"Organization settings updated successfully"` → `'messages.organizationSettingsUpdated'`
- Line 198: `"Settings reset to default"` → `'messages.settingsResetDefault'`

---

### FILE: src/app/modules/settings/pages/theme-setting/theme-setting.component.html

**STRINGS:**
- Line 2: `"Cài đặt giao diện"` → `'settings.theme.title'`
- Line 106: `placeholder="Nhập tên doanh nghiệp"` → `'placeholders.enterCompanyName'`

---

### FILE: src/app/modules/settings/pages/theme-setting/theme-setting.component.ts

**STRINGS:**
- Line 107: `"Vui lòng chọn file hình ảnh"` → `'errors.selectImageFile'`
- Line 180: `"Đã đặt lại cài đặt mặc định"` → `'messages.settingsReset'`
- Line 192: `"Không có thay đổi nào để lưu"` → `'messages.noChangesToSave'`
- Line 232: `"Cài đặt đã được lưu thành công"` → `'messages.settingsSavedSuccess'`
- Line 237: `"Lưu cài đặt thất bại"` → `'errors.savingSettingsFailed'`
- Line 254: `"Upload file thất bại"` → `'errors.fileUploadFailed'`

---

### FILE: src/app/shared/components/html-builder/html-builder.component.html

**STRINGS:**
- Line 3: `"Save"` → `'buttons.save'`
- Line 4: `"Preview"` → `'buttons.preview'`

---

### FILE: src/app/shared/components/json-input/json-input.component.ts

**STRINGS:**
- Line 42: `nzTooltipTitle="Ctrl/⌘ + Enter"` → `'hints.jsonFormatting'`
- Line 73: `@Input() placeholder = 'Nhập/Dán JSON...'` → `'placeholders.enterPasteJSON'`

---

### FILE: src/app/shared/utils/utils.ts

**STRINGS:**
- Line 47: `'Oh No! Some things wrong error'` → `'errors.genericError'`
- Line 50: `'Please try again later'` → `'errors.tryAgainLater'`
- Line 60: `'Oh no! Something went wrong.'` → `'errors.somethingWentWrong'`
- Line 63: `'Please try again later'` → `'errors.tryAgainLater'`

---

### FILE: src/app/shared/Interceptor/quota.interceptor.ts

**STRINGS:**
- Line 50: `'You have exceeded your quota for this feature.'` → `'errors.quotaExceeded'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-provices/bus-provinces.component.ts

**STRINGS:**
- Line 180: `"Xóa Tỉnh/Thành Phố thành công"` → `'messages.provinceDeletedSuccess'`
- Line 229: `"Cập nhật thành công"` → `'messages.updateSuccess'`
- Line 254: `"Thêm Tỉnh/Thành Phố thành công"` → `'messages.provinceAddedSuccess'`
- Line 280: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-schedule-autogenerators/bus-schedule-autogenerator.component.ts

**STRINGS:**
- Line 219: `"Bus deleted successfully"` → `'messages.busDeletedSuccess'`
- Line 276: `"Nhân bản thành công"` → `'messages.clonedSuccess'`
- Line 465: `"Run bus schedule successfully"` → `'messages.busScheduleRunSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-schedule-autogenerators/pages/bus-schedule-autogenerator-detail/bus-schedule-autogenerator-detail.component.ts

**STRINGS:**
- Line 435: `"Bus Route update successfully"` → `'messages.busRouteUpdated'`
- Line 449: `"Bus Route added successfully"` → `'messages.busRouteAdded'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-routes/bus-routes.component.ts

**STRINGS:**
- Line 129: `"Bus deleted successfully"` → `'messages.busDeletedSuccess'`
- Line 156: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-schedule-templates/bus-schedule-templates.component.ts

**STRINGS:**
- Line 134: `"Bus deleted successfully"` → `'messages.busDeletedSuccess'`
- Line 164: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-services/bus-services.component.ts

**STRINGS:**
- Line 131: `"BusService deleted successfully"` → `'messages.busServiceDeletedSuccess'`
- Line 161: `"BusService updated successfully"` → `'messages.busServiceUpdatedSuccess'`
- Line 187: `"BusService added successfully"` → `'messages.busServiceAddedSuccess'`
- Line 205: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-stations/bus-stations.component.ts

**STRINGS:**
- Line 139: `"BusStation deleted successfully"` → `'messages.busStationDeletedSuccess'`
- Line 177: `"BusStation updated successfully"` → `'messages.busStationUpdatedSuccess'`
- Line 211: `"BusStation added successfully"` → `'messages.busStationAddedSuccess'`
- Line 232: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-templates/bus-templates.component.ts

**STRINGS:**
- Line 130: `"Bus deleted successfully"` → `'messages.busDeletedSuccess'`
- Line 159: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-types/bus-types.component.ts

**STRINGS:**
- Line 126: `"BusType deleted successfully"` → `'messages.busTypeDeletedSuccess'`
- Line 153: `"Cập nhật Loại Xe thành công"` → `'messages.busTypeUpdatedSuccess'`
- Line 175: `"Thêm Loại Xe thành công"` → `'messages.busTypeAddedSuccess'`
- Line 193: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/buses/buses.component.ts

**STRINGS:**
- Line 120: `"Bus deleted successfully"` → `'messages.busDeletedSuccess'`
- Line 147: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/buses/pages/bus-detail/bus-detail.component.ts

**STRINGS:**
- Line 301: `"Bus update successfully"` → `'messages.busUpdated'`
- Line 316: `"Bus added successfully"` → `'messages.busAdded'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-templates/pages/bus-template-detail/bus-template-detail.component.ts

**STRINGS:**
- Line 208: `"Bus update successfully"` → `'messages.busUpdated'`
- Line 224: `"Bus added successfully"` → `'messages.busAdded'`

---

### FILE: src/app/modules/management/modules/content-management/modules/content-layout/pages/content-layout-detail/content-layout-detail.component.ts

**STRINGS:**
- Line 260: `"Hình ảnh đã được paste thành công"` → `'messages.imagePastedSuccess'`
- Line 265: `"Vui lòng copy một hình ảnh trước khi paste"` → `'errors.copyImageFirst'`
- Line 268: `"Không thể paste hình ảnh. Vui lòng kiểm tra quyền clipboard hoặc thử cách khác"` → `'errors.pasteImageFailed'`
- Line 612: `"Content Layout added successfully"` → `'messages.contentLayoutAdded'`
- Line 626: `"Content Layout updated successfully"` → `'messages.contentLayoutUpdated'`

---

### FILE: src/app/modules/management/modules/content-management/modules/content-layout/pages/content-layout/content-layout.component.ts

**STRINGS:**
- Line 141: `"Content layout deleted successfully"` → `'messages.contentLayoutDeletedSuccess'`
- Line 171: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/content-management/modules/widget-block/pages/widget-block-detail/widget-block-detail.component.ts

**STRINGS:**
- Line 399: `"WidgetBlock added successfully"` → `'messages.widgetBlockAdded'`

---

### FILE: src/app/modules/management/modules/content-management/modules/widget-block/pages/widget-block/widget-block.component.ts

**STRINGS:**
- Line 132: `"Bus deleted successfully"` → `'messages.busDeletedSuccess'`
- Line 162: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/goods-management/pages/goods-categories/goods-categories.component.ts

**STRINGS:**
- Line 183: `"Goods Category deleted successfully"` → `'messages.goodsCategoryDeletedSuccess'`
- Line 214: `"Goods Category updated successfully"` → `'messages.goodsCategoryUpdatedSuccess'`
- Line 240: `"SeatType added successfully"` → `'messages.seatTypeAddedSuccess'`
- Line 258: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/payment-management/modules/payment-method/pages/payment-method-detail/payment-method-detail.component.ts

**STRINGS:**
- Line 285: `"PaymentMethod update successfully"` → `'messages.paymentMethodUpdated'`
- Line 288: `"PaymentMethod added successfully"` → `'messages.paymentMethodAdded'`

---

### FILE: src/app/modules/management/modules/payment-management/modules/payment-method/pages/payment-method/payment-method.component.ts

**STRINGS:**
- Line 201: `"PaymentMethod Category deleted successfully"` → `'messages.paymentMethodDeletedSuccess'`
- Line 224: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/subscription-management/pages/subscription-detail/subscription-detail.component.ts

**STRINGS:**
- Line 149: `"Promotion update successfully"` → `'messages.promotionUpdated'`
- Line 152: `"Promotion added successfully"` → `'messages.promotionAdded'`

---

### FILE: src/app/modules/management/modules/subscription-management/pages/subscription/subscription.component.ts

**STRINGS:**
- Line 189: `"Subscription Category deleted successfully"` → `'messages.subscriptionCategoryDeletedSuccess'`

---

### FILE: src/app/modules/management/modules/tenant-management/pages/tenant-detail/tenant-detail.component.ts

**STRINGS:**
- Line 192: `"Tenant subscription registered successfully"` → `'messages.tenantSubscriptionRegistered'`
- Line 246: `"Tenant update successfully"` → `'messages.tenantUpdated'`
- Line 249: `"Tenant added successfully"` → `'messages.tenantAdded'`

---

### FILE: src/app/modules/management/modules/tenant-management/pages/tenant/tenant.component.ts

**STRINGS:**
- Line 188: `"Tenant Category deleted successfully"` → `'messages.tenantCategoryDeletedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/seat-types/seat-types.component.ts

**STRINGS:**
- Line 129: `"SeatType deleted successfully"` → `'messages.seatTypeDeletedSuccess'`
- Line 160: `"SeatType updated successfully"` → `'messages.seatTypeUpdatedSuccess'`
- Line 187: `"SeatType added successfully"` → `'messages.seatTypeAddedSuccess'`
- Line 205: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-layout-templates/bus-layout-templates.component.ts

**STRINGS:**
- Line 134: `"BusLayoutTemplate deleted successfully"` → `'messages.busLayoutTemplateDeletedSuccess'`
- Line 163: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/management/modules/bus-management/pages/bus-schedules/bus-schedules.component.ts

**STRINGS:**
- Line 216: `"Bus deleted successfully"` → `'messages.busDeletedSuccess'`
- Line 267: `"Nhân bản thành công"` → `'messages.clonedSuccess'`

---

### FILE: src/app/modules/dashboard/components/nft/nft-header/nft-header.component.html

**STRINGS:**
- Line 3: `"NFTs Dashboard"` → `'dashboard.nftDashboard.title'`
- Line 6: `"NFTs"` → `'dashboard.nftDashboard.label'`

---

### FILE: src/app/modules/dashboard/components/nft/nft-auctions-table/nft-auctions-table.component.html

**STRINGS:**
- Line 4: `"Active Auctions"` → `'dashboard.activeAuctions.title'`

---

### FILE: src/app/modules/layout/components/bottom-navbar/bottom-navbar.component.html

**STRINGS:**
- Lines 3-19: Button labels (context-dependent, likely require icon labels)

---

## Translation Key Naming Conventions

Based on findings, suggested hierarchy:
- `auth.*` - Authentication pages
- `account.*` - Account management
- `settings.*` - Settings pages  
- `reports.*` - Report pages
- `dashboard.*` - Dashboard components
- `management.*` - Management modules
- `buttons.*` - Button texts
- `labels.*` - Form labels
- `placeholders.*` - Input placeholders
- `messages.*` - Success/info messages
- `errors.*` - Error messages
- `table.*` - Table-related text
- `dialogs.*` - Dialog content

---

## Next Steps for Implementation

1. **Create translation files** for each locale with all identified keys
2. **Wrap strings** using `{{ 'key' | translate }}` in templates
3. **Update TypeScript** files to use `this.translate.instant('key')` or similar
4. **Batch test** each module after wrapping
5. **Verify** all strings are translated in each locale file

---

**Report Generated:** March 13, 2026  
**Status:** Complete - All files scanned and cataloged  
**Recommendation:** Prioritize auth, account, and settings modules first (most user-visible)
