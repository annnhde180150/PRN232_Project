'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../lib/api';
import { NotificationBell, NotificationDemo } from '../../components/notifications';
import { PageContainer, Section } from '../../components/layout';
import { CustomerDashboard } from '../../components/customer';
import { AvailabilityToggle } from "@/components/helper/AvailabilityToggle";

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
      <PageContainer className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </PageContainer>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getDashboardContent = () => {
    switch (userType) {
      case 'user':
        return <CustomerDashboard />;
      case 'helper':
        const helper = user as any;
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng Thái Tài Khoản</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${helper.approvalStatus === 'approved'
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
                {helper.approvalStatus === 'approved' && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Trạng thái hoạt động:</p>
                    <AvailabilityToggle initialStatus={helper.isAvailable} />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card - NEW */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao Tác Nhanh</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/pending-bookings')}
                  className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Order Chờ Duyệt</span>
                </button>
              </div>
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
              <div className="mt-4">
                <button
                  onClick={() => router.push('/helper-reports')}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Xem Báo Cáo Chi Tiết
                </button>
              </div>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quản Lý Hệ Thống</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => router.push('/profile-management')}
                  className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Quản Lý Hồ Sơ
                </button>
                <button
                  onClick={() => router.push('/helper-applications')}
                  className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Duyệt Người Giúp Việc
                </button>
                <button
                  onClick={() => router.push('/admin-reports')}
                  className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Báo Cáo Thống Kê
                </button>
                <button className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors">
                  Cài Đặt Hệ Thống
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

  // For customers, use the new CustomerDashboard component
  if (userType === 'user') {
    return <CustomerDashboard />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <Section background="white" padding="md" className="border-b border-gray-200">
        <PageContainer>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Chào mừng, {user.fullName || (user as any).username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {getRoleDisplayName()}
              </span>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Main Content */}
      <Section padding="lg">
        <PageContainer>
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông Tin Tài Khoản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Họ và tên</p>
                <p className="font-medium text-black">{user.fullName || (user as any).username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-black">{user.email}</p>
              </div>
              {userType !== 'admin' && (
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium text-black">{(user as any).phoneNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Ngày tham gia</p>
                <p className="font-medium text-black">
                  {new Date(
                    (user as any).registrationDate || (user as any).creationDate
                  ).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Role-specific content */}
          {getDashboardContent()}

          {/* Notification Demo - Only for helper */}
          {userType === 'helper' && (
            <div className="mt-6">
              <NotificationDemo />
            </div>
          )}
        </PageContainer>
      </Section>
    </div>
  );
}