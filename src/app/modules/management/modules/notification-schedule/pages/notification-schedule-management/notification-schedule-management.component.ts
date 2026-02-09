import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationScheduleService } from '../../services/notification-schedule.service';
import {
  NotificationSchedule,
  NotificationScheduleStatus,
  NotificationScheduleCreateRequest,
} from '../../models/notification-schedule.model';
import { Utils } from 'src/app/shared/utils/utils';
import { EventCalendar } from '@rsApp/shared/models/event-calendar.model';
import { FUNCTION_KEYS, MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

@Component({
  selector: 'app-notification-schedule-management',
  templateUrl: './notification-schedule-management.component.html',
  styleUrls: ['./notification-schedule-management.component.scss'],
  standalone: false,
})
export class NotificationScheduleManagementComponent implements OnInit {
  notificationSchedule: NotificationSchedule[] = [];
  isLoadingSchedules = false;
  selectedSchedule: NotificationSchedule | null = null;
  viewMode: 'calendar' | 'table' = 'calendar';

  moduleKeys = MODULE_KEYS;
  functionKeys = FUNCTION_KEYS;

  constructor(
    private notificationScheduleService: NotificationScheduleService,
    private utils: Utils,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(startDate?: Date, endDate?: Date): void {
    this.isLoadingSchedules = true;
    const filters = startDate && endDate ? { startDate, endDate } : undefined;

    this.notificationScheduleService.getNotificationSchedules(filters).subscribe({
      next: (data) => {
        this.notificationSchedule = data;
        this.isLoadingSchedules = false;
      },
      error: (err) => {
        console.error('Error loading schedules:', err);
        this.isLoadingSchedules = false;
      },
    });
  }

  convertToCalendarEventData(notificationSchedule: NotificationSchedule[]): EventCalendar[] {
    // Kiểm tra xem busSchedules có dữ liệu hay không
    if (!notificationSchedule || notificationSchedule.length === 0) {
      return [];
    }

    const events: EventCalendar[] = notificationSchedule
      .filter((schedule: NotificationSchedule) => schedule._id !== undefined)
      .map((schedule: NotificationSchedule) => {
        return {
          _id: schedule._id as string,
          name: schedule.title || 'Unnamed Event',
          startDate: schedule.scheduledDate || new Date(),
          status: schedule.status,
        };
      });
    return events;
  }

  onDateRangeChanged(dateRange: { startDate: Date; endDate: Date }): void {
    this.loadSchedules(dateRange.startDate, dateRange.endDate);
  }

  onCreateEvent(date: Date): void {
    this.goToScheduleDetail(null, date);
  }

  onViewDetailEvent(schedule: NotificationSchedule): void {
    this.goToScheduleDetail(schedule);
  }

  goToScheduleDetail(schedule: NotificationSchedule | null, defaultDate?: Date): void {
    if (schedule?._id) {
      // Edit mode - navigate to detail page with ID
      this.router.navigate(['/management/notification-management/notification-schedule/detail', schedule._id], {
        state: { schedule },
      });
    } else {
      // Create mode - navigate to detail page
      this.router.navigate(['/management/notification-management/notification-schedule/detail', 'new'], {
        state: { defaultDate },
      });
    }
  }

  deleteSchedule(schedule: NotificationSchedule): void {
    if (!schedule._id) return;

    if (confirm('Are you sure you want to delete this notification schedule?')) {
      this.notificationScheduleService.deleteNotificationSchedule(schedule._id).subscribe({
        next: () => {
          this.loadSchedules();
        },
        error: (err) => {
          console.error('Error deleting schedule:', err);
        },
      });
    }
  }

  cancelSchedule(schedule: NotificationSchedule): void {
    if (!schedule._id) return;

    this.notificationScheduleService.cancelSchedule(schedule._id).subscribe({
      next: () => {
        this.loadSchedules();
      },
      error: (err) => {
        console.error('Error cancelling schedule:', err);
      },
    });
  }

  sendNow(schedule: NotificationSchedule): void {
    if (!schedule._id) return;

    if (confirm('Are you sure you want to send this notification now?')) {
      this.notificationScheduleService.sendNow(schedule._id).subscribe({
        next: () => {
          this.loadSchedules();
        },
        error: (err) => {
          console.error('Error sending notification:', err);
        },
      });
    }
  }

  getStatusBadgeClass(status: NotificationScheduleStatus): string {
    const classes: Record<NotificationScheduleStatus, string> = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-yellow-100 text-yellow-800',
    };
    return classes[status] || classes.draft;
  }

  getStatusLabel(status: NotificationScheduleStatus): string {
    const labels: Record<NotificationScheduleStatus, string> = {
      draft: 'Draft',
      scheduled: 'Scheduled',
      sent: 'Sent',
      failed: 'Failed',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }

  trackBySchedule(index: number, item: NotificationSchedule): string {
    return item._id || index.toString();
  }

  editNotificationSchedule(schedule: any): void {
    const notificationSchedule = schedule as NotificationSchedule;
    this.goToScheduleDetail(notificationSchedule);
  }

  cloneData(schedule: any): void {
    const notificationSchedule = schedule as NotificationSchedule;
  }

  addNotificationSchedule(event: any): void {
    event.stopPropagation();
    this.goToScheduleDetail(null);
  }

  reLoadDataEvent(event: any): void {
    event.stopPropagation();
    this.loadSchedules();
  }
}
