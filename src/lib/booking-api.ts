import axios from 'axios';
import { 
  Booking, 
  PendingBooking, 
  BookingHistoryResponse, 
  PendingBookingsResponse,
  BookingStatus,
  BookingFilter
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
  ): Promise<{ active: Booking[]; pending: PendingBooking[] }> => {
    const [activeResponse, pendingResponse] = await Promise.all([
      api.get(`/api/Bookings/ActiveByUser/${userId}`),
      api.get(`/api/Bookings/GetUserPendingBooking/${userId}`)
    ]);

    let activeBookings = activeResponse.data.data as Booking[];
    let pendingBookings = pendingResponse.data.data as PendingBooking[];

    // Fetch service names and helper names for pending bookings
    if (pendingBookings.length > 0) {
      try {
        const [servicesResponse] = await Promise.all([
          api.get('/api/Service/active')
        ]);
        const services = servicesResponse.data.data as any[];
        
        // Fetch helper names for each unique helper ID
        const uniqueHelperIds = [...new Set(pendingBookings.map(booking => booking.helperId))];
        const helperPromises = uniqueHelperIds.map(async (helperId) => {
          try {
            const helperResponse = await api.get(`/api/Helper/profile/${helperId}`);
            return { helperId, helperName: helperResponse.data.data.fullName };
          } catch (error) {
            console.error(`Error fetching helper ${helperId}:`, error);
            return { helperId, helperName: `Helper #${helperId}` };
          }
        });
        
        const helperResults = await Promise.all(helperPromises);
        const helperMap = new Map(helperResults.map(h => [h.helperId, h.helperName]));
        
        pendingBookings = pendingBookings.map(booking => {
          const service = services.find(s => s.serviceId === booking.serviceId);
          const helperName = helperMap.get(booking.helperId);
          
          return {
            ...booking,
            serviceName: service?.serviceName || `Service #${booking.serviceId}`,
            helperName: helperName || `Helper #${booking.helperId}`
          };
        });
      } catch (error) {
        console.error('Error fetching service names or helper names:', error);
        // If fetch fails, keep the original data
      }
    }

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
  },

  // Get booking by ID (if needed for detailed view)
  getBookingById: async (bookingId: number): Promise<Booking | PendingBooking> => {

    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const userId = userData.id;
    
    const [activeResponse, pendingResponse] = await Promise.all([
      api.get(`/api/Bookings/ActiveByUser/${userId}`),
      api.get(`/api/Bookings/GetUserPendingBooking/${userId}`)
    ]);

    const activeBookings = activeResponse.data.data as Booking[];
    const pendingBookings = pendingResponse.data.data as PendingBooking[];

    const activeBooking = activeBookings.find(booking => booking.bookingId === bookingId);
    const pendingBooking = pendingBookings.find(booking => booking.bookingId === bookingId);

    if (activeBooking) return activeBooking;
    if (pendingBooking) return pendingBooking;

    throw new Error('Booking not found');
  }
}; 