import { Profile, ProfileAction } from '../../types/profile';

interface ProfileCardProps {
  profile: Profile;
  onAction: (profile: Profile, action: ProfileAction) => void;
  isSelected: boolean;
  onSelect: (profileId: number) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onAction,
  isSelected,
  onSelect
}) => {
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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Bị cấm
      </span>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${
      isSelected ? 'ring-2 ring-indigo-500' : ''
    }`}>
      {/* Header with checkbox and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(profile.profileId)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getProfileTypeLabel(profile.profileType)}
              </span>
              {getStatusBadge(profile.isActive)}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{profile.fullName}</h3>
          <p className="text-sm text-gray-500">ID: {profile.profileId}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <span className="text-sm text-gray-600">{profile.email}</span>
          </div>

          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm text-gray-600">{profile.phoneNumber}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Ngày đăng ký:</span>
              <span className="ml-2 text-gray-600">{formatDate(profile.registrationDate)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Đăng nhập cuối:</span>
              <span className="ml-2 text-gray-600">{formatDate(profile.lastLoginDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-2">
        {profile.isActive ? (
          <button
            onClick={() => onAction(profile, 'ban')}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Cấm hồ sơ
          </button>
        ) : (
          <button
            onClick={() => onAction(profile, 'unban')}
            className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Bỏ cấm hồ sơ
          </button>
        )}
        
        <button
          onClick={() => {
            const url = `/profile-management/detail/${profile.profileId}/${profile.profileType.toLowerCase()}`;
            window.location.href = url;
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default ProfileCard; 