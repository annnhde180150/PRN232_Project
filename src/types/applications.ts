// Helper Applications Types
export interface HelperApplication {
  helperId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  registrationDate: string;
  approvalStatus: 'Pending' | 'approved' | 'rejected' | 'revision_requested';
  documentCount: number;
  skillCount: number;
  workAreaCount: number;
  primaryService: string;
}

export interface HelperApplicationDetail {
  helperId: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  profilePictureUrl: string | null;
  bio: string;
  dateOfBirth: string;
  gender: string;
  registrationDate: string;
  approvalStatus: 'Pending' | 'approved' | 'rejected' | 'revision_requested';
  approvedByAdminId: number | null;
  approvalDate: string | null;
  isActive: boolean;
  documents: HelperDocument[];
  skills: HelperSkill[];
  workAreas: HelperWorkArea[];
  totalDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
}

export interface HelperDocument {
  documentId: number;
  documentType: string;
  documentUrl: string;
  uploadDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verifiedByAdminId: number | null;
  verificationDate: string | null;
  notes: string | null;
}

export interface HelperSkill {
  helperSkillId: number;
  serviceId: number;
  yearsOfExperience: number;
  isPrimarySkill: boolean;
}

export interface HelperWorkArea {
  workAreaId: number;
  city: string;
  district: string;
  ward: string | null;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

export interface ApplicationsListResponse {
  applications: HelperApplication[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApplicationDecisionRequest {
  status: 'approved' | 'rejected' | 'revision_requested';
  comment: string;
}

export interface ApplicationDecisionResponse {
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
}

export type ApplicationStatus = 'Pending' | 'approved' | 'rejected' | 'revision_requested';

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  Pending: 'Đang chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Đã từ chối',
  revision_requested: 'Yêu cầu chỉnh sửa'
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  revision_requested: 'bg-blue-100 text-blue-800'
};

export interface BookingRequest {
  bookingId: number;
  requestId: number;
  userId: number;
  serviceId: number;
  addressId: number;
  status: string;
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

export interface UpdateBookingStatusRequest {
  requestId: number;
  bookingId: number;
  action: 'Accept' | 'Cancel';
}

export interface UpdateBookingStatusResponse {
  success: boolean;
  message: string;
} 