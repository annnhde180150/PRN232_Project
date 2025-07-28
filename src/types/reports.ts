// Admin Report Types
export interface BusinessOverview {
  totalUsers: number;
  totalHelpers: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalServices: number;
  totalReviews: number;
  lastUpdated: string;
  growthMetrics: {
    userGrowthRate: number;
    helperGrowthRate: number;
    bookingGrowthRate: number;
    revenueGrowthRate: number;
    growthPeriod: string;
  };
}

export interface MonthlyTrend {
  year: number;
  month: number;
  monthName: string;
  revenue: number;
  platformFees: number;
  helperEarnings: number;
  transactionCount: number;
  growthRate: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  netRevenue: number;
  platformFees: number;
  helperEarnings: number;
  averageTransactionValue: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  paymentSuccessRate: number;
  monthlyTrend: MonthlyTrend[];
  paymentMethods: any[];
  revenueByService: any[];
  analyticsPeriodStart: string;
  analyticsPeriodEnd: string;
}

export interface ServicePerformance {
  serviceId: number;
  serviceName: string;
  bookingsCount: number;
  totalRevenue: number;
  averageRating: number;
  marketShare: number;
}

export interface ServiceBreakdown {
  serviceId: number;
  serviceName: string;
  bookingsCount: number;
  totalEarnings: number;
  averageRating: number;
  completionRate: number;
}

export interface EarningsTrend {
  year: number;
  month: number;
  monthName: string;
  earnings: number;
  bookingsCount: number;
}

export interface HelperRanking {
  helperId: number;
  helperName: string;
  email: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  totalEarnings: number;
  averageBookingValue: number;
  averageResponseTime: number;
  totalHoursWorked: number;
  earningsTrend: EarningsTrend[];
  serviceBreakdown: ServiceBreakdown[];
  bookingTrend: any[];
  analyticsPeriodStart: string;
  analyticsPeriodEnd: string;
}

export interface PopularService {
  serviceId: number;
  serviceName: string;
  bookingsCount: number;
  totalRevenue: number;
  averageRating: number;
  marketShare: number;
}

export interface PeakHour {
  hour: number;
  timeRange: string;
  bookingsCount: number;
  percentage: number;
}

export interface BookingAnalytics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  totalBookingValue: number;
  completionRate: number;
  cancellationRate: number;
  bookingTrend: any[];
  popularServices: PopularService[];
  peakHours: PeakHour[];
  statusBreakdown: any[];
  analyticsPeriodStart: string;
  analyticsPeriodEnd: string;
}

// Helper Report Types
export interface HelperEarnings {
  helperId: number;
  helperName: string;
  email: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  totalEarnings: number;
  averageBookingValue: number;
  averageResponseTime: number;
  totalHoursWorked: number;
  earningsTrend: EarningsTrend[];
  serviceBreakdown: ServiceBreakdown[];
  bookingTrend: any[];
  analyticsPeriodStart: string;
  analyticsPeriodEnd: string;
}

export interface HelperScheduleAnalytics {
  totalHoursWorked: number;
  averageBookingValue: number;
  bookingTrend: any[];
  earningsTrend: EarningsTrend[];
  period: {
    start: string;
    end: string;
  };
}

// Customer Report Types
export interface BookingTrendItem {
  date: string;
  bookingsCount: number;
  earningsAmount: number;
}

export interface CustomerBookings {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  totalBookingValue: number;
  completionRate: number;
  cancellationRate: number;
  bookingTrend: BookingTrendItem[];
  popularServices: any[];
  peakHours: any[];
  statusBreakdown: any[];
  analyticsPeriodStart: string;
  analyticsPeriodEnd: string;
}

export interface SpendingTrend {
  year: number;
  month: number;
  monthName: string;
  revenue: number;
  platformFees: number;
  helperEarnings: number;
  transactionCount: number;
  growthRate: number;
}

export interface CustomerSpending {
  totalSpent: number;
  averageSpendingPerBooking: number;
  paymentMethods: any[];
  spendingTrend: SpendingTrend[];
  period: {
    start: string;
    end: string;
  };
}

export interface FavoriteHelper {
  helperId: number;
  helperName: string;
  email: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  totalEarnings: number;
  averageBookingValue: number;
  averageResponseTime: number;
  totalHoursWorked: number;
  earningsTrend: EarningsTrend[];
  serviceBreakdown: ServiceBreakdown[];
  bookingTrend: any[];
  analyticsPeriodStart: string;
  analyticsPeriodEnd: string;
}

// Favorite Helper Types
export interface FavoriteHelperItem {
  favoriteId: number;
  userId: number;
  helperId: number;
  dateAdded: string;
  helperInfo: {
    helperId: number;
    fullName: string;
    email: string;
    profilePictureUrl: string;
  };
}

export interface FavoriteHelperResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: FavoriteHelperItem[];
  timestamp: string;
  requestId: string;
}

export interface AddFavoriteRequest {
  userId: number;
  helperId: number;
}

export interface RemoveFavoriteRequest {
  userId: number;
  helperId: number;
}

// API Response Types
export interface ReportApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
}

// Period types for API requests
export type ReportPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface HelperWorkArea {
  workAreaId: number;
  helperId: number;
  city: string;
  district: string;
  ward: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  helper: any;
}

export interface HelperSearchResult {
  helperId: number;
  helperName: string;
  serviceName: string;
  bio: string;
  rating: number;
  helperWorkAreas: HelperWorkArea[];
  basePrice: number;
  availableStatus: string;
}

export interface SearchHelperResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: HelperSearchResult[];
  timestamp: string;
  requestId: string;
} 