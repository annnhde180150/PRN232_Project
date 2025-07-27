// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterHelperRequest {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  skills: {
    serviceId: number;
    yearsOfExperience: number;
    isPrimarySkill: boolean;
  }[];
  workAreas: {
    city: string;
    district: string;
    ward: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  }[];
  documents: {
    documentType: 'CV' | 'ID';
    documentUrl: string;
    uploadDate: string;
    verificationStatus: string;
    verifiedByAdminId: number;
    verificationDate: string;
    notes: string;
  }[];
}

export interface User {
  id: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  profilePictureUrl: string | null;
  registrationDate: string;
  lastLoginDate: string | null;
  externalAuthProvider: string | null;
  externalAuthId: string | null;
  isActive: boolean;
  defaultAddressId: number | null;
  role: string;
}

export interface Helper {
  id: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  profilePictureUrl: string | null;
  bio: string;
  dateOfBirth: string;
  gender: string;
  registrationDate: string;
  approvalStatus: string;
  approvedByAdminId: number | null;
  approvalDate: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  totalHoursWorked: number;
  averageRating: number;
  lastLoginDate: string | null;
  role: string;
  skills: any[];
  workAreas: any[];
  documents: any[];
}

export interface Admin {
  id: number;
  username: string;
  fullName: string;
  email: string;
  creationDate: string;
  lastLoginDate: string;
  isActive: boolean;
  role: string;
}

export interface AuthResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    message: string;
    token?: string;
    user?: T;
    helper?: T;
    admin?: T;
  };
  timestamp: string;
  requestId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}



export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | Helper | Admin | null;
  userType: 'user' | 'helper' | 'admin' | null;
}

// Profile Update Types
export interface UpdateAdminProfileRequest {
  username: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface UpdateHelperProfileRequest {
  phoneNumber: string;
  email: string;
  fullName: string;
  profilePictureUrl: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
  isEmailVerified: boolean;
  skills: {
    serviceId: number;
    yearsOfExperience: number;
    isPrimarySkill: boolean;
  }[];
  workAreas: {
    city: string;
    district: string;
    ward: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  }[];
  documents: {
    documentType: string;
    documentUrl: string;
    uploadDate: string;
    notes: string;
    verificationStatus: string;
    verifiedByAdminId: number;
    verificationDate: string;
  }[];
}

export interface UpdateUserProfileRequest {
  phoneNumber: string;
  email: string;
  fullName: string;
  profilePictureUrl: string;
  isActive: boolean;
  defaultAddressId: number;
  defaultAddress: {
    userId: number;
    addressLine1: string;
    addressLine2: string;
    ward: string;
    district: string;
    city: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserAddress {
  addressId: number;
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  bookings?: any[];
  serviceRequests?: any[];
  user?: any;
}

export interface CreateAddressRequest {
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
}

export interface UpdateAddressRequest {
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
} 