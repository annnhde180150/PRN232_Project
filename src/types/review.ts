// Review Types

export interface Review {
  reviewId: number;
  bookingId: number;
  helperId: number;
  userId: number;
  rating: number;
  comment: string;
  reviewDate: string;
}

export interface CreateReviewRequest {
  bookingId: number;
  helperId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Review | Review[];
  timestamp: string;
  requestId: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
} 