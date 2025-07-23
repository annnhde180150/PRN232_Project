'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../lib/api';

export default function DashboardPage() {
  const { user, userType, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getDashboardContent = () => {
    switch (userType) {
      case 'user':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dịch Vụ Của Tôi</h2>
              <p className="text-gray-600">Chưa có dịch vụ nào được đặt.</p>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Đặt Dịch Vụ Mới
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch Sử Dịch Vụ</h2>
              <p className="text-gray-600">Chưa có lịch sử sử dụng dịch vụ.</p>
            </div>
          </div>
        );
      case 'helper':
        const helper = user as any;
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng Thái Tài Khoản</h2>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  helper.approvalStatus === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : helper.approvalStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {helper.approvalStatus === 'approved' ? 'Đã duyệt' : 
                   helper.approvalStatus === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                </span>
              </div>
              {helper.approvalStatus === 'pending' && (
                <p className="text-gray-600 mt-2">
                  Tài khoản của bạn đang chờ được duyệt bởi quản trị viên.
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thống Kê</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{helper.totalHoursWorked}</p>
                  <p className="text-gray-600">Giờ làm việc</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{helper.averageRating}</p>
                  <p className="text-gray-600">Đánh giá trung bình</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quản Lý Hệ Thống</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Quản Lý Người Dùng
                </button>
                <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                  Duyệt Người Giúp Việc
                </button>
                <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Báo Cáo Thống Kê
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getRoleDisplayName = () => {
    switch (userType) {
      case 'user':
        return 'Khách Hàng';
      case 'helper':
        return 'Người Giúp Việc';
      case 'admin':
        return 'Quản Trị Viên';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Chào mừng, {user.fullName || (user as any).username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{getRoleDisplayName()}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông Tin Tài Khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Họ và tên</p>
              <p className="font-medium">{user.fullName || (user as any).username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {userType !== 'admin' && (
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{(user as any).phoneNumber}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Ngày tham gia</p>
              <p className="font-medium">
                {new Date(
                  (user as any).registrationDate || (user as any).creationDate
                ).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        {/* Role-specific content */}
        {getDashboardContent()}
      </main>
    </div>
  );
} 