import { Booking } from '@rsApp/modules/management/modules/booking-management/model/booking.model';

export class BaseDetailQueryDto {
  startDate!: Date;
  endDate!: Date;
  platform?: string;
  userId?: string;
  pageIdx?: number = 0;
  pageSize?: number = 20;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
  comparisonMode?: boolean = false;
  comparisonStartDate?: Date;
  comparisonEndDate?: Date;
}

export class BookingDetailQueryDto extends BaseDetailQueryDto {
  busRouteId?: string;
  status?: string;
}

export interface BookingReportGroup {
  label: string;
  date: string;
  tickets: number;
  revenue: number;
  data: Booking[];
}

export interface BookingReportResponse {
  groups: BookingReportGroup[];
  comparisonGroups?: BookingReportGroup[];
  total: number;
  totalTickets: number;
  totalRevenue: number;
  pageIdx: number;
  pageSize: number;
  totalPage: number;
  comparisonTickets?: number;
  comparisonRevenue?: number;
}
