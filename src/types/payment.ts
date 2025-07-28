// Payment Types

export interface Payment {
  paymentId: number;
  bookingId: number;
  userId: number;
  helperId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  transactionId: string | null;
  paymentMethod: string;
  bookingStatus: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  serviceName: string | null;
  helperName: string;
}

export type PaymentStatus = 
  | 'Pending'
  | 'Success'
  | 'Cancelled'
  | 'Failed';

export interface PaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Payment[];
  timestamp: string;
  requestId: string;
}

export interface PaymentInfo {
  paymentId: number;
  bookingId: number;
  userId: number;
  helperId: number;
  amount: number;
  paymentDate: string;
}

export interface PaymentInfoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaymentInfo;
  timestamp: string;
  requestId: string;
} 