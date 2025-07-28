// Booking Types

export interface Booking {
  bookingId: number;
  requestId: number;
  userId: number;
  serviceId: number;
  addressId: number;
  status: BookingStatus;
  scheduledStartTime: string;
  scheduledEndTime: string;
  latitude: number | null;
  longitude: number | null;
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
  fullName: string;
  estimatedPrice: number;
  serviceName: string;
}

export interface PendingBooking {
  bookingId: number;
  userId: number;
  serviceId: number;
  requestId: number;
  helperId: number;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  status: BookingStatus;
  cancellationReason: string | null;
  cancelledBy: string | null;
  cancellationTime: string | null;
  freeCancellationDeadline: string | null;
  estimatedPrice: number;
  finalPrice: number | null;
  bookingCreationTime: string | null;
  serviceName?: string; 
  helperName?: string; 
}


export interface BookingDetails {
  bookingId: number;
  userId: number;
  serviceId: number;
  requestId: number;
  helperId: number;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  status: BookingStatus;
  cancellationReason: string | null;
  cancelledBy: string | null;
  cancellationTime: string | null;
  freeCancellationDeadline: string;
  estimatedPrice: number;
  finalPrice: number | null;
  bookingCreationTime: string | null;
  serviceName: string;
  helperName: string;
  // Address fields from the actual API response
  addressId?: number;
  fullAddress?: string;
  ward?: string;
  district?: string;
  city?: string;
  fullName?: string;
  latitude?: number | null;
  longitude?: number | null;
  // Legacy field for backward compatibility
  address?: string | null;
  paymentStatus: string | null;
}

export interface BookingDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BookingDetails[];
  timestamp: string;
  requestId: string;
}

export type BookingStatus = 
  | 'Pending'
  | 'Accepted'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected'
  | 'TemporaryAccepted';

export interface BookingHistoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Booking[];
  timestamp: string;
  requestId: string;
}

export interface PendingBookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PendingBooking[];
  timestamp: string;
  requestId: string;
}

export interface BookingFilter {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  serviceId?: number;
} 