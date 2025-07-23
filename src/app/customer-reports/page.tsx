'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { reportAPI } from '../../lib/api';
import {
  CustomerBookings,
  CustomerSpending,
  FavoriteHelper,
  ReportPeriod
} from '../../types/reports';
import StatCard from '../../components/charts/StatCard';
import SimpleChart from '../../components/charts/SimpleChart';
import PeriodSelector from '../../components/charts/PeriodSelector';

export default function CustomerReportsPage() {
  const { userType, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [activeTab, setActiveTab] = useState<'bookings' | 'spending' | 'favorites'>('bookings');
  
  // Data states
  const [customerBookings, setCustomerBookings] = useState<CustomerBookings | null>(null);
  const [customerSpending, setCustomerSpending] = useState<CustomerSpending | null>(null);
  const [favoriteHelpers, setFavoriteHelpers] = useState<FavoriteHelper[]>([]);
  
  // Loading states
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || userType !== 'user')) {
      router.push('/login');
    }
  }, [isAuthenticated, userType, loading, router]);

  useEffect(() => {
    if (isAuthenticated && userType === 'user') {
      loadAllData();
    }
  }, [isAuthenticated, userType, selectedPeriod]);

  const loadAllData = async () => {
    setLoadingData(true);
    setError('');
    
    try {
      const [bookings, spending, favorites] = await Promise.all([
        reportAPI.getCustomerBookings(selectedPeriod),
        reportAPI.getCustomerSpending(selectedPeriod),
        reportAPI.getFavoriteHelpers()
      ]);

      setCustomerBookings(bookings.data);
      setCustomerSpending(spending.data);
      setFavoriteHelpers(favorites.data);
    } catch (err: any) {
      setError('Không thể tải dữ liệu báo cáo. Vui lòng thử lại.');
      console.error('Error loading customer reports:', err);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'user') {
    return null;
  }

  const renderBookingsTab = () => (
    <div className="space-y-6">
      {customerBookings && (
        <>
          {/* Main Booking Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng Đặt Lịch"
              value={customerBookings.totalBookings}
              icon={<span className="text-xl">📅</span>}
              color="blue"
            />
            <StatCard
              title="Đã Hoàn Thành"
              value={customerBookings.completedBookings}
              icon={<span className="text-xl">✅</span>}
              color="green"
            />
            <StatCard
              title="Đang Thực Hiện"
              value={customerBookings.inProgressBookings}
              icon={<span className="text-xl">⏳</span>}
              color="orange"
            />
            <StatCard
              title="Chờ Duyệt"
              value={customerBookings.pendingBookings}
              icon={<span className="text-xl">⌛</span>}
              color="purple"
            />
          </div>

          {/* Performance and Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tổng Chi Tiêu"
              value={`${customerBookings.totalBookingValue.toLocaleString()}đ`}
              color="green"
            />
            <StatCard
              title="Chi Tiêu TB/Đặt Lịch"
              value={`${customerBookings.averageBookingValue.toLocaleString()}đ`}
              color="blue"
            />
            <StatCard
              title="Tỷ Lệ Hoàn Thành"
              value={`${customerBookings.completionRate.toFixed(1)}%`}
              color="purple"
            />
          </div>

          {/* Booking Status Breakdown */}
          {customerBookings.totalBookings > 0 && (
            <SimpleChart
              title="Phân Bổ Trạng Thái Đặt Lịch"
              type="pie"
              data={[
                { label: 'Hoàn thành', value: customerBookings.completedBookings, color: '#10b981' },
                { label: 'Đang thực hiện', value: customerBookings.inProgressBookings, color: '#f59e0b' },
                { label: 'Chờ duyệt', value: customerBookings.pendingBookings, color: '#8b5cf6' },
                { label: 'Đã hủy', value: customerBookings.cancelledBookings, color: '#ef4444' },
              ].filter(item => item.value > 0)}
              height={300}
            />
          )}

          {/* Booking Trend */}
          {customerBookings.bookingTrend.length > 0 && (
            <SimpleChart
              title="Xu Hướng Đặt Lịch Theo Thời Gian"
              type="line"
              data={customerBookings.bookingTrend.map(trend => ({
                label: new Date(trend.date).toLocaleDateString('vi-VN'),
                value: trend.bookingsCount
              }))}
              height={300}
            />
          )}

          {/* Booking Summary Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tổng Quan Đặt Lịch</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{customerBookings.totalBookings}</div>
                  <div className="text-sm text-blue-700">Tổng đặt lịch</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{customerBookings.completedBookings}</div>
                  <div className="text-sm text-green-700">Hoàn thành</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{customerBookings.pendingBookings}</div>
                  <div className="text-sm text-orange-700">Chờ duyệt</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{customerBookings.cancelledBookings}</div>
                  <div className="text-sm text-red-700">Đã hủy</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderSpendingTab = () => (
    <div className="space-y-6">
      {customerSpending && (
        <>
          {/* Spending Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Tổng Chi Tiêu"
              value={`${customerSpending.totalSpent.toLocaleString()}đ`}
              icon={<span className="text-xl">💰</span>}
              color="green"
            />
            <StatCard
              title="Chi Tiêu TB/Đặt Lịch"
              value={`${customerSpending.averageSpendingPerBooking.toLocaleString()}đ`}
              icon={<span className="text-xl">📊</span>}
              color="blue"
            />
          </div>

          {/* Spending Trend */}
          {customerSpending.spendingTrend.length > 0 && (
            <SimpleChart
              title="Xu Hướng Chi Tiêu Theo Tháng"
              type="line"
              data={customerSpending.spendingTrend.map(trend => ({
                label: trend.monthName,
                value: trend.revenue
              }))}
              height={300}
            />
          )}

          {/* Monthly Breakdown */}
          {customerSpending.spendingTrend.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Chi Tiêu Theo Tháng</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tháng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng Chi Tiêu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phí Nền Tảng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thanh Toán Helper
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số Giao Dịch
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerSpending.spendingTrend.map((trend, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trend.monthName} {trend.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.revenue.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.platformFees.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.helperEarnings.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.transactionCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Financial Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Tài Chính</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Khoảng Thời Gian</p>
                  <p className="text-xs text-green-700">Từ {new Date(customerSpending.period.start).toLocaleDateString('vi-VN')} đến {new Date(customerSpending.period.end).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="text-xl font-bold text-green-600">
                  {Math.ceil((new Date(customerSpending.period.end).getTime() - new Date(customerSpending.period.start).getTime()) / (1000 * 60 * 60 * 24))} ngày
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Chi Tiêu Trung Bình/Tháng</p>
                  <p className="text-xs text-blue-700">Dựa trên dữ liệu hiện tại</p>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {customerSpending.spendingTrend.length > 0 
                    ? Math.round(customerSpending.totalSpent / customerSpending.spendingTrend.length).toLocaleString()
                    : '0'
                  }đ
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderFavoritesTab = () => (
    <div className="space-y-6">
      {favoriteHelpers.length > 0 ? (
        <>
          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Người Giúp Việc Yêu Thích</h3>
            <p className="text-blue-700">
              Bạn đã làm việc với {favoriteHelpers.length} người giúp việc. Dưới đây là danh sách những người bạn thường xuyên sử dụng dịch vụ.
            </p>
          </div>

          {/* Top Helpers Chart */}
          <SimpleChart
            title="Số Lần Sử Dụng Dịch Vụ"
            type="bar"
            data={favoriteHelpers.slice(0, 10).map((helper, index) => ({
              label: helper.helperName,
              value: helper.totalBookings,
              color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][index % 5]}-500`
            }))}
            height={400}
          />

          {/* Helpers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteHelpers.slice(0, 6).map((helper) => (
              <div key={helper.helperId} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {helper.helperName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{helper.helperName}</h4>
                    <p className="text-sm text-gray-500">{helper.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tổng đặt lịch</span>
                    <span className="font-medium text-gray-900">{helper.totalBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đã hoàn thành</span>
                    <span className="font-medium text-green-600">{helper.completedBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
                    <span className="font-medium text-blue-600">{helper.completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đánh giá</span>
                    <span className="font-medium text-orange-600">
                      {helper.averageRating}/5 ⭐ ({helper.totalReviews})
                    </span>
                  </div>
                </div>

                {/* Service Breakdown */}
                {helper.serviceBreakdown.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Dịch vụ đã sử dụng</h5>
                    <div className="space-y-1">
                      {helper.serviceBreakdown.slice(0, 3).map((service, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-gray-600">{service.serviceName}</span>
                          <span className="text-gray-900">{service.bookingsCount} lần</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Tất Cả Người Giúp Việc</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng Đặt Lịch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hoàn Thành
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ Lệ HT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đánh Giá
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {favoriteHelpers.map((helper) => (
                    <tr key={helper.helperId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {helper.helperName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {helper.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {helper.totalBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {helper.completedBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {helper.completionRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                        {helper.averageRating}/5 ⭐
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có người giúp việc yêu thích</h3>
          <p className="text-gray-600">Hãy đặt lịch và sử dụng dịch vụ để xây dựng danh sách yêu thích của bạn.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Của Tôi</h1>
              <p className="text-gray-600">Theo dõi lịch sử sử dụng dịch vụ và chi tiêu</p>
            </div>
            <div className="flex items-center space-x-4">
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Về Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'bookings', label: 'Đặt Lịch', icon: '📅' },
              { key: 'spending', label: 'Chi Tiêu', icon: '💰' },
              { key: 'favorites', label: 'Yêu Thích', icon: '❤️' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'bookings' && renderBookingsTab()}
            {activeTab === 'spending' && renderSpendingTab()}
            {activeTab === 'favorites' && renderFavoritesTab()}
          </>
        )}
      </main>
    </div>
  );
} 