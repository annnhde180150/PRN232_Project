import axios from 'axios';
import { 
  Booking, 
  PendingBooking, 
  BookingHistoryResponse, 
  PendingBookingsResponse,
  BookingStatus,
  BookingFilter,
  BookingDetails,
  BookingDetailsResponse
} from '../types/bookings';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Booking API functions
export const bookingAPI = {
  // Get all user bookings 
  getUserBookings: async (userId: number): Promise<BookingDetails[]> => {
    const response = await api.get<BookingDetailsResponse>(`/api/Bookings/GetUserBookings/${userId}`);
    return response.data.data;
  },

  // Get helper bookings (new endpoint)
  getHelperBookings: async (helperId: number): Promise<BookingDetails[]> => {
    const response = await api.get<BookingDetailsResponse>(`/api/Bookings/GetHelperBookings/${helperId}`);
    return response.data.data;
  },

  // Get active bookings by user ID 
  getActiveBookings: async (userId: number): Promise<BookingHistoryResponse> => {
    const response = await api.get(`/api/Bookings/ActiveByUser/${userId}`);
    return response.data;
  },

  // Get pending bookings by user ID 
  getPendingBookings: async (userId: number): Promise<PendingBookingsResponse> => {
    const response = await api.get(`/api/Bookings/GetUserPendingBooking/${userId}`);
    return response.data;
  },

  // Get all bookings with filtering 
  getBookingsWithFilter: async (
    userId: number, 
    filter?: BookingFilter
  ): Promise<{ active: BookingDetails[]; pending: BookingDetails[] }> => {
    try {
      const response = await api.get<BookingDetailsResponse>(`/api/Bookings/GetUserBookings/${userId}`);
      const allBookings = response.data.data;

      // Separate bookings into active and pending based on status
      let activeBookings: BookingDetails[] = [];
      let pendingBookings: BookingDetails[] = [];

      allBookings.forEach(booking => {
        // Categorize based on status
        if (booking.status === 'Pending' || booking.status === 'Accepted') {
          pendingBookings.push(booking);
        } else {
          activeBookings.push(booking);
        }
      });

      // Apply filters if provided
      if (filter) {
        if (filter.status) {
          activeBookings = activeBookings.filter(booking => booking.status === filter.status);
          pendingBookings = pendingBookings.filter(booking => booking.status === filter.status);
        }

        if (filter.startDate) {
          const startDate = new Date(filter.startDate);
          activeBookings = activeBookings.filter(booking => 
            new Date(booking.scheduledStartTime) >= startDate
          );
          pendingBookings = pendingBookings.filter(booking => 
            new Date(booking.scheduledStartTime) >= startDate
          );
        }

        if (filter.endDate) {
          const endDate = new Date(filter.endDate);
          activeBookings = activeBookings.filter(booking => 
            new Date(booking.scheduledStartTime) <= endDate
          );
          pendingBookings = pendingBookings.filter(booking => 
            new Date(booking.scheduledStartTime) <= endDate
          );
        }

        if (filter.serviceId) {
          activeBookings = activeBookings.filter(booking => booking.serviceId === filter.serviceId);
          pendingBookings = pendingBookings.filter(booking => booking.serviceId === filter.serviceId);
        }
      }

      return {
        active: activeBookings,
        pending: pendingBookings
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID 
  getBookingById: async (bookingId: number): Promise<BookingDetails> => {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const userId = userData.id;
    
    const response = await api.get<BookingDetailsResponse>(`/api/Bookings/GetUserBookings/${userId}`);
    const allBookings = response.data.data;

    const booking = allBookings.find(b => b.bookingId === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  },

  // Update booking status
  updateBookingStatus: async (bookingId: number, helperId: number, status: string): Promise<boolean> => {
    try {
      const response = await api.put(`/api/Bookings/${bookingId}/status`, {
        bookingId,
        helperId,
        status
      });
      return response.data.success;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
}; 