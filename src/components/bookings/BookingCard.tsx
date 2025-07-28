import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { Booking, PendingBooking, BookingStatus } from '@/types/bookings';
import { PaymentHandler } from '@/components/payment';
import { getPaymentStatusForBooking } from '@/lib/payment-api';
import { PaymentStatus } from '@/types/payment';

interface BookingCardProps {
  booking: Booking | PendingBooking;
  userId: number;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, userId }) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const status = await getPaymentStatusForBooking(userId, booking.bookingId);
        setPaymentStatus(status);
      } catch (error) {
        console.error('Error fetching payment status:', error);
        setPaymentStatus(null);
      } finally {
        setLoadingPaymentStatus(false);
      }
    };

    fetchPaymentStatus();
  }, [userId, booking.bookingId]);

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Accepted':
        return 'default';
      case 'InProgress':
        return 'default';
      case 'Completed':
        return 'default';
      case 'Cancelled':
        return 'destructive';
      case 'Rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'InProgress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getServiceName = () => {
    if ('serviceName' in booking) {
      return booking.serviceName;
    }
    return `Service #${booking.serviceId}`;
  };

  const getAddress = () => {
    if ('fullAddress' in booking) {
      return booking.fullAddress;
    }
    return 'Address not available';
  };

  const getPrice = () => {
    if ('estimatedPrice' in booking) {
      return booking.estimatedPrice;
    }
    return 0;
  };

  // Check if payment is required based on payment status
  const isPaymentRequired = () => {
    if (loadingPaymentStatus) return false;
    
    // If we have payment status, use it
    if (paymentStatus !== null) {
      return paymentStatus === 'Pending';
    }
    
    // Fallback to original booking status logic if payment status is not available
    return booking.status === 'Pending' || booking.status === 'Accepted';
  };

  // Callback to refresh payment status
  const handlePaymentStatusChange = () => {
    setLoadingPaymentStatus(true);
    const fetchPaymentStatus = async () => {
      try {
        const status = await getPaymentStatusForBooking(userId, booking.bookingId);
        setPaymentStatus(status);
      } catch (error) {
        console.error('Error fetching payment status:', error);
        setPaymentStatus(null);
      } finally {
        setLoadingPaymentStatus(false);
      }
    };
    fetchPaymentStatus();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {getServiceName()}
              </h3>
              <Badge 
                variant={getStatusBadgeVariant(booking.status)}
                className={getStatusColor(booking.status)}
              >
                {booking.status}
              </Badge>
              {/* Show payment status if available */}
              {paymentStatus && (
                <Badge 
                  variant="outline"
                  className={
                    paymentStatus === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      : paymentStatus === 'Success'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : paymentStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }
                >
                  Payment: {paymentStatus}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(booking.scheduledStartTime)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  {formatTime(booking.scheduledStartTime)} - {formatTime(booking.scheduledEndTime)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">
                  {getAddress()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">₫</span>
                <span>
                  {getPrice().toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Booking ID</p>
            <p className="font-mono text-sm">#{booking.bookingId}</p>
          </div>
        </div>

        {/* Additional details for pending bookings */}
        {'helperId' in booking && booking.helperId && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Helper:</span> {booking.helperName || `Helper #${booking.helperId}`}
            </p>
            {booking.cancellationReason && (
              <p className="text-sm text-red-600 mt-1">
                <span className="font-medium">Cancellation Reason:</span> {booking.cancellationReason}
              </p>
            )}
            {booking.freeCancellationDeadline && (
              <p className="text-sm text-orange-600 mt-1">
                <span className="font-medium">Free Cancellation Until:</span> {formatDate(booking.freeCancellationDeadline)}
              </p>
            )}
          </div>
        )}

        {/* Payment button - show based on payment status instead of booking status */}
        {isPaymentRequired() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Payment Required:</span> {getPrice().toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <PaymentHandler 
                userId={userId} 
                bookingId={booking.bookingId} 
                onPaymentStatusChange={handlePaymentStatusChange}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard; 