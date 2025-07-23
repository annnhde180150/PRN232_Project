import { useState } from 'react';
import { Profile, ProfileAction, BanUnbanRequest } from '../../types/profile';
import { profileAPI } from '../../lib/api';

interface BanUnbanModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ProfileAction;
  profile?: Profile | null;
  profiles?: Profile[];
  isBulkAction: boolean;
  adminId: number;
  onSuccess: () => void;
}

const BanUnbanModal: React.FC<BanUnbanModalProps> = ({
  isOpen,
  onClose,
  action,
  profile,
  profiles = [],
  isBulkAction,
  adminId,
  onSuccess
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const getActionText = () => {
    return action === 'ban' ? 'cấm' : 'bỏ cấm';
  };

  const getActionColor = () => {
    return action === 'ban' ? 'red' : 'green';
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isBulkAction) {
        // Bulk action
        const requests = profiles.map(p => ({
          adminId,
          profileId: p.profileId,
          profileType: p.profileType.toLowerCase() as 'user' | 'helper',
          reason: reason.trim()
        }));

        if (action === 'ban') {
          await profileAPI.bulkBanProfiles(requests);
        } else {
          await profileAPI.bulkUnbanProfiles(requests);
        }
      } else {
        // Single action
        if (!profile) return;

        const request: BanUnbanRequest = {
          adminId,
          profileId: profile.profileId,
          profileType: profile.profileType.toLowerCase() as 'user' | 'helper',
          reason: reason.trim()
        };

        if (action === 'ban') {
          await profileAPI.banProfile(request);
        } else {
          await profileAPI.unbanProfile(request);
        }
      }

      onSuccess();
      setReason('');
    } catch (err: any) {
      setError(err.response?.data?.message || `Không thể ${getActionText()} hồ sơ. Vui lòng thử lại.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      setError('');
      onClose();
    }
  };

  const getProfileNames = () => {
    if (isBulkAction) {
      return profiles.map(p => p.fullName).join(', ');
    }
    return profile?.fullName || '';
  };

  const profileCount = isBulkAction ? profiles.length : 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {action === 'ban' ? 'Cấm hồ sơ' : 'Bỏ cấm hồ sơ'}
            </h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Confirmation Message */}
          <div className="mb-6">
            <p className="text-gray-700">
              Bạn có chắc chắn muốn {getActionText()} {profileCount > 1 ? `${profileCount} hồ sơ` : 'hồ sơ'} sau:
            </p>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {getProfileNames()}
              </p>
              {isBulkAction && (
                <p className="text-sm text-gray-600 mt-1">
                  và {profileCount - 1} hồ sơ khác
                </p>
              )}
            </div>
          </div>

          {/* Reason Input */}
          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Lý do {getActionText()} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Nhập lý do ${getActionText()} hồ sơ...`}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:opacity-50"
              rows={4}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Warning */}
          <div className={`p-4 rounded-lg mb-6 ${
            action === 'ban' 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex">
              <div className={`flex-shrink-0 ${
                action === 'ban' ? 'text-red-400' : 'text-green-400'
              }`}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm ${
                  action === 'ban' ? 'text-red-800' : 'text-green-800'
                }`}>
                  {action === 'ban' 
                    ? 'Hành động này sẽ ngăn không cho người dùng đăng nhập vào hệ thống.'
                    : 'Hành động này sẽ cho phép người dùng đăng nhập trở lại hệ thống.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              action === 'ban'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              `${action === 'ban' ? 'Cấm' : 'Bỏ cấm'} hồ sơ`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanUnbanModal; 