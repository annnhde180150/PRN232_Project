'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI } from '../../lib/api';
import { Profile, ProfileAction } from '../../types/profile';
import ProfileCard from '../../components/profile/ProfileCard';
import BanUnbanModal from '../../components/profile/BanUnbanModal';
import ProfileStatusChecker from '../../components/profile/ProfileStatusChecker';

export default function ProfileManagementPage() {
  const { userType, isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  
  // States
  const [activeTab, setActiveTab] = useState<'active' | 'banned' | 'checker'>('active');
  const [activeProfiles, setActiveProfiles] = useState<Profile[]>([]);
  const [bannedProfiles, setBannedProfiles] = useState<Profile[]>([]);
  const [filteredActiveProfiles, setFilteredActiveProfiles] = useState<Profile[]>([]);
  const [filteredBannedProfiles, setFilteredBannedProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileTypeFilter, setProfileTypeFilter] = useState<'all' | 'User' | 'Helper'>('all');
  const [selectedProfiles, setSelectedProfiles] = useState<Set<number>>(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ProfileAction>('ban');
  const [modalProfile, setModalProfile] = useState<Profile | null>(null);
  const [modalProfiles, setModalProfiles] = useState<Profile[]>([]);
  const [isBulkAction, setIsBulkAction] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || userType !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, userType, loading, router]);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      loadProfiles();
    }
  }, [isAuthenticated, userType]);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, profileTypeFilter, activeProfiles, bannedProfiles]);

  const loadProfiles = async () => {
    setLoadingData(true);
    setError('');

    try {
      const [activeResponse, bannedResponse] = await Promise.all([
        profileAPI.getActiveProfiles(),
        profileAPI.getBannedProfiles()
      ]);

      if (activeResponse.success) {
        setActiveProfiles(activeResponse.data);
      }

      if (bannedResponse.success) {
        setBannedProfiles(bannedResponse.data);
      }
    } catch (err: any) {
      setError('Không thể tải danh sách hồ sơ. Vui lòng thử lại.');
      console.error('Error loading profiles:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const filterProfiles = () => {
    const filterBySearchAndType = (profiles: Profile[]) => {
      return profiles.filter(profile => {
        const matchesSearch = searchTerm === '' || 
          profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.phoneNumber.includes(searchTerm);
        
        const matchesType = profileTypeFilter === 'all' || profile.profileType === profileTypeFilter;
        
        return matchesSearch && matchesType;
      });
    };

    setFilteredActiveProfiles(filterBySearchAndType(activeProfiles));
    setFilteredBannedProfiles(filterBySearchAndType(bannedProfiles));
  };

  const handleProfileAction = (profile: Profile, action: ProfileAction) => {
    setModalProfile(profile);
    setModalAction(action);
    setIsBulkAction(false);
    setModalOpen(true);
  };

  const handleBulkAction = (action: ProfileAction) => {
    const profiles = activeTab === 'active' ? filteredActiveProfiles : filteredBannedProfiles;
    const selectedProfilesList = profiles.filter(p => selectedProfiles.has(p.profileId));
    
    if (selectedProfilesList.length === 0) {
      alert('Vui lòng chọn ít nhất một hồ sơ');
      return;
    }

    setModalProfiles(selectedProfilesList);
    setModalAction(action);
    setIsBulkAction(true);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setSelectedProfiles(new Set());
    loadProfiles();
  };

  const handleSelectProfile = (profileId: number) => {
    const newSelected = new Set(selectedProfiles);
    if (newSelected.has(profileId)) {
      newSelected.delete(profileId);
    } else {
      newSelected.add(profileId);
    }
    setSelectedProfiles(newSelected);
  };

  const handleSelectAll = () => {
    const profiles = activeTab === 'active' ? filteredActiveProfiles : filteredBannedProfiles;
    if (selectedProfiles.size === profiles.length) {
      setSelectedProfiles(new Set());
    } else {
      setSelectedProfiles(new Set(profiles.map(p => p.profileId)));
    }
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

  const currentProfiles = activeTab === 'active' ? filteredActiveProfiles : filteredBannedProfiles;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Hồ Sơ</h1>
          <p className="mt-2 text-gray-600">Quản lý trạng thái hồ sơ người dùng và người giúp việc</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            {[
              { key: 'active', label: 'Hồ Sơ Hoạt Động', count: activeProfiles.length },
              { key: 'banned', label: 'Hồ Sơ Bị Cấm', count: bannedProfiles.length },
              { key: 'checker', label: 'Kiểm Tra Trạng Thái', count: null }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'active' | 'banned' | 'checker')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Status Checker Tab */}
        {activeTab === 'checker' && (
          <ProfileStatusChecker />
        )}

        {/* Profile Lists Tabs */}
        {(activeTab === 'active' || activeTab === 'banned') && (
          <>
            {/* Search and Filter Controls */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={profileTypeFilter}
                    onChange={(e) => setProfileTypeFilter(e.target.value as 'all' | 'User' | 'Helper')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="User">Khách hàng</option>
                    <option value="Helper">Người giúp việc</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {currentProfiles.length > 0 && (
              <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {selectedProfiles.size === currentProfiles.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                    {selectedProfiles.size > 0 && (
                      <span className="text-gray-600">
                        Đã chọn {selectedProfiles.size} hồ sơ
                      </span>
                    )}
                  </div>
                  {selectedProfiles.size > 0 && (
                    <div className="flex space-x-2">
                      {activeTab === 'active' && (
                        <button
                          onClick={() => handleBulkAction('ban')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cấm nhiều hồ sơ
                        </button>
                      )}
                      {activeTab === 'banned' && (
                        <button
                          onClick={() => handleBulkAction('unban')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Bỏ cấm nhiều hồ sơ
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profiles Grid */}
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : currentProfiles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">
                  {searchTerm || profileTypeFilter !== 'all' 
                    ? 'Không tìm thấy hồ sơ nào phù hợp với bộ lọc'
                    : `Không có hồ sơ ${activeTab === 'active' ? 'hoạt động' : 'bị cấm'} nào`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProfiles.map((profile) => (
                  <ProfileCard
                    key={`${profile.profileType}-${profile.profileId}`}
                    profile={profile}
                    onAction={handleProfileAction}
                    isSelected={selectedProfiles.has(profile.profileId)}
                    onSelect={handleSelectProfile}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Ban/Unban Modal */}
        {modalOpen && (
          <BanUnbanModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            action={modalAction}
            profile={modalProfile}
            profiles={modalProfiles}
            isBulkAction={isBulkAction}
            adminId={user?.id || 1}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </div>
  );
} 