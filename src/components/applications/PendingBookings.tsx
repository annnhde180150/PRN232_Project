import { useState, useEffect } from 'react';
import { BookingRequest } from '@/types/applications';
import { getHelperBookings, updateBookingStatus } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const PendingBookings = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      if (!user?.id) return;
      const data = await getHelperBookings(user.id);
      setBookings(data.filter(booking => booking.status === 'Pending'));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  const handleStatusUpdate = async (bookingId: number, requestId: number, action: 'Accept' | 'Cancel') => {
    try {
      await updateBookingStatus({
        bookingId,
        requestId,
        action
      });
      const actionText = action === 'Accept' ? 'chấp thuận' : 'hủy';
      toast.success(`Đơn hàng số ${bookingId} đã ${actionText} thành công`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(`Failed to ${action.toLowerCase()} booking`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending bookings found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Bookings</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
                <p className="text-gray-600">{booking.fullName}</p>
                <p className="text-sm text-gray-500">{booking.fullAddress}</p>
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Start:</span>{' '}
                    {new Date(booking.scheduledStartTime).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">End:</span>{' '}
                    {new Date(booking.scheduledEndTime).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Estimated Price: ${booking.estimatedPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleStatusUpdate(booking.bookingId, booking.requestId, 'Accept')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(booking.bookingId, booking.requestId, 'Cancel')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 