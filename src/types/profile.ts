// Profile Management Types

export interface Profile {
  profileId: number;
  profileType: 'User' | 'Helper';
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  registrationDate: string;
  lastLoginDate: string | null;
}

export interface BanUnbanRequest {
  adminId: number;
  profileId: number;
  profileType: 'user' | 'helper';
  reason: string;
}

export interface BulkBanUnbanRequest {
  adminId: number;
  profileId: number;
  profileType: 'user' | 'helper';
  reason: string;
}

export interface ProfileStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Profile;
  timestamp: string;
  requestId: string;
}

export interface ProfileListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Profile[];
  timestamp: string;
  requestId: string;
}

export interface BanStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: boolean;
  timestamp: string;
  requestId: string;
}

export interface BanUnbanResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Profile;
  timestamp: string;
  requestId: string;
}

export interface BulkBanUnbanResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Profile[];
  timestamp: string;
  requestId: string;
}

export type ProfileType = 'Helper' | 'User';
export type ProfileAction = 'ban' | 'unban'; 