'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { reportAPI } from '../../lib/api';
import {
  HelperEarnings,
  HelperScheduleAnalytics,
  ReportPeriod
} from '../../types/reports';
import StatCard from '../../components/charts/StatCard';
import SimpleChart from '../../components/charts/SimpleChart';
import PeriodSelector from '../../components/charts/PeriodSelector';

export default function HelperReportsPage() {
  const { userType, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [activeTab, setActiveTab] = useState<'earnings' | 'schedule'>('earnings');
  
  // Data states
  const [helperEarnings, setHelperEarnings] = useState<HelperEarnings | null>(null);
  const [scheduleAnalytics, setScheduleAnalytics] = useState<HelperScheduleAnalytics | null>(null);
  
  // Loading states
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || userType !== 'helper')) {
      router.push('/login');
    }
  }, [isAuthenticated, userType, loading, router]);

  useEffect(() => {
    if (isAuthenticated && userType === 'helper') {
      loadAllData();
    }
  }, [isAuthenticated, userType, selectedPeriod]);

  const loadAllData = async () => {
    setLoadingData(true);
    setError('');
    
    try {
      const [earnings, schedule] = await Promise.all([
        reportAPI.getHelperEarnings(selectedPeriod),
        reportAPI.getHelperScheduleAnalytics(selectedPeriod)
      ]);

      setHelperEarnings(earnings.data);
      setScheduleAnalytics(schedule.data);
    } catch (err: any) {
      setError('Không thể tải dữ liệu báo cáo. Vui lòng thử lại.');
      console.error('Error loading helper reports:', err);
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

  if (!isAuthenticated || userType !== 'helper') {
    return null;
  }

  const renderEarningsTab = () => (
    <div className="space-y-6">
      {helperEarnings && (
        <>
          {/* Main Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng Thu Nhập"
              value={`${helperEarnings.totalEarnings.toLocaleString()}đ`}
              icon={<span className="text-xl">💰</span>}
              color="green"
            />
            <StatCard
              title="Tổng Đặt Lịch"
              value={helperEarnings.totalBookings}
              icon={<span className="text-xl">📅</span>}
              color="blue"
            />
            <StatCard
              title="Đã Hoàn Thành"
              value={helperEarnings.completedBookings}
              icon={<span className="text-xl">✅</span>}
              color="green"
            />
            <StatCard
              title="Tỷ Lệ Hoàn Thành"
              value={`${helperEarnings.completionRate.toFixed(1)}%`}
              icon={<span className="text-xl">📊</span>}
              color="purple"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Thu Nhập TB/Đặt Lịch"
              value={`${helperEarnings.averageBookingValue.toLocaleString()}đ`}
              color="orange"
            />
            <StatCard
              title="Đánh Giá Trung Bình"
              value={`${helperEarnings.averageRating}/5`}
              subtitle={`${helperEarnings.totalReviews} đánh giá`}
              color="purple"
            />
            <StatCard
              title="Tổng Giờ Làm Việc"
              value={`${helperEarnings.totalHoursWorked.toFixed(1)}h`}
              color="blue"
            />
          </div>

          {/* Earnings Trend Chart */}
          {helperEarnings.earningsTrend.length > 0 && (
            <SimpleChart
              title="Xu Hướng Thu Nhập"
              type="line"
              data={helperEarnings.earningsTrend.map(trend => ({
                label: trend.monthName,
                value: trend.earnings
              }))}
              height={300}
            />
          )}

          {/* Bookings Trend Chart */}
          {helperEarnings.earningsTrend.length > 0 && (
            <SimpleChart
              title="Xu Hướng Số Lượng Đặt Lịch"
              type="bar"
              data={helperEarnings.earningsTrend.map(trend => ({
                label: trend.monthName,
                value: trend.bookingsCount
              }))}
              height={300}
            />
          )}

          {/* Service Breakdown */}
          {helperEarnings.serviceBreakdown.length > 0 && (
            <>
              <SimpleChart
                title="Phân Bổ Thu Nhập Theo Dịch Vụ"
                type="pie"
                data={helperEarnings.serviceBreakdown.map((service, index) => ({
                  label: service.serviceName,
                  value: service.totalEarnings,
                  color: `hsl(${index * 60}, 70%, 50%)`
                }))}
                height={300}
              />

              {/* Service Performance Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Theo Dịch Vụ</h3>
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
                          Thu Nhập
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đánh Giá TB
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tỷ Lệ Hoàn Thành
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {helperEarnings.serviceBreakdown.map((service, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.serviceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.bookingsCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.totalEarnings.toLocaleString()}đ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.averageRating}/5 ⭐
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.completionRate.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      {scheduleAnalytics && (
        <>
          {/* Schedule Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tổng Giờ Làm Việc"
              value={`${scheduleAnalytics.totalHoursWorked.toFixed(1)}h`}
              icon={<span className="text-xl">⏰</span>}
              color="blue"
            />
            <StatCard
              title="Giá Trị TB/Đặt Lịch"
              value={`${scheduleAnalytics.averageBookingValue.toLocaleString()}đ`}
              icon={<span className="text-xl">💰</span>}
              color="green"
            />
            <StatCard
              title="Thời Gian Hoạt Động"
              value={`${new Date(scheduleAnalytics.period.start).toLocaleDateString('vi-VN')} - ${new Date(scheduleAnalytics.period.end).toLocaleDateString('vi-VN')}`}
              icon={<span className="text-xl">📅</span>}
              color="purple"
            />
          </div>

          {/* Earnings Trend */}
          {scheduleAnalytics.earningsTrend.length > 0 && (
            <SimpleChart
              title="Biến Động Thu Nhập Theo Thời Gian"
              type="line"
              data={scheduleAnalytics.earningsTrend.map(trend => ({
                label: trend.monthName,
                value: trend.earnings
              }))}
              height={300}
            />
          )}

          {/* Performance Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Chi Tiết</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Giờ Làm Việc Trung Bình/Tháng</p>
                  <p className="text-xs text-blue-700">Dựa trên dữ liệu hiện tại</p>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {scheduleAnalytics.totalHoursWorked > 0 
                    ? (scheduleAnalytics.totalHoursWorked / Math.max(scheduleAnalytics.earningsTrend.length, 1)).toFixed(1)
                    : '0'
                  }h
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Thu Nhập/Giờ</p>
                  <p className="text-xs text-green-700">Hiệu suất thu nhập</p>
                </div>
                <div className="text-xl font-bold text-green-600">
                  {scheduleAnalytics.totalHoursWorked > 0 
                    ? Math.round(scheduleAnalytics.earningsTrend.reduce((sum, trend) => sum + trend.earnings, 0) / scheduleAnalytics.totalHoursWorked).toLocaleString()
                    : '0'
                  }đ/h
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Tổng Đặt Lịch Trong Kỳ</p>
                  <p className="text-xs text-purple-700">Số lượng công việc đã nhận</p>
                </div>
                <div className="text-xl font-bold text-purple-600">
                  {scheduleAnalytics.earningsTrend.reduce((sum, trend) => sum + trend.bookingsCount, 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Work Pattern Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân Tích Mô Hình Làm Việc</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Pattern */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Xu Hướng Theo Tháng</h4>
                {scheduleAnalytics.earningsTrend.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{trend.monthName}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{trend.bookingsCount} đặt lịch</div>
                      <div className="text-xs text-gray-500">{trend.earnings.toLocaleString()}đ</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips and Recommendations */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Gợi Ý Cải Thiện</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Tối ưu thời gian:</strong> Hãy tập trung vào những khung giờ có nhu cầu cao để tăng thu nhập.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📈 <strong>Nâng cao kỹ năng:</strong> Học thêm các dịch vụ mới để mở rộng cơ hội việc làm.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ⭐ <strong>Chất lượng dịch vụ:</strong> Duy trì đánh giá cao để thu hút nhiều khách hàng hơn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Báo Cáo Của Tôi</h1>
              <p className="text-gray-600">Theo dõi thu nhập và hiệu suất làm việc</p>
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
              { key: 'earnings', label: 'Thu Nhập', icon: '💰' },
              { key: 'schedule', label: 'Lịch Trình', icon: '📅' },
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
            {activeTab === 'earnings' && renderEarningsTab()}
            {activeTab === 'schedule' && renderScheduleTab()}
          </>
        )}
      </main>
    </div>
  );
} 