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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DollarSign, Calendar, CheckCircle, BarChart3, Star, Clock, TrendingUp, Activity, Target, Lightbulb } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Thu Nhập</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {helperEarnings.totalEarnings.toLocaleString()}đ
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Thu nhập trong kỳ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Đặt Lịch</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {helperEarnings.totalBookings}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Số lượng công việc nhận
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã Hoàn Thành</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {helperEarnings.completedBookings}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Công việc đã hoàn thành
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ Lệ Hoàn Thành</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {helperEarnings.completionRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hiệu suất làm việc
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chi Tiết Thu Nhập</CardTitle>
                <CardDescription>Phân tích chi tiết về thu nhập</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Thu nhập TB/Đặt lịch</span>
                  <span className="font-medium text-green-600">
                    {helperEarnings.averageBookingValue.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tổng giờ làm việc</span>
                  <Badge variant="secondary">{helperEarnings.totalHoursWorked.toFixed(1)}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Thu nhập/giờ</span>
                  <span className="font-medium">
                    {helperEarnings.totalHoursWorked > 0 
                      ? Math.round(helperEarnings.totalEarnings / helperEarnings.totalHoursWorked).toLocaleString()
                      : '0'
                    }đ/h
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Đánh Giá & Phản Hồi</CardTitle>
                <CardDescription>Chất lượng dịch vụ của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đánh giá trung bình</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{helperEarnings.averageRating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tổng số đánh giá</span>
                  <Badge variant="outline">{helperEarnings.totalReviews}</Badge>
                </div>
                <div className="text-center pt-2">
                  <div className="text-sm text-muted-foreground">
                    {helperEarnings.averageRating >= 4.5 ? '🌟 Xuất sắc!' : 
                     helperEarnings.averageRating >= 4.0 ? '✨ Tốt!' : 
                     helperEarnings.averageRating >= 3.5 ? '👍 Khá tốt' : '💪 Cần cải thiện'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hiệu Suất Làm Việc</CardTitle>
                <CardDescription>Thống kê tổng quan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {helperEarnings.totalBookings > 0 
                      ? (helperEarnings.totalEarnings / helperEarnings.totalBookings).toLocaleString()
                      : '0'
                    }đ
                  </div>
                  <div className="text-sm text-muted-foreground">Thu nhập TB/công việc</div>
                </div>
                <div className="text-center pt-2">
                  <div className="text-lg font-semibold text-purple-600">
                    {((helperEarnings.completedBookings / helperEarnings.totalBookings) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Tỷ lệ thành công</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Trend Chart */}
          {helperEarnings.earningsTrend.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Xu Hướng Thu Nhập</CardTitle>
                <CardDescription>Biến động thu nhập theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleChart
                  title=""
                  type="line"
                  data={helperEarnings.earningsTrend.map(trend => ({
                    label: trend.monthName,
                    value: trend.earnings
                  }))}
                  height={300}
                />
              </CardContent>
            </Card>
          )}

          {/* Bookings Trend Chart */}
          {helperEarnings.earningsTrend.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Xu Hướng Số Lượng Đặt Lịch</CardTitle>
                <CardDescription>Số lượng công việc nhận theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleChart
                  title=""
                  type="bar"
                  data={helperEarnings.earningsTrend.map(trend => ({
                    label: trend.monthName,
                    value: trend.bookingsCount
                  }))}
                  height={300}
                />
              </CardContent>
            </Card>
          )}

          {/* Service Breakdown */}
          {helperEarnings.serviceBreakdown.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Phân Bổ Thu Nhập Theo Dịch Vụ</CardTitle>
                  <CardDescription>Nguồn thu nhập chính của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    title=""
                    type="pie"
                    data={helperEarnings.serviceBreakdown.map((service, index) => ({
                      label: service.serviceName,
                      value: service.totalEarnings,
                      color: `hsl(${index * 60}, 70%, 50%)`
                    }))}
                    height={300}
                  />
                </CardContent>
              </Card>

              {/* Service Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Chi Tiết Theo Dịch Vụ</CardTitle>
                  <CardDescription>Hiệu suất của từng loại dịch vụ</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dịch Vụ</TableHead>
                        <TableHead>Số Đặt Lịch</TableHead>
                        <TableHead>Thu Nhập</TableHead>
                        <TableHead>Đánh Giá TB</TableHead>
                        <TableHead>Tỷ Lệ Hoàn Thành</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {helperEarnings.serviceBreakdown.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{service.serviceName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{service.bookingsCount}</Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            {service.totalEarnings.toLocaleString()}đ
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{service.averageRating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={service.completionRate >= 90 ? "default" : "secondary"}>
                              {service.completionRate.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Giờ Làm Việc</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {scheduleAnalytics.totalHoursWorked.toFixed(1)}h
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Thời gian làm việc trong kỳ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giá Trị TB/Đặt Lịch</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {scheduleAnalytics.averageBookingValue.toLocaleString()}đ
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Thu nhập trung bình
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thời Gian Hoạt Động</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {new Date(scheduleAnalytics.period.start).toLocaleDateString('vi-VN')}
                </div>
                <div className="text-sm font-medium">
                  {new Date(scheduleAnalytics.period.end).toLocaleDateString('vi-VN')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Từ - Đến
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Trend */}
          {scheduleAnalytics.earningsTrend.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Biến Động Thu Nhập Theo Thời Gian</CardTitle>
                <CardDescription>Theo dõi xu hướng thu nhập của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleChart
                  title=""
                  type="line"
                  data={scheduleAnalytics.earningsTrend.map(trend => ({
                    label: trend.monthName,
                    value: trend.earnings
                  }))}
                  height={300}
                />
              </CardContent>
            </Card>
          )}

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Thông Tin Chi Tiết</span>
                </CardTitle>
                <CardDescription>Phân tích hiệu suất làm việc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Giờ Làm Việc Trung Bình/Tháng</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Dựa trên dữ liệu hiện tại</p>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {scheduleAnalytics.totalHoursWorked > 0 
                      ? (scheduleAnalytics.totalHoursWorked / Math.max(scheduleAnalytics.earningsTrend.length, 1)).toFixed(1)
                      : '0'
                    }h
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Thu Nhập/Giờ</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Hiệu suất thu nhập</p>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {scheduleAnalytics.totalHoursWorked > 0 
                      ? Math.round(scheduleAnalytics.earningsTrend.reduce((sum, trend) => sum + trend.earnings, 0) / scheduleAnalytics.totalHoursWorked).toLocaleString()
                      : '0'
                    }đ/h
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Tổng Đặt Lịch Trong Kỳ</p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Số lượng công việc đã nhận</p>
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {scheduleAnalytics.earningsTrend.reduce((sum, trend) => sum + trend.bookingsCount, 0)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Phân Tích Mô Hình Làm Việc</span>
                </CardTitle>
                <CardDescription>Xu hướng và thống kê chi tiết</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Xu Hướng Theo Tháng</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {scheduleAnalytics.earningsTrend.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{trend.monthName}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {trend.bookingsCount} đặt lịch
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {trend.earnings.toLocaleString()}đ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Gợi Ý Cải Thiện</span>
              </CardTitle>
              <CardDescription>Những lời khuyên để tăng thu nhập và hiệu suất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">💡</span>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Tối ưu thời gian
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Hãy tập trung vào những khung giờ có nhu cầu cao để tăng thu nhập.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">📈</span>
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Nâng cao kỹ năng
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Học thêm các dịch vụ mới để mở rộng cơ hội việc làm.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">⭐</span>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Chất lượng dịch vụ
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Duy trì đánh giá cao để thu hút nhiều khách hàng hơn.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">⏰</span>
                    <div>
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        Quản lý thời gian
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        Lập kế hoạch làm việc hiệu quả để tối ưu hóa thu nhập.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🤝</span>
                    <div>
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Giao tiếp tốt
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        Tương tác tích cực với khách hàng để xây dựng uy tín.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                        Đặt mục tiêu
                      </p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                        Thiết lập mục tiêu thu nhập hàng tháng để tăng động lực.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <h1 className="text-3xl font-bold tracking-tight">Báo Cáo Của Tôi</h1>
              <p className="text-muted-foreground mt-1">Theo dõi thu nhập và hiệu suất làm việc</p>
            </div>
            <div className="flex items-center space-x-4">
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Về Dashboard
              </Button>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="earnings" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Thu Nhập</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Lịch Trình</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="earnings">{renderEarningsTab()}</TabsContent>
            <TabsContent value="schedule">{renderScheduleTab()}</TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
