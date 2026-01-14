import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { toast } from 'ngx-sonner';
import moment from 'moment-timezone';
import 'moment/locale/vi';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  ref: ComponentRef<any> | undefined;

  VN_MOBILE_REX = /^(?:(?:\+|00)84|0)(?:[35789])\d{8}$/;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  createComponent(component: any, emlement: any, params: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.ref && this.ref.destroy();
    this.ref = emlement.createComponent(factory, 0);
    if (params && this.ref) {
      this.ref.instance.params = params;
    }
  }

  clearComponent() {
    this.ref && this.ref.destroy();
  }

  createRange(number: any) {
    return new Array(number).fill(0).map((n, index) => index + 1);
  }

  // Mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  handleRequestError(error: any): void {
    const msg = 'Oh No! Some things wrong error';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.error?.message || 'Please try again later',
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  isValidObjectId(id: string): boolean {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  }

  getCurrentDate(): Date {
    // Lấy timestamp tại timezone Asia/Ho_Chi_Minh và tạo đối tượng Date
    const now = moment().tz('Asia/Ho_Chi_Minh').toDate();
    return now;
  }

  converToTimeZone(date: Date): Date {
    // Chuyển đổi đối tượng Date sang múi giờ Asia/Ho_Chi_Minh
    const converted = moment(date).tz('Asia/Ho_Chi_Minh').toDate();
    return converted;
  }

  getCurrentDateInISO(): string {
    // Lấy ngày giờ hiện tại tại timezone Asia/Ho_Chi_Minh và định dạng ISO string
    return moment().tz('Asia/Ho_Chi_Minh').format();
  }

  formatDateToISOString(date: Date): string {
    // Định dạng ngày tháng theo kiểu ISO string với timezone Asia/Ho_Chi_Minh
    return moment(date).tz('Asia/Ho_Chi_Minh').format();
  }

  isISODateString(dateString: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
    return isoDatePattern.test(dateString);
  }

  formatDate(date: Date) {
    if (!date) return '';

    // Đảm bảo date là một Date object hợp lệ
    const validDate = new Date(date);

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(validDate.getTime())) {
      return '';
    }

    // Lấy ngày, tháng, năm từ đối tượng Date
    const day = validDate.getDate().toString().padStart(2, '0');
    const month = (validDate.getMonth() + 1).toString().padStart(2, '0');
    const year = validDate.getFullYear();

    // Trả về chuỗi định dạng 'DD/MM/YYYY'
    return `${day}/${month}/${year}`;
  }

  formatDateFromISOString(dateString: string) {
    if (!this.isISODateString(dateString)) {
      return '';
    }
    // Tạo đối tượng Date từ chuỗi định dạng 'MM/DD/YYYY, h:mm:ss A'
    const date = new Date(dateString);

    // Lấy ngày, tháng, năm từ đối tượng Date
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Trả về chuỗi định dạng 'DD/MM/YYYY'
    return `${day}/${month}/${year}`;
  }

  formatToDateWeek(date: Date): string {
    return moment(date).tz('Asia/Ho_Chi_Minh').locale('vi').format('ddd, D');
  }

  formatToDay(date: Date): string {
    // Chuyển đổi date sang múi giờ "Asia/Ho_Chi_Minh" và lấy ngày dưới dạng số
    return moment(date).tz('Asia/Ho_Chi_Minh').format('D');
  }

  /**
   * Trả về chuỗi tháng dạng "tháng X", ví dụ: "tháng 3", "tháng 12"
   */
  formatToMonthText(date: Date): string {
    // Chuyển đổi date sang múi giờ "Asia/Ho_Chi_Minh"
    const m = moment(date).tz('Asia/Ho_Chi_Minh');

    // Mảng tên tháng bằng chữ tiếng Việt
    const monthNames: string[] = [
      'Một',
      'Hai',
      'Ba',
      'Tư',
      'Năm',
      'Sáu',
      'Bảy',
      'Tám',
      'Chín',
      'Mười',
      'Mười Một',
      'Mười Hai',
    ];
    // Lấy số tháng (tháng tính từ 0) và trả về chuỗi định dạng
    return `Tháng ${monthNames[m.month()]}`;
  }

  formatToMonth(date: Date): string {
    return moment(date).tz('Asia/Ho_Chi_Minh').format('M');
  }
  /**
   * Định dạng khoảng tuần dựa vào ngày bắt đầu và ngày kết thúc.
   * - Nếu cùng tháng và cùng năm: "6 - 12 tháng 3 2025"
   * - Nếu cùng năm nhưng khác tháng: "6 tháng 3 - 12 tháng 4, 2025"
   * - Nếu khác năm: "6 tháng 12, 2025 - 12 tháng 1, 2026"
   *
   * @param start ngày bắt đầu
   * @param end   ngày kết thúc
   * @returns chuỗi định dạng khoảng tuần
   */
  formatWeekRange(start: Date, end: Date): string {
    const startDay = this.formatToDay(start); // Ví dụ: "6"
    const endDay = this.formatToDay(end); // Ví dụ: "12"
    const startMonthText = this.formatToMonthText(start); // Ví dụ: "tháng 3"
    const endMonthText = this.formatToMonthText(end); // Ví dụ: "tháng 4"
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    if (startYear === endYear) {
      // Cùng năm
      if (start.getMonth() === end.getMonth()) {
        // Cùng tháng & năm: 6 - 12 tháng 3 2025
        return `${startDay} - ${endDay} ${startMonthText} ${startYear}`;
      } else {
        // Khác tháng nhưng cùng năm: 6 tháng 3 - 12 tháng 4, 2025
        return `${startDay} ${startMonthText} - ${endDay} ${endMonthText}, ${startYear}`;
      }
    } else {
      // Khác năm: 6 tháng 12, 2025 - 12 tháng 1, 2026
      return `${startDay} ${startMonthText}, ${startYear} - ${endDay} ${endMonthText}, ${endYear}`;
    }
  }

  formatToMonthYear(date: Date): string {
    // Định dạng ngày theo "MMMM D, YYYY" (ví dụ: "March 1, 2025") với timezone Asia/Ho_Chi_Minh
    return moment(date).tz('Asia/Ho_Chi_Minh').format('MMMM, YYYY');
  }

  formatToFullDate(date: Date): string {
    // Định dạng ngày theo "MMMM D, YYYY" (ví dụ: "March 1, 2025") với timezone Asia/Ho_Chi_Minh
    return moment(date).tz('Asia/Ho_Chi_Minh').format('MMMM D, YYYY');
  }

  formatToDateMonth(date: Date): string {
    // Chỉ lấy ngày và tháng với timezone Asia/Ho_Chi_Minh
    return moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM');
  }

  getDayOfWeek(date: string): string {
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    // Tạo đối tượng Date từ chuỗi định dạng 'MM/DD/YYYY, h:mm:ss A'
    const formattedDate = new Date(date);

    if (formattedDate.toString() === 'Invalid Date') {
      return 'Ngày không hợp lệ';
    }

    return daysOfWeek[formattedDate.getDay()];
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  convertDateToTimestamp(date: string): number {
    return new Date(date).getTime() / 1000;
  }

  formatTime(date: Date): string {
    if (!date) return '';

    // Đảm bảo date là một Date object hợp lệ
    const validDate = new Date(date);

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(validDate.getTime())) {
      return '';
    }

    const hours = validDate.getHours().toString().padStart(2, '0');
    const minutes = validDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  compareDate(date1: Date, date2: Date): boolean {
    if (!date1 || !date2) return false;

    const validDate1 = new Date(date1);
    const validDate2 = new Date(date2);

    // Kiểm tra xem cả hai date có hợp lệ không
    if (isNaN(validDate1.getTime()) || isNaN(validDate2.getTime())) {
      return false;
    }

    return (
      validDate1.getFullYear() === validDate2.getFullYear() &&
      validDate1.getMonth() === validDate2.getMonth() &&
      validDate1.getDate() === validDate2.getDate()
    );
  }

  generateColorsFromId(identifier: string): { bg: string; text: string } {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Đảm bảo hash nằm trong phạm vi số nguyên
    }

    let bgColor = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      bgColor += ('00' + value.toString(16)).slice(-2);
    }

    // Tính độ sáng của màu nền (Relative Luminance)
    const r = parseInt(bgColor.slice(1, 3), 16) / 255;
    const g = parseInt(bgColor.slice(3, 5), 16) / 255;
    const b = parseInt(bgColor.slice(5, 7), 16) / 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Chọn màu chữ dựa trên độ sáng
    const textColor = luminance > 0.8 ? '#000000' : '#FFFFFF'; // Sáng → chữ đen, tối → chữ trắng

    return { bg: bgColor, text: textColor };
  }

  normalizeAndStringify(obj: any): string {
    if (obj == null) return '';

    if (typeof obj !== 'object') return String(obj);

    if (Array.isArray(obj)) {
      return '[' + obj.map(this.normalizeAndStringify.bind(this)).join(',') + ']';
    }

    const keys = Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .sort();
    return '{' + keys.map((k) => `"${k}":${this.normalizeAndStringify(obj[k])}`).join(',') + '}';
  }

  hashToken(obj: any): string {
    const str = this.normalizeAndStringify(obj);
    // Tạo token dạng hash số (rất nhanh)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) | 0;
    }
    return String(hash);
  }

  parseTimeHmToMilliseconds(value: string): number {
    if (!value) return 60 * 60 * 1000; // Default: 1 hour

    const trimmed = value.trim().toLowerCase();

    // Match number with optional unit
    const match = trimmed.match(/^(\d+(?:\.\d+)?)?([hm])?$/);
    if (!match) return 60 * 60 * 1000; // Default if invalid format

    const number = match[1] ? parseFloat(match[1]) : 1; // Default number is 1
    const unit = match[2] || 'h'; // Default unit is 'h' (hours)

    if (unit === 'h') {
      return number * 60 * 60 * 1000; // Convert hours to milliseconds
    } else if (unit === 'm') {
      return number * 60 * 1000; // Convert minutes to milliseconds
    }

    return 60 * 60 * 1000; // Default: 1 hour
  }
}
