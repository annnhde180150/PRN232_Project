'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { bookingAPI } from '@/lib/booking-api';
import { BookingDetails, BookingStatus, BookingFilter } from '@/types/bookings';
import { authUtils } from '@/lib/api';
import { BookingCard } from '@/components/bookings';

const BookingHistoryPage = () => {
  const [allBookings, setAllBookings] = useState<BookingDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingFilter>({});
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userData = authUtils.getUserData();
    if (userData.user && 'id' in userData.user) {
      setUserId(userData.user.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [allBookings, filter]);

  const fetchBookings = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const bookings = await bookingAPI.getUserBookings(userId);
      setAllBookings(bookings);
    } catch (err) {
      setError('Không thể tải lịch sử đặt dịch vụ');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allBookings];

    if (filter.status) {
      filtered = filtered.filter(booking => booking.status === filter.status);
    }

    if (filter.startDate) {
      const startDate = new Date(filter.startDate);
      filtered = filtered.filter(booking =>
        new Date(booking.scheduledStartTime) >= startDate
      );
    }

    if (filter.endDate) {
      const endDate = new Date(filter.endDate);
      filtered = filtered.filter(booking =>
        new Date(booking.scheduledStartTime) <= endDate
      );
    }

    // Sort based on filter
    if (filter.sortBy === 'bookingId') {
      if (filter.sortOrder === 'desc') {
        filtered.sort((a, b) => b.bookingId - a.bookingId);
      } else {
        filtered.sort((a, b) => a.bookingId - b.bookingId);
      }
    } else {
      // Default sort by scheduled start time (newest first)
      filtered.sort((a, b) =>
        new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime()
      );
    }

    setFilteredBookings(filtered);
  };

  const clearFilters = () => {
    setFilter({});
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Đang tải lịch sử đặt dịch vụ...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-red-500" />
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Lịch Sử Đặt Dịch Vụ</h1>
          <p className="text-gray-600">
            Xem và quản lý tất cả các đặt dịch vụ của bạn
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Bộ Lọc</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={filter.status || 'all'}
                  onValueChange={(value) => setFilter(prev => ({ 
                    ...prev, 
                    status: value === 'all' ? undefined : value as BookingStatus 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Pending">Chờ duyệt</SelectItem>
                    <SelectItem value="Accepted">Đã chấp nhận</SelectItem>
                    <SelectItem value="InProgress">Đang thực hiện</SelectItem>
                    <SelectItem value="Completed">Hoàn thành</SelectItem>
                    <SelectItem value="Cancelled">Đã hủy</SelectItem>
                    <SelectItem value="Rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Từ ngày</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filter.startDate || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              {/* End Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="endDate">Đến ngày</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filter.endDate || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sắp xếp theo</Label>
                <Select
                  value={filter.sortBy || 'date'}
                  onValueChange={(value) => setFilter(prev => ({ 
                    ...prev, 
                    sortBy: value as 'date' | 'bookingId',
                    sortOrder: value === 'bookingId' ? (prev.sortOrder || 'desc') : undefined
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Ngày đặt</SelectItem>
                    <SelectItem value="bookingId">Mã đặt dịch vụ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order Filter (only show when sorting by booking ID) */}
              {filter.sortBy === 'bookingId' && (
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Thứ tự</Label>
                  <Select
                    value={filter.sortOrder || 'desc'}
                    onValueChange={(value) => setFilter(prev => ({ 
                      ...prev, 
                      sortOrder: value as 'asc' | 'desc'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Thứ tự" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Giảm dần (mới nhất)</SelectItem>
                      <SelectItem value="asc">Tăng dần (cũ nhất)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đặt dịch vụ nào</h3>
                <p className="text-gray-600">
                  {Object.keys(filter).length > 0
                    ? 'Thử điều chỉnh bộ lọc để xem thêm kết quả.'
                    : 'Bạn chưa đặt dịch vụ nào.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard 
                key={booking.bookingId} 
                booking={booking} 
                userId={userId!} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage; 