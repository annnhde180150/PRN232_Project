'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { reportAPI } from '../../lib/api';
import {
  BusinessOverview,
  RevenueAnalytics,
  ServicePerformance,
  HelperRanking,
  BookingAnalytics,
  ReportPeriod
} from '../../types/reports';
import StatCard from '../../components/charts/StatCard';
import SimpleChart from '../../components/charts/SimpleChart';
import PeriodSelector from '../../components/charts/PeriodSelector';

export default function AdminReportsPage() {
  const { userType, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'services' | 'helpers' | 'bookings'>('overview');
  
  // Data states
  const [businessOverview, setBusinessOverview] = useState<BusinessOverview | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [servicePerformance, setServicePerformance] = useState<ServicePerformance[]>([]);
  const [helperRankings, setHelperRankings] = useState<HelperRanking[]>([]);
  const [bookingAnalytics, setBookingAnalytics] = useState<BookingAnalytics | null>(null);
  
  // Loading states
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || userType !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, userType, loading, router]);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      loadAllData();
    }
  }, [isAuthenticated, userType, selectedPeriod]);

  const loadAllData = async () => {
    setLoadingData(true);
    setError('');
    
    try {
      const [overview, revenue, services, helpers, bookings] = await Promise.all([
        reportAPI.getBusinessOverview(),
        reportAPI.getRevenueAnalytics(selectedPeriod),
        reportAPI.getServicePerformance(selectedPeriod),
        reportAPI.getHelperRankings(10, selectedPeriod),
        reportAPI.getBookingAnalytics(undefined, selectedPeriod)
      ]);

      setBusinessOverview(overview.data);
      setRevenueAnalytics(revenue.data);
      setServicePerformance(services.data);
      setHelperRankings(helpers.data);
      setBookingAnalytics(bookings.data);
    } catch (err: any) {
      setError('Không thể tải dữ liệu báo cáo. Vui lòng thử lại.');
      console.error('Error loading reports:', err);
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

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      {businessOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng Người Dùng"
            value={businessOverview.totalUsers}
            icon={<span className="text-xl">👥</span>}
            color="blue"
            trend={{
              value: businessOverview.growthMetrics.userGrowthRate,
              isPositive: businessOverview.growthMetrics.userGrowthRate > 0
            }}
          />
          <StatCard
            title="Tổng Người Giúp Việc"
            value={businessOverview.totalHelpers}
            icon={<span className="text-xl">🏠</span>}
            color="green"
            trend={{
              value: businessOverview.growthMetrics.helperGrowthRate,
              isPositive: businessOverview.growthMetrics.helperGrowthRate > 0
            }}
          />
          <StatCard
            title="Tổng Đặt Lịch"
            value={businessOverview.totalBookings}
            icon={<span className="text-xl">📅</span>}
            color="purple"
            trend={{
              value: businessOverview.growthMetrics.bookingGrowthRate,
              isPositive: businessOverview.growthMetrics.bookingGrowthRate > 0
            }}
          />
          <StatCard
            title="Tổng Doanh Thu"
            value={`${businessOverview.totalRevenue.toLocaleString()}đ`}
            icon={<span className="text-xl">💰</span>}
            color="orange"
            trend={{
              value: businessOverview.growthMetrics.revenueGrowthRate,
              isPositive: businessOverview.growthMetrics.revenueGrowthRate > 0
            }}
          />
        </div>
      )}

      {/* Booking Status */}
      {businessOverview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Đặt Lịch Hoạt Động"
            value={businessOverview.activeBookings}
            subtitle="Đang thực hiện"
            color="green"
          />
          <StatCard
            title="Đặt Lịch Hoàn Thành"
            value={businessOverview.completedBookings}
            subtitle="Đã hoàn thành"
            color="blue"
          />
          <StatCard
            title="Đặt Lịch Bị Hủy"
            value={businessOverview.cancelledBookings}
            subtitle="Đã hủy"
            color="red"
          />
        </div>
      )}

      {/* Service Quality */}
      {businessOverview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Đánh Giá Trung Bình"
            value={`${businessOverview.averageRating}/5`}
            subtitle="⭐ Sao"
            color="orange"
          />
          <StatCard
            title="Tổng Dịch Vụ"
            value={businessOverview.totalServices}
            subtitle="Dịch vụ khả dụng"
            color="purple"
          />
          <StatCard
            title="Tổng Đánh Giá"
            value={businessOverview.totalReviews}
            subtitle="Lượt đánh giá"
            color="gray"
          />
        </div>
      )}
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-6">
      {revenueAnalytics && (
        <>
          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng Doanh Thu"
              value={`${revenueAnalytics.totalRevenue.toLocaleString()}đ`}
              color="green"
            />
            <StatCard
              title="Doanh Thu Ròng"
              value={`${revenueAnalytics.netRevenue.toLocaleString()}đ`}
              color="blue"
            />
            <StatCard
              title="Phí Nền Tảng"
              value={`${revenueAnalytics.platformFees.toLocaleString()}đ`}
              color="purple"
            />
            <StatCard
              title="Thu Nhập Helper"
              value={`${revenueAnalytics.helperEarnings.toLocaleString()}đ`}
              color="orange"
            />
          </div>

          {/* Transaction Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tổng Giao Dịch"
              value={revenueAnalytics.totalTransactions}
              color="blue"
            />
            <StatCard
              title="Giá Trị TB/Giao Dịch"
              value={`${revenueAnalytics.averageTransactionValue.toLocaleString()}đ`}
              color="green"
            />
            <StatCard
              title="Tỷ Lệ Thành Công"
              value={`${revenueAnalytics.paymentSuccessRate}%`}
              color="purple"
            />
          </div>

          {/* Monthly Trend Chart */}
          {revenueAnalytics.monthlyTrend.length > 0 && (
            <SimpleChart
              title="Xu Hướng Doanh Thu Theo Tháng"
              type="line"
              data={revenueAnalytics.monthlyTrend.map(trend => ({
                label: trend.monthName,
                value: trend.revenue
              }))}
              height={300}
            />
          )}
        </>
      )}
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      {servicePerformance.length > 0 && (
        <>
          <SimpleChart
            title="Hiệu Suất Dịch Vụ - Số Lượng Đặt Lịch"
            type="bar"
            data={servicePerformance.slice(0, 10).map((service, index) => ({
              label: service.serviceName,
              value: service.bookingsCount,
              color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][index % 5]}-500`
            }))}
            height={400}
          />

          <SimpleChart
            title="Doanh Thu Theo Dịch Vụ"
            type="pie"
            data={servicePerformance.slice(0, 5).map((service, index) => ({
              label: service.serviceName,
              value: service.totalRevenue,
              color: `hsl(${index * 72}, 70%, 50%)`
            }))}
            height={300}
          />

          {/* Service Performance Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Hiệu Suất Dịch Vụ</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch Vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số Đặt Lịch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doanh Thu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đánh Giá TB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thị Phần
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {servicePerformance.slice(0, 10).map((service, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.bookingsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.totalRevenue.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.averageRating}/5 ⭐
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.marketShare.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderHelpersTab = () => (
    <div className="space-y-6">
      {helperRankings.length > 0 && (
        <>
          <SimpleChart
            title="Top 10 Người Giúp Việc - Tổng Thu Nhập"
            type="bar"
            data={helperRankings.slice(0, 10).map((helper, index) => ({
              label: helper.helperName,
              value: helper.totalEarnings,
              color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][index % 5]}-500`
            }))}
            height={400}
          />

          {/* Helper Rankings Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Bảng Xếp Hạng Người Giúp Việc</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hạng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng Đặt Lịch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hoàn Thành
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tỷ Lệ Hoàn Thành
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đánh Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thu Nhập
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {helperRankings.slice(0, 10).map((helper, index) => (
                    <tr key={helper.helperId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{helper.helperName}</div>
                          <div className="text-sm text-gray-500">{helper.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {helper.totalBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {helper.completedBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {helper.completionRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {helper.averageRating}/5 ⭐
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {helper.totalEarnings.toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-6">
      {bookingAnalytics && (
        <>
          {/* Booking Status Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="Tổng Đặt Lịch"
              value={bookingAnalytics.totalBookings}
              color="blue"
            />
            <StatCard
              title="Chờ Duyệt"
              value={bookingAnalytics.pendingBookings}
              color="orange"
            />
            <StatCard
              title="Đang Thực Hiện"
              value={bookingAnalytics.inProgressBookings}
              color="purple"
            />
            <StatCard
              title="Hoàn Thành"
              value={bookingAnalytics.completedBookings}
              color="green"
            />
            <StatCard
              title="Đã Hủy"
              value={bookingAnalytics.cancelledBookings}
              color="red"
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Giá Trị TB/Đặt Lịch"
              value={`${bookingAnalytics.averageBookingValue.toLocaleString()}đ`}
              color="green"
            />
            <StatCard
              title="Tỷ Lệ Hoàn Thành"
              value={`${bookingAnalytics.completionRate.toFixed(1)}%`}
              color="blue"
            />
            <StatCard
              title="Tỷ Lệ Hủy"
              value={`${bookingAnalytics.cancellationRate.toFixed(1)}%`}
              color="red"
            />
          </div>

          {/* Peak Hours Chart */}
          {bookingAnalytics.peakHours.length > 0 && (
            <SimpleChart
              title="Giờ Cao Điểm Đặt Lịch"
              type="bar"
              data={bookingAnalytics.peakHours.map(hour => ({
                label: hour.timeRange,
                value: hour.bookingsCount
              }))}
              height={300}
            />
          )}

          {/* Popular Services */}
          {bookingAnalytics.popularServices.length > 0 && (
            <SimpleChart
              title="Dịch Vụ Phổ Biến"
              type="pie"
              data={bookingAnalytics.popularServices.map((service, index) => ({
                label: service.serviceName,
                value: service.bookingsCount,
                color: `hsl(${index * 60}, 70%, 50%)`
              }))}
              height={300}
            />
          )}
        </>
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
              <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Quản Trị</h1>
              <p className="text-gray-600">Tổng quan và phân tích dữ liệu hệ thống</p>
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
              { key: 'overview', label: 'Tổng Quan', icon: '📊' },
              { key: 'revenue', label: 'Doanh Thu', icon: '💰' },
              { key: 'services', label: 'Dịch Vụ', icon: '🛠️' },
              { key: 'helpers', label: 'Người Giúp Việc', icon: '👥' },
              { key: 'bookings', label: 'Đặt Lịch', icon: '📅' },
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
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'revenue' && renderRevenueTab()}
            {activeTab === 'services' && renderServicesTab()}
            {activeTab === 'helpers' && renderHelpersTab()}
            {activeTab === 'bookings' && renderBookingsTab()}
          </>
        )}
      </main>
    </div>
  );
} 