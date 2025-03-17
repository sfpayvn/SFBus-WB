import { Component, Input, OnInit } from '@angular/core';
import { BusSchedule, SearchBusSchedule } from '../../pages/bus-schedules/model/bus-schedule.model';
import { BusSchedulesService } from '../../pages/bus-schedules/service/bus-schedules.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';

export interface Event {
  name: string;
  startDate: Date;
  endDate?: Date;
}

@Component({
  selector: 'app-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.scss'],
  standalone: false
})
export class CalendarEventsComponent implements OnInit {
  viewMode: 'list' | 'day' | 'week' | 'month' = 'week';

  currentDate = new Date();
  currentDayView: Date = new Date();
  currentWeekWiew: Date = new Date();
  currentMonthWiew: Date = new Date();

  isViewAllEvent: boolean = false
  activePopover: Event[] | null = null;
  @Input() events: Event[] = [];

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
  ) { }

  ngOnInit(): void {
    // Tính ngày bắt đầu của tuần hiện tại:
    const today = this.utils.getCurrentDate();
    const dayOfWeek = today.getDay(); // 0 = Chủ Nhật
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    // Hàm tiện ích tạo Date dựa trên ngày đầu của tuần, thêm số ngày offset và thời gian
    const createEventDate = (dayOffset: number, hours: number, minutes: number = 0) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + dayOffset);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };
  }

  get weekDays(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  get monthDates(): { date: Date, isCurrentMonth: boolean, events: Event[] }[] {
    const dates: { date: Date, isCurrentMonth: boolean, events: Event[] }[] = [];
    const startOfMonth = new Date(this.currentMonthWiew.getFullYear(), this.currentMonthWiew.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonthWiew.getFullYear(), this.currentMonthWiew.getMonth() + 1, 0);

    // Tìm ngày bắt đầu (bao gồm các ngày trong tuần trước của tháng trước)
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    // Tìm ngày kết thúc (bao gồm các ngày trong tuần sau của tháng sau)
    const endOfWeek = new Date(endOfMonth);
    endOfWeek.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay()));

    for (let date = new Date(startOfWeek); date <= endOfWeek; date.setDate(date.getDate() + 1)) {
      dates.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === this.currentMonthWiew.getMonth(),
        events: this.events.filter(event =>
          this.utils.compareDate(event.startDate, date) // So sánh ngày đúng cách
        )
      });
    }
    return dates;
  }

  // Giả sử biến this.currentWeekWiew (có thể là string hoặc Date) được dùng để xác định tuần hiện tại
  get weekDates(): Date[] {
    const current = new Date(this.currentWeekWiew);
    const dayOfWeek = current.getDay(); // 0 = Chủ Nhật, điều chỉnh nếu cần
    const startDate = new Date(current);
    startDate.setDate(current.getDate() - dayOfWeek);
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d);
    }
    // Giữ lại 6 ngày phù hợp với header (ô đầu tiên dành cho nhãn giờ)
    return dates.slice(0, 6);
  }

  // Lấy khoảng thời gian của tuần để hiển thị tiêu đề (header)
  get weekRange(): { start: Date; end: Date } {
    const dates = this.weekDates;
    return { start: dates[0], end: dates[dates.length - 1] };
  }

  // Sinh các slot chia theo 30 phút (từ 00:00 đến 23:30)
  get halfHourSlots(): string[] {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const h = hour < 10 ? `0${hour}` : `${hour}`;
      slots.push(`${h}:00`);
    }
    return slots;
  }

  // Lọc các sự kiện phù hợp với ngày và giờ (slot) hiện tại.
  // Lưu ý: Giả sử utils.formatTime trả về thời gian theo định dạng "HH:mm"
  getEventsForDayAndSlot(day: Date, slot: string): any[] {
    // Tách giờ và phút của slot
    const [slotHour, slotMinute] = slot.split(':').map(Number);

    // Xây dựng thời gian bắt đầu của khung slot cho ngày được truyền vào
    const slotStart = new Date(day);
    slotStart.setHours(slotHour, slotMinute, 0, 0);

    // Tính thời gian kết thúc của slot (slotStart + 30 phút)
    const slotEnd = new Date(slotStart.getTime());
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    // Lọc các event có thời gian bắt đầu nằm trong khoảng của slot
    return this.events.filter(event => {
      const eventStart = new Date(event.startDate);
      return eventStart >= slotStart && eventStart < slotEnd;
    }).sort((a, b) => {
      const timeA = new Date(a.startDate).getTime();
      const timeB = new Date(b.startDate).getTime();
      return timeA - timeB;
    });
  }

  getEventsForDay(day: Date): Event[] {
    const target = day.toDateString();
    return (this.events ?? [])
      .filter(event => new Date(event.startDate).toDateString() === target)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  // Hàm kiểm tra nếu cho slot cụ thể có event nào của bất kỳ ngày nào trong week không
  hasEventInSlot(slot: string): boolean {
    // weekDates là mảng các ngày trong tuần đã tính toán trước đó
    if (this.viewMode == 'day') {
      return this.getEventsForDayAndSlot(this.currentDayView, slot).length > 0;
    }
    return this.weekDates.some(day => this.getEventsForDayAndSlot(day, slot).length > 0);
  }

  // Mảng các khung giờ (ví dụ từ 07:00 đến 12:00)
  get timeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = 0; hour <= 23; hour++) {
      const hr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      slots.push(hr);
    }
    return slots;
  }

  backToday() {
    this.currentMonthWiew = this.currentWeekWiew = this.currentDayView = this.utils.getCurrentDate();
  }

  // Chuyển đổi giữa các chế độ view
  changeView(mode: 'list' | 'day' | 'week' | 'month'): void {
    this.backToday();
    this.viewMode = mode;
  }

  // Chức năng chuyển tuần: delta = -1 (tuần trước), delta = 1 (tuần sau)
  navigatePeriod(delta: number): void {
    if (this.viewMode === 'day') {
      // Chuyển qua ngày tiếp theo hoặc trước đó
      const newDate = new Date(this.currentDayView);
      newDate.setDate(newDate.getDate() + delta);
      this.currentDayView = newDate;
    } else if (this.viewMode === 'week' || this.viewMode === 'list') {
      // Chuyển qua tuần tiếp theo hoặc trước đó
      const newWeekDate = new Date(this.currentWeekWiew);
      newWeekDate.setDate(newWeekDate.getDate() + delta * 7);
      this.currentWeekWiew = newWeekDate;
    } else if (this.viewMode === 'month') {
      // Chuyển qua tháng tiếp theo hoặc trước đó
      const newMonthDate = new Date(this.currentMonthWiew);
      newMonthDate.setMonth(newMonthDate.getMonth() + delta);
      this.currentMonthWiew = newMonthDate;
    }
  }

  // Kiểm tra xem ngày có phải hôm nay không (để hiển thị bằng màu đặc biệt)
  isToday(day: Date): boolean {
    const today = this.utils.getCurrentDate();
    return (
      day.getFullYear() === today.getFullYear() &&
      day.getMonth() === today.getMonth() &&
      day.getDate() === today.getDate()
    );
  }

  // Kiểm tra sự kiện có nằm trong tuần hiện tại không
  isEventInWeek(event: Event): boolean {
    const startDateString = event.startDate;
    if (!startDateString) {
      return false;
    }

    // Tạo đối tượng Date và chỉ lấy phần ngày (bỏ qua giờ, phút, giây)
    const startDate = new Date(startDateString);
    const eventDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    // Lấy phần ngày của weekRange.start và weekRange.end
    const weekStart = new Date(
      this.weekRange.start.getFullYear(),
      this.weekRange.start.getMonth(),
      this.weekRange.start.getDate()
    );
    const weekEnd = new Date(
      this.weekRange.end.getFullYear(),
      this.weekRange.end.getMonth(),
      this.weekRange.end.getDate()
    );

    // Nếu ngày của sự kiện nằm trong khoảng (bao gồm cả weekStart và weekEnd) thì trả về true
    return eventDate >= weekStart && eventDate <= weekEnd;
  }

  showPopover(events: Event[]): void {
    this.activePopover = events;
  }

  // Hide Popover Content
  hidePopover(): void {
    this.activePopover = null;
  }

  // Optimize *ngFor with trackBy
  trackByDate(index: number, item: { date: Date }): string {
    return item.date.toISOString();
  }

  trackByDateWeek(index: number, item: Date) {
    return item.toISOString();
  }

  trackByEvent(index: number, item: Event): string {
    return item.name + item.startDate.toISOString();
  }

  visibleChange(visible: boolean, events: Event[]) {
    this.activePopover = visible ? events : [];
  }
}
