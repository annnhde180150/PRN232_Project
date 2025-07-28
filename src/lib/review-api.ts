import { Review, CreateReviewRequest, UpdateReviewRequest, ReviewResponse } from '@/types/review';
import { api } from './api';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get reviews by user ID
export const getUserReviews = async (userId: number): Promise<Review[]> => {
  try {
    const response = await api.get<ReviewResponse>(`${baseURL}/api/Review/user/${userId}`);
    if (response.data.success) {
      return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    }
    throw new Error(response.data.message || 'Failed to fetch user reviews');
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

// Get reviews by helper ID
export const getHelperReviews = async (helperId: number): Promise<Review[]> => {
  try {
    const response = await api.get<ReviewResponse>(`${baseURL}/api/Review/helper/${helperId}`);
    if (response.data.success) {
      return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    }
    throw new Error(response.data.message || 'Failed to fetch helper reviews');
  } catch (error) {
    console.error('Error fetching helper reviews:', error);
    throw error;
  }
};

// Get review by ID
export const getReviewById = async (reviewId: number): Promise<Review> => {
  try {
    const response = await api.get<ReviewResponse>(`${baseURL}/api/Review/${reviewId}`);
    if (response.data.success) {
      return response.data.data as Review;
    }
    throw new Error(response.data.message || 'Failed to fetch review');
  } catch (error) {
    console.error('Error fetching review:', error);
    throw error;
  }
};

// Get review by booking ID
export const getReviewByBookingId = async (bookingId: number): Promise<Review | null> => {
  try {
    const response = await api.get<ReviewResponse>(`${baseURL}/api/Review/booking/${bookingId}`);
    if (response.data.success) {
      return response.data.data as Review;
    }
    return null; // No review found for this booking
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // No review found for this booking
      return null;
    }
    console.error('Error fetching review by booking ID:', error);
    return null;
  }
};

// Create a new review
export const createReview = async (reviewData: CreateReviewRequest): Promise<Review> => {
  // Validate data before making the API call
  if (
    !reviewData.bookingId ||
    !reviewData.helperId ||
    !reviewData.rating ||
    typeof reviewData.comment !== 'string' ||
    !reviewData.comment.trim()
  ) {
    throw new Error('Invalid review data. Please fill in all required fields.');
  }
  try {
    const response = await api.post<ReviewResponse>(`${baseURL}/api/Review`, reviewData);
    if (response.data.success) {
      return response.data.data as Review;
    }
    throw new Error(response.data.message || 'Failed to create review');
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (reviewId: number, reviewData: UpdateReviewRequest): Promise<Review> => {
  try {
    const response = await api.put<ReviewResponse>(`${baseURL}/api/Review/${reviewId}`, reviewData);
    if (response.data.success) {
      return response.data.data as Review;
    }
    throw new Error(response.data.message || 'Failed to update review');
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    const response = await api.delete<ReviewResponse>(`${baseURL}/api/Review/${reviewId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete review');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}; 