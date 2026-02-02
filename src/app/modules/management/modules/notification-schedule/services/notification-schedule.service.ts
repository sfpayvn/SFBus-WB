import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  NotificationSchedule,
  NotificationScheduleCreateRequest,
  NotificationScheduleUpdateRequest,
  NotificationScheduleFilterOptions,
} from '../models/notification-schedule.model';
import { ApiGatewayService } from '@rsApp/api-gateway/api-gateaway.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationScheduleService {
  constructor(private apiGateway: ApiGatewayService) {}

  /**
   * Get all notification schedules with optional filtering
   */
  getNotificationSchedules(
    filters?: NotificationScheduleFilterOptions,
  ): Observable<NotificationSchedule[]> {
    return this.apiGateway.get('/notification-schedules', filters, {
      feature: { module: 'notification-management', function: 'list-schedules' },
      skipLoading: false,
    });
  }

  /**
   * Get notification schedule by ID
   */
  getNotificationScheduleById(id: string): Observable<NotificationSchedule> {
    return this.apiGateway.get(`/notification-schedules/${id}`, {}, {
      feature: { module: 'notification-management', function: 'view-schedule' },
      skipLoading: false,
    });
  }

  /**
   * Create a new notification schedule
   */
  createNotificationSchedule(data: NotificationScheduleCreateRequest): Observable<NotificationSchedule> {
    return this.apiGateway.post('/notification-schedules', data, {
      feature: { module: 'notification-management', function: 'create-schedule' },
      skipLoading: false,
    });
  }

  /**
   * Update an existing notification schedule
   */
  updateNotificationSchedule(id: string, data: NotificationScheduleUpdateRequest): Observable<NotificationSchedule> {
    return this.apiGateway.put(`/notification-schedules/${id}`, data, {
      feature: { module: 'notification-management', function: 'update-schedule' },
      skipLoading: false,
    });
  }

  /**
   * Delete a notification schedule
   */
  deleteNotificationSchedule(id: string): Observable<any> {
    return this.apiGateway.delete(`/notification-schedules/${id}`, {
      feature: { module: 'notification-management', function: 'delete-schedule' },
      skipLoading: false,
    });
  }

  /**
   * Get notification schedules for a date range (for calendar view)
   */
  getSchedulesForDateRange(startDate: Date, endDate: Date): Observable<NotificationSchedule[]> {
    return this.apiGateway.get('/notification-schedules/date-range', { startDate, endDate }, {
      feature: { module: 'notification-management', function: 'view-schedule-range' },
      skipLoading: false,
    });
  }

  /**
   * Cancel a scheduled notification
   */
  cancelSchedule(id: string): Observable<any> {
    return this.apiGateway.put(`/notification-schedules/${id}/cancel`, {}, {
      feature: { module: 'notification-management', function: 'cancel-schedule' },
      skipLoading: false,
    });
  }

  /**
   * Send notification immediately
   */
  sendNow(id: string): Observable<any> {
    return this.apiGateway.post(`/notification-schedules/${id}/send-now`, {}, {
      feature: { module: 'notification-management', function: 'send-notification' },
      skipLoading: false,
    });
  }

  /**
   * Get notification schedule statistics
   */
  getStatistics(startDate?: Date, endDate?: Date): Observable<any> {
    return this.apiGateway.get('/notification-schedules/statistics', { startDate, endDate }, {
      feature: { module: 'notification-management', function: 'view-statistics' },
      skipLoading: true,
    });
  }
}
