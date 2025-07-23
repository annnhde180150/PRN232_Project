import { useState } from 'react';
import { profileAPI } from '../../lib/api';
import { Profile } from '../../types/profile';

const ProfileStatusChecker: React.FC = () => {
  const [profileId, setProfileId] = useState<string>('');
  const [profileType, setProfileType] = useState<'User' | 'Helper'>('User');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [banStatus, setBanStatus] = useState<boolean | null>(null);

  const handleCheck = async () => {
    if (!profileId.trim()) {
      setError('Vui lòng nhập ID hồ sơ');
      return;
    }

    const numericId = parseInt(profileId.trim());
    if (isNaN(numericId) || numericId <= 0) {
      setError('ID hồ sơ phải là số nguyên dương');
      return;
    }

    setLoading(true);
    setError('');
    setProfile(null);
    setBanStatus(null);

    try {
      // Get profile status and ban status in parallel
      const [statusResponse, banStatusResponse] = await Promise.all([
        profileAPI.getProfileStatus(numericId, profileType),
        profileAPI.checkBanStatus(numericId, profileType)
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
        setError(err.response?.data?.message || 'Không thể kiểm tra trạng thái hồ sơ. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfileId('');
    setProfileType('User');
    setProfile(null);
    setBanStatus(null);
    setError('');
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kiểm Tra Trạng Thái Hồ Sơ</h2>
        <p className="text-gray-600 mb-6">
          Nhập ID và loại hồ sơ để kiểm tra thông tin chi tiết và trạng thái
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="profileId" className="block text-sm font-medium text-gray-700 mb-2">
              ID Hồ sơ
            </label>
            <input
              type="number"
              id="profileId"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              placeholder="Nhập ID hồ sơ..."
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="profileType" className="block text-sm font-medium text-gray-700 mb-2">
              Loại hồ sơ
            </label>
            <select
              id="profileType"
              value={profileType}
              onChange={(e) => setProfileType(e.target.value as 'User' | 'Helper')}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:opacity-50"
            >
              <option value="User">Khách hàng</option>
              <option value="Helper">Người giúp việc</option>
            </select>
          </div>

          <div className="flex space-x-2 sm:items-end">
            <button
              onClick={handleCheck}
              disabled={loading || !profileId.trim()}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Kiểm tra...</span>
                </div>
              ) : (
                'Kiểm tra'
              )}
            </button>

            {(profile || error) && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
      </div>

      {/* Profile Information */}
      {profile && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Thông Tin Hồ Sơ</h3>
            {getStatusBadge(profile.isActive)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Thông tin cơ bản
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">ID:</label>
                  <p className="text-gray-900">{profile.profileId}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Họ và tên:</label>
                  <p className="text-gray-900">{profile.fullName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Loại tài khoản:</label>
                  <p className="text-gray-900">{getProfileTypeLabel(profile.profileType)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Email:</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Số điện thoại:</label>
                  <p className="text-gray-900">{profile.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Status and Dates */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Trạng thái và thời gian
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng thái hoạt động:</label>
                  <div className="mt-1">
                    {getStatusBadge(profile.isActive)}
                  </div>
                </div>

                {banStatus !== null && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Trạng thái cấm:</label>
                    <p className={`font-medium ${banStatus ? 'text-red-600' : 'text-green-600'}`}>
                      {banStatus ? 'Đang bị cấm' : 'Không bị cấm'}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Ngày đăng ký:</label>
                  <p className="text-gray-900">{formatDate(profile.registrationDate)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Đăng nhập cuối:</label>
                  <p className="text-gray-900">{formatDate(profile.lastLoginDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
                             <button
                 onClick={() => window.location.href = `/profile-management/detail/${profile.profileId}/${profile.profileType.toLowerCase()}`}
                 className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
               >
                 Xem chi tiết
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStatusChecker; 