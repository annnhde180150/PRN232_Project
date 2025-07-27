'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Booking {
  bookingId: number;
  requestId: number;
  userId: number;
  serviceId: number;
  addressId: number;
  status: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  fullAddress: string;
  fullName: string;
  estimatedPrice: number;
  serviceName: string;
}

// Helper function to format price in VND
const formatPriceVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

type StatusFilter = 'all' | 'InProgress' | 'Completed';

export default function ActiveBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { user } = useAuth();
  const helperId = (user as any)?.id;

  const fetchActiveBookings = async () => {
    if (!helperId) {
      toast.error('Helper ID not found');
      return;
    }

    try {
      const response = await fetch(`https://helper-finder.azurewebsites.net/api/Bookings/ActiveByHelper/${helperId}`);
      const result = await response.json();
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number) => {
    if (!helperId) {
      toast.error('Helper ID not found');
      return;
    }

    try {
      const response = await fetch(`https://helper-finder.azurewebsites.net/api/Bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          helperId,
          status: 'Completed'
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Booking status updated successfully');
        fetchActiveBookings(); // Refresh the list
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  useEffect(() => {
    if (helperId) {
      fetchActiveBookings();
    }
  }, [helperId]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Đơn hàng đang hoạt động</h1>
        
        {/* Status Filter */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Lọc theo trạng thái</h2>
          <RadioGroup 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="InProgress" id="inProgress" />
              <Label htmlFor="inProgress">In Progress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Completed" id="completed" />
              <Label htmlFor="completed">Completed</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Bookings Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card key={booking.bookingId} className="p-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{booking.serviceName}</h2>
                <p className="text-sm text-gray-600">Customer: {booking.fullName}</p>
                <p className="text-sm text-gray-600">Address: {booking.fullAddress}</p>
                <p className="text-sm text-gray-600">
                  Start: {new Date(booking.scheduledStartTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  End: {new Date(booking.scheduledEndTime).toLocaleString()}
                </p>
                <p className="text-sm font-medium">
                  Price: {formatPriceVND(booking.estimatedPrice)} VND
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    booking.status === 'InProgress' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {booking.status}
                  </span>
                  {booking.status === 'InProgress' && (
                    <Button
                      onClick={() => updateBookingStatus(booking.bookingId)}
                      variant="default"
                    >
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bookings found for the selected status.
          </div>
        )}
      </div>
    </div>
  );
} 