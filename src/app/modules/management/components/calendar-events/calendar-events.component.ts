import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';

export interface Event {
  _id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  status: string;
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

  statusClasses: { [key: string]: string } = {
    scheduled: 'border-blue-500 bg-blue-200 text-blue-800',
    cancelled: 'border-red-500 bg-red-200 text-red-800',
    in_progress: 'border-indigo-500 bg-indigo-200 text-indigo-800',
    completed: 'border-green-500 bg-green-200 text-green-800',
    overdue: 'border-orange-500 bg-orange-200 text-orange-800'
  };

  @Input() events: Event[] = [];

  @Input() isLoadedEvent = false;

  @Output() viewDetailEventEmit = new EventEmitter<Event>();
  @Output() reLoadEventEmit = new EventEmitter<{ startDate: Date, endDate: Date }>();
  @Output() createEventEmit = new EventEmitter<Date>();

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
        ).sort((a, b) => {
          const timeA = new Date(a.startDate).getTime();
          const timeB = new Date(b.startDate).getTime();
          return timeA - timeB;
        })
      });
    }
    return dates;
  }

  // Giả sử biến this.currentWeekWiew (có thể là string hoặc Date) được dùng để xác định tuần hiện tại
  get weekDates(): Date[] {
    const current = new Date(this.currentWeekWiew);
    const dayOfWeek = current.getDay(); // 0 = Chủ Nhật, điều chỉnh nếu cần
    const startDate = new Date(current);
    startDate.setDate(current.getDate() - dayOfWeek + 1); // điều chỉnh đầu tuần là thứ 2

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d);
    }
    // Giữ lại 6 ngày phù hợp với header (ô đầu tiên dành cho nhãn giờ)
    return dates.slice(0, 7);
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
    // Tách giờ và phút từ slot
    const [slotHour, slotMinute] = slot.split(':').map(Number);

    // Xây dựng thời gian bắt đầu của khung slot cho ngày được truyền vào
    const slotStart = new Date(day);
    slotStart.setHours(slotHour, slotMinute, 0, 0);

    // Thời gian kết thúc của slot (slotStart + 30 phút)
    const slotEnd = new Date(slotStart.getTime());
    slotEnd.setMinutes(slotEnd.getMinutes() + 60);

    // Lọc các sự kiện có thời gian bắt đầu nằm trong khoảng slot
    return this.events.filter(event => {
      const eventStart = new Date(event.startDate);
      return eventStart >= slotStart && eventStart < slotEnd; // Kiểm tra khoảng thời gian
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
  eventInSlot(slot: string): any[] {
    if (this.viewMode === 'day') {
      // Return all events in the slot for the current day
      return this.getEventsForDayAndSlot(this.currentDayView, slot);
    }

    // Find the day with the most events in the slot
    const dayWithMostEvents = this.weekDates.reduce((maxDay, currentDay) => {
      const currentDayEvents = this.getEventsForDayAndSlot(currentDay, slot).length;
      const maxDayEvents = this.getEventsForDayAndSlot(maxDay, slot).length;
      return currentDayEvents > maxDayEvents ? currentDay : maxDay;
    });

    // Return the list of events for the day with the most events
    return this.getEventsForDayAndSlot(dayWithMostEvents, slot);
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
    this.backToday(); // Đặt lại ngày hiện tại
    this.viewMode = mode;

    this.emitReloadEvent();
  }

  emitReloadEvent() {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    // Tùy chỉnh startDate và endDate dựa trên viewMode
    if (this.viewMode === 'day') {
      startDate = new Date(this.currentDayView);
      endDate = new Date(this.currentDayView);
    } else if (this.viewMode === 'week' || this.viewMode === 'list') {
      startDate = this.weekRange.start;
      endDate = this.weekRange.end;
    } else if (this.viewMode === 'month') {
      startDate = new Date(this.monthDates[0].date); // Ngày đầu tháng
      endDate = new Date(this.monthDates[this.monthDates.length - 1].date); // Ngày cuối tháng
    }

    // Gửi startDate và endDate thông qua một event hoặc cập nhật logic
    if (startDate && endDate) {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      this.reLoadEventEmit.emit({ startDate, endDate });
      this.isLoadedEvent = false;
    }
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
    this.emitReloadEvent();
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

  viewDetailEvent($event: any, event: Event) {
    $event.stopPropagation();
    this.viewDetailEventEmit.emit(event)
  }

  createEvent($event: any, slot: string | null, day?: Date) {
    $event.stopPropagation();
    // If slot is null, generate the current slot from the current time
    if (!slot) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0'); // Ensure 2-digit format
      const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensure 2-digit format
      slot = `${hours}:${minutes}`; // Current time in "HH:mm" format
    }

    // Use the day if provided; otherwise, use the current date
    const baseDate = day || new Date();
    const startDate = this.convertSlotToDate(slot, baseDate);

    // Emit the startDate
    this.createEventEmit.emit(startDate);
  }


  convertSlotToDate(slot: string, baseDate: Date) {
    const [hours, minutes] = slot.split(':').map(Number);
    const date = new Date(baseDate); // Clone the base date
    date.setHours(hours, minutes, 0, 0); // Set time to match the slot
    return date;
  }

}
