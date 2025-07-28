import axios from 'axios';
import { 
  LoginRequest, 
  RegisterUserRequest, 
  RegisterHelperRequest, 
  AuthResponse, 
  User, 
  Helper, 
  Admin,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateAdminProfileRequest,
  UpdateHelperProfileRequest,
  UpdateUserProfileRequest,
  ChangePasswordRequest,
  UserAddress,
  CreateAddressRequest,
  UpdateAddressRequest
} from '../types/auth';
import {
  BusinessOverview,
  RevenueAnalytics,
  ServicePerformance,
  HelperRanking,
  BookingAnalytics,
  HelperEarnings,
  HelperScheduleAnalytics,
  CustomerBookings,
  CustomerSpending,
  FavoriteHelper,
  ReportApiResponse,
  ReportPeriod,
  FavoriteHelperResponse,
  AddFavoriteRequest,
  RemoveFavoriteRequest
} from '../types/reports';
import {
  HelperApplication,
  HelperApplicationDetail,
  ApplicationsListResponse,
  ApplicationDecisionRequest,
  ApplicationDecisionResponse,
  ApiResponse,
  ApplicationStatus,
  BookingRequest,
  UpdateBookingStatusRequest,
  UpdateBookingStatusResponse
} from '../types/applications';
import {
  Profile,
  BanUnbanRequest,
  BulkBanUnbanRequest,
  ProfileStatusResponse,
  ProfileListResponse,
  BanStatusResponse,
  BanUnbanResponse,
  BulkBanUnbanResponse,
  ProfileType
} from '../types/profile';


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api };

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

// Authentication API functions
export const authAPI = {
  // Login functions
  loginUser: async (credentials: LoginRequest): Promise<AuthResponse<User>> => {
    const response = await api.post('/api/Authentication/login/user', credentials);
    return response.data;
  },

  loginHelper: async (credentials: LoginRequest): Promise<AuthResponse<Helper>> => {
    const response = await api.post('/api/Authentication/login/helper', credentials);
    return response.data;
  },

  loginAdmin: async (credentials: LoginRequest): Promise<AuthResponse<Admin>> => {
    const response = await api.post('/api/Authentication/login/admin', credentials);
    return response.data;
  },

  // Registration functions
  registerUser: async (userData: RegisterUserRequest): Promise<AuthResponse<User>> => {
    const response = await api.post('/api/Authentication/register/user', userData);
    return response.data;
  },

  registerHelper: async (helperData: RegisterHelperRequest): Promise<AuthResponse<Helper>> => {
    const response = await api.post('/api/Authentication/register/helper', helperData);
    return response.data;
  },

  // Forgot Password functions
  forgotPassword: async (userType: 'user' | 'helper' | 'admin', data: ForgotPasswordRequest): Promise<any> => {
    const endpoint = userType === 'user' 
      ? '/api/User/forgot-password'
      : userType === 'helper' 
        ? '/api/Helper/forgot-password'
        : '/api/Admin/forgot-password';
    const response = await api.post(endpoint, data);
    return response.data;
  },



  resetPassword: async (userType: 'user' | 'helper' | 'admin', data: ResetPasswordRequest): Promise<any> => {
    const endpoint = userType === 'user' 
      ? '/api/User/reset-password'
      : userType === 'helper' 
        ? '/api/Helper/reset-password'
        : '/api/Admin/reset-password';
    
    const response = await api.post(endpoint, data);
    return response.data;
  },

  // Logout function
  logout: async (): Promise<AuthResponse<null>> => {
    const response = await api.post('/api/Authentication/logout');
    return response.data;
  },
};

// Auth utility functions
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  setUserData: (user: User | Helper | Admin, userType: 'user' | 'helper' | 'admin') => {
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('user_type', userType);
  },

  getUserData: (): { user: User | Helper | Admin | null; userType: 'user' | 'helper' | 'admin' | null } => {
    const userData = localStorage.getItem('user_data');
    const userType = localStorage.getItem('user_type') as 'user' | 'helper' | 'admin' | null;
    return {
      user: userData ? JSON.parse(userData) : null,
      userType: userType,
    };
  },

  clearUserData: () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_type');
  },

  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    const userData = authUtils.getUserData();
    return !!(token && userData.user);
  },
};

// Export notification API
export { notificationAPI } from './notification-api';

// Report API functions
export const reportAPI = {
  // Admin Reports
  getBusinessOverview: async (): Promise<ReportApiResponse<BusinessOverview>> => {
    const response = await api.get('/api/Report/admin/business-overview');
    return response.data;
  },

  getRevenueAnalytics: async (period: ReportPeriod = 'month'): Promise<ReportApiResponse<RevenueAnalytics>> => {
    const response = await api.get(`/api/Report/admin/revenue-analytics?period=${period}`);
    return response.data;
  },

  getServicePerformance: async (period: ReportPeriod = 'month'): Promise<ReportApiResponse<ServicePerformance[]>> => {
    const response = await api.get(`/api/Report/admin/service-performance?period=${period}`);
    return response.data;
  },

  getHelperRankings: async (count: number = 10, period: ReportPeriod = 'month'): Promise<ReportApiResponse<HelperRanking[]>> => {
    const response = await api.get(`/api/Report/admin/helper-rankings?count=${count}&period=${period}`);
    return response.data;
  },

  getBookingAnalytics: async (serviceId?: number, period: ReportPeriod = 'month'): Promise<ReportApiResponse<BookingAnalytics>> => {
    const params = new URLSearchParams({ period });
    if (serviceId) {
      params.append('serviceId', serviceId.toString());
    }
    const response = await api.get(`/api/Report/admin/booking-analytics?${params.toString()}`);
    return response.data;
  },

  // Helper Reports
  getHelperEarnings: async (period: ReportPeriod = 'month'): Promise<ReportApiResponse<HelperEarnings>> => {
    const response = await api.get(`/api/Report/helper/my-earnings?period=${period}`);
    return response.data;
  },

  getHelperScheduleAnalytics: async (period: ReportPeriod = 'month'): Promise<ReportApiResponse<HelperScheduleAnalytics>> => {
    const response = await api.get(`/api/Report/helper/my-schedule-analytics?period=${period}`);
    return response.data;
  },

  // Customer Reports
  getCustomerBookings: async (period: ReportPeriod = 'month'): Promise<ReportApiResponse<CustomerBookings>> => {
    const response = await api.get(`/api/Report/customer/my-bookings?period=${period}`);
    return response.data;
  },

  getCustomerSpending: async (period: ReportPeriod = 'month'): Promise<ReportApiResponse<CustomerSpending>> => {
    const response = await api.get(`/api/Report/customer/my-spending?period=${period}`);
    return response.data;
  },

  getFavoriteHelpers: async (): Promise<ReportApiResponse<FavoriteHelper[]>> => {
    const response = await api.get('/api/Report/customer/favorite-helpers');
    return response.data;
  },
};

// Applications API functions
export const applicationsAPI = {
  // Get list of helper applications with filtering and pagination
  getApplications: async (
    status?: ApplicationStatus,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<ApplicationsListResponse>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }
    
    const response = await api.get(`/api/admin/helpers/applications?${params.toString()}`);
    return response.data;
  },

  // Get detailed information about a specific helper application
  getApplicationDetail: async (helperId: number): Promise<ApiResponse<HelperApplicationDetail>> => {
    const response = await api.get(`/api/admin/helpers/applications/${helperId}`);
    return response.data;
  },

  // Make decision on helper application (approve, reject, request revision)
  makeDecision: async (
    helperId: number,
    decision: ApplicationDecisionRequest
  ): Promise<ApiResponse<ApplicationDecisionResponse>> => {
    const response = await api.post(`/api/admin/helpers/applications/${helperId}/decision`, decision);
    return response.data;
  },
};

export const getHelperBookings = async (helperId: number): Promise<BookingRequest[]> => {
  const response = await api.get(`/api/Bookings/GetBookingByHelperId/${helperId}`);
  return response.data.data;
};

export const updateBookingStatus = async (
  data: UpdateBookingStatusRequest
): Promise<UpdateBookingStatusResponse> => {
  const response = await api.put('/api/ServiceRequests/UpdateRequestStatus', data);
  return response.data.data;
};

// Profile Management API functions
export const profileAPI = {
  // Ban a profile
  banProfile: async (request: BanUnbanRequest): Promise<BanUnbanResponse> => {
    const response = await api.post('/api/ProfileManagement/ban', request);
    return response.data;
  },

  // Unban a profile
  unbanProfile: async (request: BanUnbanRequest): Promise<BanUnbanResponse> => {
    const response = await api.post('/api/ProfileManagement/unban', request);
    return response.data;
  },

  // Get profile status by ID and type
  getProfileStatus: async (profileId: number, profileType: string): Promise<ProfileStatusResponse> => {
    const response = await api.get(`/api/ProfileManagement/status/${profileId}/${profileType}`);
    return response.data;
  },

  // Get all banned profiles
  getBannedProfiles: async (): Promise<ProfileListResponse> => {
    const response = await api.get('/api/ProfileManagement/banned');
    return response.data;
  },

  // Get all active profiles
  getActiveProfiles: async (): Promise<ProfileListResponse> => {
    const response = await api.get('/api/ProfileManagement/active');
    return response.data;
  },

  // Check if a profile is banned
  checkBanStatus: async (profileId: number, profileType: string): Promise<BanStatusResponse> => {
    const response = await api.get(`/api/ProfileManagement/banned-status/${profileId}/${profileType}`);
    return response.data;
  },

  // Bulk ban profiles
  bulkBanProfiles: async (requests: BulkBanUnbanRequest[]): Promise<BulkBanUnbanResponse> => {
    const response = await api.post('/api/ProfileManagement/bulk-ban', requests);
    return response.data;
  },

  // Bulk unban profiles
  bulkUnbanProfiles: async (requests: BulkBanUnbanRequest[]): Promise<BulkBanUnbanResponse> => {
    const response = await api.post('/api/ProfileManagement/bulk-unban', requests);
    return response.data;
  },

  // Get profile functions
  getAdminProfile: async (adminId: number): Promise<Admin> => {
    const response = await api.get(`/api/Admin/profile/${adminId}`);
    return response.data.data;
  },

  getHelperProfile: async (helperId: number): Promise<Helper> => {
    const response = await api.get(`/api/Helper/profile/${helperId}`);
    return response.data.data;
  },

  getUserProfile: async (userId: number): Promise<User> => {
    const response = await api.get(`/api/User/profile/${userId}`);
    return response.data.data;
  },

  // Update profile functions
  updateAdminProfile: async (adminId: number, data: UpdateAdminProfileRequest): Promise<any> => {
    const response = await api.put(`/api/Admin/profile/${adminId}`, data);
    return response.data;
  },

  updateHelperProfile: async (helperId: number, data: UpdateHelperProfileRequest): Promise<any> => {
    const response = await api.put(`/api/Helper/profile/${helperId}`, data);
    return response.data;
  },

  updateUserProfile: async (userId: number, data: UpdateUserProfileRequest): Promise<any> => {
    const response = await api.put(`/api/User/profile/${userId}`, data);
    return response.data;
  },

  // Change password functions
  changeAdminPassword: async (adminId: number, data: ChangePasswordRequest): Promise<any> => {
    const response = await api.put(`/api/Admin/change-password/${adminId}`, data);
    return response.data;
  },

  changeHelperPassword: async (helperId: number, data: ChangePasswordRequest): Promise<any> => {
    const response = await api.put(`/api/Helper/change-password/${helperId}`, data);
    return response.data;
  },

  changeUserPassword: async (userId: number, data: ChangePasswordRequest): Promise<any> => {
    const response = await api.put(`/api/User/change-password/${userId}`, data);
    return response.data;
  },
};
export async function searchHelpers(serviceId: number) {
  const res = await fetch(`${BASE_URL}/api/Helper/search?serviceId=${serviceId}`);
  if (!res.ok) throw new Error('Failed to fetch helpers');
  return res.json();
}

export interface Service {
  serviceId: number;
  serviceName: string;
  description: string;
  iconUrl: string | null;
  basePrice: number;
  priceUnit: string;
  isActive: boolean;
  parentServiceId: number | null;
}

export async function getAllServices(): Promise<Service[]> {
  const res = await fetch(`${BASE_URL}/api/Service/active`);
  if (!res.ok) throw new Error('Failed to fetch services');
  const data = await res.json();
  return data.data as Service[];
}

// Address API functions
export const addressAPI = {
  // Get all addresses for a user
  getUserAddresses: async (userId: number): Promise<UserAddress[]> => {
    const response = await api.get(`/api/Address/User/${userId}`);
    return response.data.data;
  },

  // Get a specific address by ID
  getAddress: async (addressId: number): Promise<UserAddress> => {
    const response = await api.get(`/api/Address/UserAddress/${addressId}`);
    return response.data.data;
  },

  // Create a new address
  createAddress: async (data: CreateAddressRequest): Promise<UserAddress> => {
    const response = await api.post('/api/Address/UserAddress', data);
    return response.data.data;
  },

  // Update an existing address
  updateAddress: async (addressId: number, data: UpdateAddressRequest): Promise<UserAddress> => {
    const response = await api.put(`/api/Address/UserAddress/${addressId}`, data);
    return response.data.data;
  },

  // Delete an address
  deleteAddress: async (addressId: number): Promise<void> => {
    await api.delete(`/api/Address/UserAddress/${addressId}`);
  },
};

// Favorite Helper API functions
export const favoriteHelperAPI = {
  // Get user's favorite helpers
  getUserFavorites: async (userId: number): Promise<FavoriteHelperResponse> => {
    const response = await api.get(`/api/FavoriteHelper/user/${userId}`);
    return response.data;
  },

  // Add helper to favorites
  addToFavorites: async (request: AddFavoriteRequest): Promise<FavoriteHelperResponse> => {
    const response = await api.post('/api/FavoriteHelper', request);
    return response.data;
  },

  // Remove helper from favorites
  removeFromFavorites: async (request: RemoveFavoriteRequest): Promise<FavoriteHelperResponse> => {
    const response = await api.delete('/api/FavoriteHelper', {
      data: request
    });
    return response.data;
  },
};


