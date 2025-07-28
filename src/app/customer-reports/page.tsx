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

// Shadcn/UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Icons
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Heart,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

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

  // Helper functions for formatting
  const formatCurrency = (amount: number) => `${amount.toLocaleString()}đ`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'user') {
    return null;
  }

  const StatCard = ({
    title,
    value,
    icon,
    trend,
    trendValue,
    description,
    className = ""
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    description?: string;
    className?: string;
  }) => (
    <Card className={`transition-all duration-200 hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : trend === "down" ? (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            ) : null}
            <span className={trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : ""}>
              {trendValue}
            </span>
            {description && <span className="ml-1">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderBookingsTab = () => (
    <div className="space-y-6">
      {customerBookings && (
        <>
          {/* Main Booking Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng Đặt Lịch"
              value={customerBookings.totalBookings}
              icon={<Calendar className="h-4 w-4" />}
              trend="neutral"
              description="lịch hẹn"
            />
            <StatCard
              title="Đã Hoàn Thành"
              value={customerBookings.completedBookings}
              icon={<CheckCircle className="h-4 w-4" />}
              trend="up"
              trendValue={formatPercentage(customerBookings.completionRate)}
              description="tỷ lệ thành công"
            />
            <StatCard
              title="Đang Thực Hiện"
              value={customerBookings.inProgressBookings}
              icon={<Clock className="h-4 w-4" />}
            />
            <StatCard
              title="Chờ Duyệt"
              value={customerBookings.pendingBookings}
              icon={<AlertCircle className="h-4 w-4" />}
            />
          </div>

          {/* Performance and Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tổng Chi Tiêu"
              value={formatCurrency(customerBookings.totalBookingValue)}
              icon={<DollarSign className="h-4 w-4" />}
              className="border-green-200 bg-green-50"
            />
            <StatCard
              title="Chi Tiêu TB/Đặt Lịch"
              value={formatCurrency(customerBookings.averageBookingValue)}
              icon={<BarChart3 className="h-4 w-4" />}
              className="border-blue-200 bg-blue-50"
            />
            <StatCard
              title="Tỷ Lệ Hoàn Thành"
              value={formatPercentage(customerBookings.completionRate)}
              icon={<TrendingUp className="h-4 w-4" />}
              className="border-purple-200 bg-purple-50"
            />
          </div>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Phân Bổ Trạng Thái Đặt Lịch
              </CardTitle>
              <CardDescription>
                Tỷ lệ các trạng thái đặt lịch trong kỳ báo cáo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Hoàn thành</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {customerBookings.completedBookings}
                    </Badge>
                  </div>
                  <Progress
                    value={customerBookings.totalBookings > 0 ? (customerBookings.completedBookings / customerBookings.totalBookings) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Đang thực hiện</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {customerBookings.inProgressBookings}
                    </Badge>
                  </div>
                  <Progress
                    value={customerBookings.totalBookings > 0 ? (customerBookings.inProgressBookings / customerBookings.totalBookings) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chờ duyệt</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {customerBookings.pendingBookings}
                    </Badge>
                  </div>
                  <Progress
                    value={customerBookings.totalBookings > 0 ? (customerBookings.pendingBookings / customerBookings.totalBookings) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Đã hủy</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {customerBookings.cancelledBookings}
                    </Badge>
                  </div>
                  <Progress
                    value={customerBookings.totalBookings > 0 ? (customerBookings.cancelledBookings / customerBookings.totalBookings) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tổng Quan Đặt Lịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{customerBookings.totalBookings}</div>
                  <div className="text-sm text-blue-700 font-medium">Tổng đặt lịch</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border">
                  <div className="text-3xl font-bold text-green-600 mb-2">{customerBookings.completedBookings}</div>
                  <div className="text-sm text-green-700 font-medium">Hoàn thành</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{customerBookings.pendingBookings}</div>
                  <div className="text-sm text-orange-700 font-medium">Chờ duyệt</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border">
                  <div className="text-3xl font-bold text-red-600 mb-2">{customerBookings.cancelledBookings}</div>
                  <div className="text-sm text-red-700 font-medium">Đã hủy</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              value={formatCurrency(customerSpending.totalSpent)}
              icon={<DollarSign className="h-4 w-4" />}
              className="border-green-200 bg-gradient-to-br from-green-50 to-green-100"
            />
            <StatCard
              title="Chi Tiêu TB/Đặt Lịch"
              value={formatCurrency(customerSpending.averageSpendingPerBooking)}
              icon={<BarChart3 className="h-4 w-4" />}
              className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100"
            />
          </div>

          {/* Monthly Breakdown Table */}
          {customerSpending.spendingTrend.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Chi Tiết Chi Tiêu Theo Tháng
                </CardTitle>
                <CardDescription>
                  Thống kê chi tiêu chi tiết cho từng tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tháng</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tổng Chi Tiêu</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phí Nền Tảng</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Thanh Toán Helper</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Số Giao Dịch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerSpending.spendingTrend.map((trend, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">
                            {trend.monthName} {trend.year}
                          </td>
                          <td className="py-3 px-4 font-semibold text-green-600">
                            {formatCurrency(trend.revenue)}
                          </td>
                          <td className="py-3 px-4">
                            {formatCurrency(trend.platformFees)}
                          </td>
                          <td className="py-3 px-4">
                            {formatCurrency(trend.helperEarnings)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{trend.transactionCount}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Thông Tin Tài Chính
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">Khoảng Thời Gian</p>
                      <p className="text-xs text-green-700 mt-1">
                        Từ {new Date(customerSpending.period.start).toLocaleDateString('vi-VN')} đến {new Date(customerSpending.period.end).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.ceil((new Date(customerSpending.period.end).getTime() - new Date(customerSpending.period.start).getTime()) / (1000 * 60 * 60 * 24))} ngày
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Chi Tiêu Trung Bình/Tháng</p>
                      <p className="text-xs text-blue-700 mt-1">Dựa trên dữ liệu hiện tại</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {customerSpending.spendingTrend.length > 0
                        ? formatCurrency(Math.round(customerSpending.totalSpent / customerSpending.spendingTrend.length))
                        : formatCurrency(0)
                      }
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

  const renderFavoritesTab = () => (
    <div className="space-y-6">
      {favoriteHelpers.length > 0 ? (
        <>
          {/* Summary */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Heart className="h-5 w-5" />
                Người Giúp Việc Yêu Thích
              </CardTitle>
              <CardDescription className="text-blue-700">
                Bạn đã làm việc với {favoriteHelpers.length} người giúp việc. Dưới đây là danh sách những người bạn thường xuyên sử dụng dịch vụ.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Helpers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteHelpers.slice(0, 6).map((helper) => (
              <Card key={helper.helperId} className="transition-all duration-200 hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        {helper.helperName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{helper.helperName}</CardTitle>
                      <CardDescription>{helper.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tổng đặt lịch</span>
                      <Badge variant="secondary">{helper.totalBookings}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Đã hoàn thành</span>
                      <Badge className="bg-green-100 text-green-800">{helper.completedBookings}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</span>
                      <Badge className="bg-blue-100 text-blue-800">{formatPercentage(helper.completionRate)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Đánh giá</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                        <span className="font-medium text-orange-600">
                          {helper.averageRating}/5 ({helper.totalReviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service Breakdown */}
                  {helper.serviceBreakdown.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Dịch vụ đã sử dụng</h5>
                        <div className="space-y-1">
                          {helper.serviceBreakdown.slice(0, 3).map((service, index) => (
                            <div key={index} className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">{service.serviceName}</span>
                              <Badge variant="outline" className="text-xs">{service.bookingsCount} lần</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Chi Tiết Tất Cả Người Giúp Việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tên</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tổng Đặt Lịch</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Hoàn Thành</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tỷ Lệ HT</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Đánh Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favoriteHelpers.map((helper) => (
                      <tr key={helper.helperId} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{helper.helperName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{helper.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{helper.totalBookings}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">{helper.completedBookings}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-100 text-blue-800">{formatPercentage(helper.completionRate)}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                            <span className="text-orange-600 font-medium">{helper.averageRating}/5</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="text-center py-20">
          <CardContent>
            <div className="text-6xl mb-4">🤝</div>
            <CardTitle className="text-lg mb-2">Chưa có người giúp việc yêu thích</CardTitle>
            <CardDescription>Hãy đặt lịch và sử dụng dịch vụ để xây dựng danh sách yêu thích của bạn.</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Báo Cáo Của Tôi
              </h1>
              <p className="text-muted-foreground mt-1">Theo dõi lịch sử sử dụng dịch vụ và chi tiêu</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={(value: ReportPeriod) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Đặt Lịch
              </TabsTrigger>
              <TabsTrigger value="spending" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Chi Tiêu
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Yêu Thích
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              {renderBookingsTab()}
            </TabsContent>

            <TabsContent value="spending">
              {renderSpendingTab()}
            </TabsContent>

            <TabsContent value="favorites">
              {renderFavoritesTab()}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
} 