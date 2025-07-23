'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import { profileAPI } from '../../../../../lib/api';
import { Profile, ProfileAction } from '../../../../../types/profile';
import BanUnbanModal from '../../../../../components/profile/BanUnbanModal';

export default function ProfileDetailPage() {
  const { userType, isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const profileId = parseInt(params.profileId as string);
  const profileType = params.profileType as string;
  
  // States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [banStatus, setBanStatus] = useState<boolean | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ProfileAction>('ban');

  useEffect(() => {
    if (!loading && (!isAuthenticated || userType !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, userType, loading, router]);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin' && profileId && profileType) {
      loadProfileDetail();
    }
  }, [isAuthenticated, userType, profileId, profileType]);

  const loadProfileDetail = async () => {
    setLoadingData(true);
    setError('');

    try {
      const formattedType = profileType.charAt(0).toUpperCase() + profileType.slice(1);
      
      // Get profile status and ban status in parallel
      const [statusResponse, banStatusResponse] = await Promise.all([
        profileAPI.getProfileStatus(profileId, formattedType),
        profileAPI.checkBanStatus(profileId, formattedType)
      ]);

      if (statusResponse.success) {
        setProfile(statusResponse.data);
      }

      if (banStatusResponse.success) {
        setBanStatus(banStatusResponse.data);
      }

    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Không tìm thấy hồ sơ với ID và loại đã chọn');
      } else {
        setError(err.response?.data?.message || 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleProfileAction = (action: ProfileAction) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    loadProfileDetail();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProfileTypeLabel = (type: string) => {
    return type === 'User' ? 'Khách hàng' : 'Người giúp việc';
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        Bị cấm
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Chi Tiết Hồ Sơ</h1>
              <p className="mt-2 text-gray-600">
                Thông tin chi tiết của hồ sơ ID: {profileId}
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loadingData && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Profile Information */}
        {profile && !loadingData && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {profile.fullName}
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getProfileTypeLabel(profile.profileType)}
                  </span>
                  {getStatusBadge(profile.isActive)}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-3 mb-6">
                {profile.isActive ? (
                  <button
                    onClick={() => handleProfileAction('ban')}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cấm hồ sơ
                  </button>
                ) : (
                  <button
                    onClick={() => handleProfileAction('unban')}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Bỏ cấm hồ sơ
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/profile-management')}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Quản lý hồ sơ
                </button>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Thông tin cơ bản
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">ID:</label>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900">{profile.profileId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">Họ và tên:</label>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900 font-medium">{profile.fullName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">Loại tài khoản:</label>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900">{getProfileTypeLabel(profile.profileType)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">Email:</label>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900">{profile.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Trạng thái và hoạt động
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                    </div>
                    <div className="col-span-2">
                      {getStatusBadge(profile.isActive)}
                    </div>
                  </div>

                  {banStatus !== null && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-600">Bị cấm:</label>
                      </div>
                      <div className="col-span-2">
                        <span className={`font-medium ${banStatus ? 'text-red-600' : 'text-green-600'}`}>
                          {banStatus ? 'Có' : 'Không'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">Ngày đăng ký:</label>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900">{formatDate(profile.registrationDate)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">Đăng nhập cuối:</label>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900">{formatDate(profile.lastLoginDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity History (Placeholder for future enhancement) */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Lịch sử hoạt động
              </h3>
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2">Lịch sử hoạt động sẽ được hiển thị ở đây trong tương lai</p>
              </div>
            </div>
          </div>
        )}

        {/* Ban/Unban Modal */}
        {modalOpen && profile && (
          <BanUnbanModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            action={modalAction}
            profile={profile}
            profiles={[]}
            isBulkAction={false}
            adminId={user?.id || 1}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </div>
  );
} 