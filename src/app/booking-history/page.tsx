'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import { bookingAPI } from '@/lib/booking-api';
import { Booking, PendingBooking, BookingStatus, BookingFilter } from '@/types/bookings';
import { authUtils } from '@/lib/api';
import { BookingCard } from '@/components/bookings';

const BookingHistoryPage = () => {
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<(Booking | PendingBooking)[]>([]);
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
  }, [activeBookings, pendingBookings, filter]);

  const fetchBookings = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await bookingAPI.getBookingsWithFilter(userId, filter);
      setActiveBookings(result.active);
      setPendingBookings(result.pending);
    } catch (err) {
      setError('Không thể tải lịch sử đặt dịch vụ');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activeBookings, ...pendingBookings];

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

    // Sort by scheduled start time (newest first)
    filtered.sort((a, b) =>
      new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime()
    );

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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchBookings} variant="outline">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đặt dịch vụ</h1>
        <p className="text-gray-600">Xem và quản lý các dịch vụ đã đặt</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select
                value={filter.status || 'All'}
                onValueChange={(value) => setFilter(prev => ({
                  ...prev,
                  status: value === 'All' ? undefined : value as BookingStatus
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="All">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Pending">Chờ xử lý</SelectItem>
                  <SelectItem value="Accepted">Đã chấp nhận</SelectItem>
                  <SelectItem value="InProgress">Đang thực hiện</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                  <SelectItem value="Rejected">Đã từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start-date">Ngày bắt đầu</Label>
              <Input
                id="start-date"
                type="date"
                value={filter.startDate || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value || undefined }))}
              />
            </div>

            <div>
              <Label htmlFor="end-date">Ngày kết thúc</Label>
              <Input
                id="end-date"
                type="date"
                value={filter.endDate || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value || undefined }))}
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={clearFilters} variant="outline" className="flex-1">
                Xóa bộ lọc
              </Button>
              <Button onClick={fetchBookings} variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Hiển thị {filteredBookings.length} đặt dịch vụ
          </p>
          {Object.keys(filter).length > 0 && (
            <Badge variant="secondary">
              Đã áp dụng bộ lọc
            </Badge>
          )}
        </div>
      </div>

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
            <BookingCard key={booking.bookingId} booking={booking} userId={userId!} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage; 