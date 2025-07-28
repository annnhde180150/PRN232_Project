'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Filter, RefreshCw } from 'lucide-react';
import { EnhancedBookingCard } from '@/components/bookings/EnhancedBookingCard';
import { bookingAPI } from '@/lib/booking-api';
import { BookingDetails, BookingStatus, BookingFilter } from '@/types/bookings';

// Helper function to format price in VND
const formatPriceVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

type StatusFilter = 'all' | 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled';

export default function ActiveBookingsPage() {
  const [allBookings, setAllBookings] = useState<BookingDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: ''
  });
  const { user } = useAuth();
  const helperId = (user as any)?.id;

  const fetchActiveBookings = async () => {
    if (!helperId) {
      toast.error('Helper ID not found');
      return;
    }

    try {
      setLoading(true);
      const allBookings = await bookingAPI.getHelperBookings(helperId);
      
      setAllBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus?: string) => {
    if (!helperId) {
      toast.error('Helper ID not found');
      return;
    }

    // If no newStatus provided, default to 'Completed' for backward compatibility
    const statusToUpdate = newStatus || 'Completed';

    try {
      const success = await bookingAPI.updateBookingStatus(bookingId, helperId, statusToUpdate);
      
      if (success) {
        const statusText = getStatusText(statusToUpdate);
        toast.success(`Trạng thái đã cập nhật thành ${statusText}`);
        fetchActiveBookings(); // Refresh the list
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...allBookings];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply date filters
    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      filtered = filtered.filter(booking =>
        new Date(booking.scheduledStartTime) >= startDate
      );
    }

    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
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
    setStatusFilter('all');
    setDateFilter({ startDate: '', endDate: '' });
  };

  useEffect(() => {
    if (helperId) {
      fetchActiveBookings();
    }
  }, [helperId]);

  useEffect(() => {
    applyFilters();
  }, [allBookings, statusFilter, dateFilter]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Đang tải đơn hàng...</span>
          </div>
        </div>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending': return 'Chờ xác nhận';
      case 'Accepted': return 'Đã chấp nhận';
      case 'InProgress': return 'Đang thực hiện';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') {
      return allBookings.length;
    }
    return allBookings.filter(booking => booking.status === status).length;
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Pending', label: 'Chờ xác nhận' },
    { value: 'Accepted', label: 'Đã chấp nhận' },
    { value: 'InProgress', label: 'Đang thực hiện' },
    { value: 'Completed', label: 'Hoàn thành' },
    { value: 'Cancelled', label: 'Đã hủy' }
  ] as const;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Đơn hàng đang hoạt động</h1>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Bộ Lọc</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Trạng thái</Label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={statusFilter === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(option.value)}
                      className="text-xs h-8 px-3"
                    >
                      {option.label} ({getStatusCount(option.value)})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Từ ngày</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Đến ngày</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

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
            </div>
          </CardContent>
        </Card>

        {/* Bookings Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <EnhancedBookingCard
              key={booking.bookingId}
              booking={booking}
              onStatusUpdate={(newStatus) => updateBookingStatus(booking.bookingId, newStatus)}
              onRefresh={fetchActiveBookings}
              userType="helper"
              userId={helperId}
            />
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {statusFilter === 'all' && !dateFilter.startDate && !dateFilter.endDate
              ? 'Không có đơn hàng nào.' 
              : `Không có đơn hàng nào phù hợp với bộ lọc đã chọn.`
            }
          </div>
        )}
      </div>
    </div>
  );
} 