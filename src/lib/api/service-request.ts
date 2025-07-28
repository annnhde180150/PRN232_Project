import axios from 'axios';
import {
    ApiResponse,
    Address,
    Service,
    ServiceRequest,
    CreateServiceRequestData,
    Booking,
    BookHelperData,
    CancelBookingData,
    Review,
    BookingServiceName
} from '@/types/service-request';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
        'accept': '*/*'
    }
});

// Service Request APIs
export const serviceRequestApi = {
    // Create service request
    createRequest: async (data: CreateServiceRequestData): Promise<ApiResponse<ServiceRequest>> => {
        const response = await api.post('/api/ServiceRequests/CreateRequest', data);
        return response.data;
    },

    // Get service request by ID
    getRequest: async (requestId: number): Promise<ApiResponse<ServiceRequest>> => {
        const response = await api.get(`/api/ServiceRequests/GetRequest/${requestId}`);
        return response.data;
    },

    // Edit service request
    editRequest: async (data: ServiceRequest): Promise<ApiResponse<ServiceRequest>> => {
        const response = await api.put('/api/ServiceRequests/EditRequest', data);
        return response.data;
    },

    // Delete service request
    deleteRequest: async (requestId: number): Promise<ApiResponse<string>> => {
        const response = await api.delete(`/api/ServiceRequests/DeleteRequest/${requestId}`);
        return response.data;
    },

    // Get available requests
    getAvailableRequests: async (): Promise<ApiResponse<ServiceRequest[]>> => {
        const response = await api.get('/api/ServiceRequests/GetAvailableRequests');
        return response.data;
    }
};

// Booking APIs
export const bookingApi = {
    // Book helper
    bookHelper: async (helperId: number, data: BookHelperData): Promise<ApiResponse<Booking>> => {
        const response = await api.post(`/api/Bookings/BookHelper/${helperId}`, data);
        return response.data;
    },

    // Get booking by ID
    getBooking: async (bookingId: number): Promise<ApiResponse<Booking>> => {
        const response = await api.get(`/api/Bookings/getBooking/${bookingId}`);
        return response.data;
    },

    // Edit booking
    editBooking: async (data: Booking): Promise<ApiResponse<Booking>> => {
        const response = await api.put('/api/Bookings/EditBookedRequest', data);
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (data: CancelBookingData): Promise<ApiResponse<string>> => {
        const response = await api.post('/api/Bookings/CancelBooking', data);
        return response.data;
    },

    // Get helper booking service names
    getHelperBookingServiceNames: async (helperId: number): Promise<ApiResponse<BookingServiceName[]>> => {
        const response = await api.get(`/api/Bookings/GetHelperBookingServiceNames/${helperId}`);
        return response.data;
    }
};

// Support APIs
export const supportApi = {
    // Get user addresses
    getUserAddresses: async (userId: number): Promise<ApiResponse<Address[]>> => {
        const response = await api.get(`/api/Address/User/${userId}`, {
            headers: {
                'accept': 'application/json;odata.metadata=minimal;odata.streaming=true'
            }
        });
        return response.data;
    },

    // Get active services
    getActiveServices: async (): Promise<ApiResponse<Service[]>> => {
        const response = await api.get('/api/Service/active', {
            headers: {
                'accept': 'application/json;odata.metadata=minimal;odata.streaming=true'
            }
        });
        return response.data;
    },

    // Get helper services
    getHelperServices: async (helperId: number): Promise<ApiResponse<Service[]>> => {
        const response = await api.get(`/api/Helper/GetHelperServices/${helperId}`);
        return response.data;
    },

    // Get helper reviews
    getHelperReviews: async (helperId: number): Promise<ApiResponse<Review[]>> => {
        const response = await api.get(`/api/Review/helper/${helperId}`, {
            headers: {
                'accept': 'application/json;odata.metadata=minimal;odata.streaming=true'
            }
        });
        return response.data;
    }
};