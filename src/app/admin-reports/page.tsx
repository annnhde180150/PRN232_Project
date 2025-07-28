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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { BarChart3, DollarSign, Users, Calendar, Star, TrendingUp, Activity, FileText } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  const formatTrendValue = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      {businessOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Người Dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessOverview.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span className={businessOverview.growthMetrics.userGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatTrendValue(businessOverview.growthMetrics.userGrowthRate)}
                </span>
                <span className="ml-1">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Người Giúp Việc</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessOverview.totalHelpers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span className={businessOverview.growthMetrics.helperGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatTrendValue(businessOverview.growthMetrics.helperGrowthRate)}
                </span>
                <span className="ml-1">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Đặt Lịch</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessOverview.totalBookings.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span className={businessOverview.growthMetrics.bookingGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatTrendValue(businessOverview.growthMetrics.bookingGrowthRate)}
                </span>
                <span className="ml-1">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessOverview.totalRevenue.toLocaleString()}đ</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span className={businessOverview.growthMetrics.revenueGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatTrendValue(businessOverview.growthMetrics.revenueGrowthRate)}
                </span>
                <span className="ml-1">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Booking Status */}
      {businessOverview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng Thái Đặt Lịch</CardTitle>
              <CardDescription>Phân bổ theo trạng thái hiện tại</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Đang hoạt động</span>
                </div>
                <Badge variant="secondary">{businessOverview.activeBookings}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Đã hoàn thành</span>
                </div>
                <Badge variant="secondary">{businessOverview.completedBookings}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Đã hủy</span>
                </div>
                <Badge variant="destructive">{businessOverview.cancelledBookings}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chất Lượng Dịch Vụ</CardTitle>
              <CardDescription>Đánh giá và phản hồi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Đánh giá trung bình</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{businessOverview.averageRating}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tổng dịch vụ</span>
                <Badge>{businessOverview.totalServices}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tổng đánh giá</span>
                <Badge variant="outline">{businessOverview.totalReviews}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống Kê Nhanh</CardTitle>
              <CardDescription>Các chỉ số quan trọng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {((businessOverview.completedBookings / businessOverview.totalBookings) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {((businessOverview.activeBookings / businessOverview.totalBookings) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Đang hoạt động</div>
              </div>
            </CardContent>
          </Card>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {revenueAnalytics.totalRevenue.toLocaleString()}đ
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh Thu Ròng</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {revenueAnalytics.netRevenue.toLocaleString()}đ
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phí Nền Tảng</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {revenueAnalytics.platformFees.toLocaleString()}đ
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thu Nhập Helper</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {revenueAnalytics.helperEarnings.toLocaleString()}đ
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống Kê Giao Dịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tổng giao dịch</span>
                  <Badge>{revenueAnalytics.totalTransactions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Giá trị TB/Giao dịch</span>
                  <span className="font-medium">{revenueAnalytics.averageTransactionValue.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tỷ lệ thành công</span>
                  <Badge variant="secondary">{revenueAnalytics.paymentSuccessRate}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          {revenueAnalytics.monthlyTrend.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Xu Hướng Doanh Thu Theo Tháng</CardTitle>
                <CardDescription>Biến động doanh thu qua các tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleChart
                  title=""
                  type="line"
                  data={revenueAnalytics.monthlyTrend.map(trend => ({
                    label: trend.monthName,
                    value: trend.revenue
                  }))}
                  height={300}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );

  const renderServicesTab = () => (
    <div className="space-y-6">
      {servicePerformance.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu Suất Dịch Vụ - Số Lượng Đặt Lịch</CardTitle>
                <CardDescription>Top 10 dịch vụ được đặt nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleChart
                  title=""
                  type="bar"
                  data={servicePerformance.slice(0, 10).map((service, index) => ({
                    label: service.serviceName,
                    value: service.bookingsCount,
                    color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][index % 5]}-500`
                  }))}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doanh Thu Theo Dịch Vụ</CardTitle>
                <CardDescription>Phân bổ doanh thu top 5 dịch vụ</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleChart
                  title=""
                  type="pie"
                  data={servicePerformance.slice(0, 5).map((service, index) => ({
                    label: service.serviceName,
                    value: service.totalRevenue,
                    color: `hsl(${index * 72}, 70%, 50%)`
                  }))}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Service Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Chi Tiết Hiệu Suất Dịch Vụ</CardTitle>
              <CardDescription>Bảng chi tiết các chỉ số của từng dịch vụ</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dịch Vụ</TableHead>
                    <TableHead>Số Đặt Lịch</TableHead>
                    <TableHead>Doanh Thu</TableHead>
                    <TableHead>Đánh Giá TB</TableHead>
                    <TableHead>Thị Phần</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicePerformance.slice(0, 10).map((service, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{service.serviceName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{service.bookingsCount}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {service.totalRevenue.toLocaleString()}đ
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{service.averageRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{service.marketShare.toFixed(1)}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderHelpersTab = () => (
    <div className="space-y-6">
      {helperRankings.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Người Giúp Việc - Tổng Thu Nhập</CardTitle>
              <CardDescription>Xếp hạng dựa trên tổng thu nhập trong kỳ</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleChart
                title=""
                type="bar"
                data={helperRankings.slice(0, 10).map((helper, index) => ({
                  label: helper.helperName,
                  value: helper.totalEarnings,
                  color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][index % 5]}-500`
                }))}
                height={400}
              />
            </CardContent>
          </Card>

          {/* Helper Rankings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Bảng Xếp Hạng Người Giúp Việc</CardTitle>
              <CardDescription>Chi tiết thống kê hiệu suất của từng helper</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hạng</TableHead>
                    <TableHead>Thông Tin</TableHead>
                    <TableHead>Đặt Lịch</TableHead>
                    <TableHead>Hoàn Thành</TableHead>
                    <TableHead>Tỷ Lệ</TableHead>
                    <TableHead>Đánh Giá</TableHead>
                    <TableHead>Thu Nhập</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {helperRankings.slice(0, 10).map((helper, index) => (
                    <TableRow key={helper.helperId}>
                      <TableCell>
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{helper.helperName}</div>
                          <div className="text-sm text-muted-foreground">{helper.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{helper.totalBookings}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{helper.completedBookings}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{helper.completionRate.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{helper.averageRating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {helper.totalEarnings.toLocaleString()}đ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-6">
      {bookingAnalytics && (
        <>
          {/* Booking Status Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Đặt Lịch</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingAnalytics.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ Duyệt</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{bookingAnalytics.pendingBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang Thực Hiện</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{bookingAnalytics.inProgressBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoàn Thành</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{bookingAnalytics.completedBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã Hủy</CardTitle>
                <span className="h-4 w-4 text-muted-foreground">❌</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{bookingAnalytics.cancelledBookings}</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu Suất Đặt Lịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Giá trị TB/Đặt lịch</span>
                  <span className="font-medium text-green-600">
                    {bookingAnalytics.averageBookingValue.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tỷ lệ hoàn thành</span>
                  <Badge variant="secondary">{bookingAnalytics.completionRate.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tỷ lệ hủy</span>
                  <Badge variant="destructive">{bookingAnalytics.cancellationRate.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours Chart */}
            {bookingAnalytics.peakHours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Giờ Cao Điểm Đặt Lịch</CardTitle>
                  <CardDescription>Phân bổ đặt lịch theo khung giờ</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    title=""
                    type="bar"
                    data={bookingAnalytics.peakHours.map(hour => ({
                      label: hour.timeRange,
                      value: hour.bookingsCount
                    }))}
                    height={300}
                  />
                </CardContent>
              </Card>
            )}

            {/* Popular Services */}
            {bookingAnalytics.popularServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Dịch Vụ Phổ Biến</CardTitle>
                  <CardDescription>Top dịch vụ được đặt nhiều nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    title=""
                    type="pie"
                    data={bookingAnalytics.popularServices.map((service, index) => ({
                      label: service.serviceName,
                      value: service.bookingsCount,
                      color: `hsl(${index * 60}, 70%, 50%)`
                    }))}
                    height={300}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Báo Cáo Quản Trị</h1>
              <p className="text-muted-foreground mt-1">Tổng quan và phân tích dữ liệu hệ thống</p>
            </div>
            <div className="flex items-center space-x-4">
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Tổng Quan</span>
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Doanh Thu</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Dịch Vụ</span>
              </TabsTrigger>
              <TabsTrigger value="helpers" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Helper</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Đặt Lịch</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">{renderOverviewTab()}</TabsContent>
            <TabsContent value="revenue">{renderRevenueTab()}</TabsContent>
            <TabsContent value="services">{renderServicesTab()}</TabsContent>
            <TabsContent value="helpers">{renderHelpersTab()}</TabsContent>
            <TabsContent value="bookings">{renderBookingsTab()}</TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
