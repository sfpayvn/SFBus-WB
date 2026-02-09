export enum NotificationScheduleStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum NotificationScheduleFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface NotificationRecipient {
  userId: string;
  email?: string;
  phoneNumber?: string;
}

export interface NotificationSchedule {
  _id?: string;
  tenantId: string;
  title: string;
  scheduleNumber: string;
  description: string;
  content: string;
  recipients: NotificationRecipient[];
  scheduledDate: Date;
  scheduledTime: string; // Format: HH:mm
  frequency: NotificationScheduleFrequency;
  status: NotificationScheduleStatus;
  isActive: boolean;
  endDate?: Date; // For recurring schedules
  sentCount: number;
  failedCount: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationScheduleCreateRequest {
  title: string;
  description: string;
  content: string;
  recipients: NotificationRecipient[];
  scheduledDate: Date;
  scheduledTime: string;
  frequency: NotificationScheduleFrequency;
  endDate?: Date;
  notes?: string;
}

export interface NotificationScheduleUpdateRequest extends Partial<NotificationScheduleCreateRequest> {
  status?: NotificationScheduleStatus;
  isActive?: boolean;
}

export interface NotificationScheduleFilterOptions {
  startDate?: Date;
  endDate?: Date;
  status?: NotificationScheduleStatus;
  frequency?: NotificationScheduleFrequency;
  isActive?: boolean;
}
