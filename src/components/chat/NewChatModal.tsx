import React, { useState, useEffect } from 'react';
import { ChatUser, SearchUsersRequest } from '../../types/chat';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect: (user: ChatUser) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onUserSelect
}) => {
  const { searchUsers, searchResults, searchLoading, clearSearchResults } = useChat();
  const { userType } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'users' | 'helpers'>('users');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Available' | 'Busy' | 'Offline' | ''>('');
  const [minRating, setMinRating] = useState<number>(0);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      clearSearchResults();
      // Default search type based on current user type
      if (userType === 'user') {
        setSearchType('helpers');
      } else if (userType === 'helper') {
        setSearchType('users');
      }
    }
  }, [isOpen, userType, clearSearchResults]);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim() && !availabilityFilter && minRating === 0) {
      return;
    }

    const searchRequest: SearchUsersRequest = {
      searchType,
      searchTerm: searchTerm.trim() || undefined,
      availabilityStatus: availabilityFilter || undefined,
      minimumRating: minRating > 0 ? minRating : undefined,
      pageSize: 20,
      pageNumber: 1,
      isActive: true
    };

    await searchUsers(searchRequest);
  };

  // Handle user selection
  const handleUserSelect = (user: ChatUser) => {
    onUserSelect(user);
    onClose();
  };

  // Handle close
  const handleClose = () => {
    clearSearchResults();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Bắt đầu cuộc trò chuyện mới
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search form */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-4">
            {/* Search type and term */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên, email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại tài khoản
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'users' | 'helpers')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="users">Khách hàng</option>
                  <option value="helpers">Người giúp việc</option>
                </select>
              </div>
            </div>

            {/* Additional filters for helpers */}
            {searchType === 'helpers' && (
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái hoạt động
                  </label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tất cả</option>
                    <option value="Available">Sẵn sàng</option>
                    <option value="Busy">Bận</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá tối thiểu
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Search button */}
            <div>
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {searchLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang tìm kiếm...
                  </div>
                ) : (
                  'Tìm kiếm'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="flex-1 overflow-y-auto p-6">
          {searchResults.length === 0 && !searchLoading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium mb-2">Chưa có kết quả tìm kiếm</p>
              <p className="text-sm">Nhập từ khóa và nhấn "Tìm kiếm" để bắt đầu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div
                  key={`${user.userId || user.helperId}-${user.email}`}
                  onClick={() => handleUserSelect(user)}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {user.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </h3>
                        {user.hasExistingConversation && (
                          <span className="text-xs text-green-600 font-medium">
                            Đã có cuộc trò chuyện
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {user.phoneNumber}
                        </span>
                        
                        {/* Helper specific info */}
                        {user.helperId && (
                          <>
                            {user.averageRating !== undefined && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-yellow-600">
                                  ⭐ {user.averageRating.toFixed(1)}
                                </span>
                              </>
                            )}
                            
                            {user.availableStatus !== undefined && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className={`text-xs ${
                                  user.availableStatus === 0 ? 'text-green-600' :
                                  user.availableStatus === 1 ? 'text-yellow-600' :
                                  'text-gray-600'
                                }`}>
                                  {user.availableStatus === 0 ? '🟢 Sẵn sàng' :
                                   user.availableStatus === 1 ? '🟡 Bận' :
                                   '⚫ Offline'}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>

                      {/* Skills */}
                      {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{user.skills.length - 3} khác
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 