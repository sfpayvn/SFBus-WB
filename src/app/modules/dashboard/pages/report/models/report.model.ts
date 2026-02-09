export interface StatsRequest {
  startDate: string;
  endDate: string;
  comparisonMode: boolean;
  comparisonStartDate?: string;
  comparisonEndDate?: string;
}

export interface BookingStatsResponse {
  totalBookings: number;
  totalRevenue: number;
  totalSchedules: number;
  totalGoods: number;
  bookingsByDate: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  topRoutes: Array<{
    route: string;
    bookings: number;
    revenue: number;
    percentage: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: 'booking' | 'goods';
    customer: string;
    route: string;
    amount: number;
    time: string;
    status: string;
  }>;
}

export interface StatisticCard {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  bgColor: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  percentage: number;
}

export interface TopRoutesQuery {
  startDate: string;
  endDate: string;
}

export interface TopRouteItem {
  routeId: string;
  routeName: string;
  ticketCount: number;
  percentage: number;
  revenue: number;
}

export interface TopRoutesResponse {
  data: TopRouteItem[];
  total: number;
  totalRevenue: number;
  metadata: {
    startDate: string;
    endDate: string;
  };
}

export interface PaymentMethod {
  _id: string;
  method: string;
  count: number;
  percentage: number;
  color: string;
  image: string;
  name: string;
}

export interface Transaction {
  id: string;
  type: 'booking' | 'goods';
  customer: string;
  route: string;
  amount: number;
  time: string;
  status: string;
}

export interface ChartStatsRequest {
  startDate: string;
  endDate: string;
  comparisonStartDate?: string;
  comparisonEndDate?: string;
  comparisonMode: boolean;
}

export interface ChartStatsResponse {
  current: {
    labels: string[];
    data: number[];
    total: number;
    average: number;
  };
  previous?: {
    labels: string[];
    data: number[];
    total: number;
    average: number;
  };
  metadata: {
    startDate: string;
    endDate: string;
    comparisonStartDate?: string;
    comparisonEndDate?: string;
    groupBy: string;
  };
}
