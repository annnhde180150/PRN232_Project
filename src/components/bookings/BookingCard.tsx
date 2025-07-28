import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, CreditCard, Check, X } from 'lucide-react';
import { BookingDetails, BookingStatus } from '@/types/bookings';
import { PaymentHandler } from '@/components/payment';
import { getPaymentStatusForBooking } from '@/lib/payment-api';
import { PaymentStatus } from '@/types/payment';
import { ReviewButton, ReviewDisplay } from '@/components/reviews';
import { getReviewByBookingId } from '@/lib/review-api';
import { Review } from '@/types/review';
import { bookingAPI } from '@/lib/booking-api';

interface BookingCardProps {
  booking: BookingDetails;
  userId: number;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, userId }) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(true);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [acceptingHelper, setAcceptingHelper] = useState(false);
  const [rejectingHelper, setRejectingHelper] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(booking.status);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use paymentStatus from the unified API response if available
        if (booking.paymentStatus) {
          setPaymentStatus(booking.paymentStatus as PaymentStatus);
        } else {
          // Fallback to fetching payment status
          const status = await getPaymentStatusForBooking(userId, booking.bookingId);
          setPaymentStatus(status);
        }

        // Fetch existing review if booking is completed
        if (booking.status === 'Completed') {
          setLoadingReview(true);
          const review = await getReviewByBookingId(booking.bookingId);
          setExistingReview(review);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPaymentStatus(null);
      } finally {
        setLoadingPaymentStatus(false);
        setLoadingReview(false);
      }
    };

    fetchData();
  }, [userId, booking.bookingId, booking.status, booking.paymentStatus]);

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
      case 'TemporaryAccepted':
        return 'outline';
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
      case 'TemporaryAccepted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'Pending': return 'Chờ xác nhận';
      case 'Accepted': return 'Đã chấp nhận';
      case 'InProgress': return 'Đang thực hiện';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      case 'Rejected': return 'Từ chối';
      case 'TemporaryAccepted': return 'Chờ xác nhận từ bạn';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: PaymentStatus | null) => {
    switch (status) {
      case 'Success': return 'Đã thanh toán';
      case 'Pending': return 'Chờ thanh toán';
      case 'Failed': return 'Thanh toán thất bại';
      case 'Cancelled': return 'Đã hủy thanh toán';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
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
    return booking.serviceName || `Dịch vụ #${booking.serviceId}`;
  };

  const getAddress = () => {
    // First try fullAddress (new API structure)
    if (booking.fullAddress && booking.fullAddress.trim() !== '') {
      return booking.fullAddress;
    }
    
    // Fallback to address (legacy field)
    if (booking.address && booking.address.trim() !== '') {
      return booking.address;
    }
    
    // If we have individual address components, construct the address
    if (booking.ward && booking.district && booking.city) {
      return `${booking.ward}, ${booking.district}, ${booking.city}`;
    }
    
    return 'Địa chỉ không có sẵn';
  };

  const getPrice = () => {
    return booking.finalPrice || booking.estimatedPrice || 0;
  };

  // Check if payment is required based on payment status
  const isPaymentRequired = () => {
    if (loadingPaymentStatus) return false;
    
    if (paymentStatus !== null) {
      return paymentStatus === 'Pending';
    }
    
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

  // Callback to refresh review data
  const handleReviewSubmitted = () => {
    setLoadingReview(true);
    const fetchReview = async () => {
      try {
        const review = await getReviewByBookingId(booking.bookingId);
        setExistingReview(review);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoadingReview(false);
      }
    };
    fetchReview();
  };

  // Handle accepting helper
  const handleAcceptHelper = async () => {
    try {
      setAcceptingHelper(true);
      const success = await bookingAPI.acceptHelper(booking.bookingId, true);
      if (success) {
        setBookingStatus('Accepted');
      }
    } catch (error) {
      console.error('Error accepting helper:', error);
    } finally {
      setAcceptingHelper(false);
    }
  };

  // Handle rejecting helper
  const handleRejectHelper = async () => {
    try {
      setRejectingHelper(true);
      const success = await bookingAPI.acceptHelper(booking.bookingId, false);
      if (success) {
        setBookingStatus('Rejected');
      }
    } catch (error) {
      console.error('Error rejecting helper:', error);
    } finally {
      setRejectingHelper(false);
    }
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
                variant={getStatusBadgeVariant(bookingStatus)}
                className={getStatusColor(bookingStatus)}
              >
                {getStatusText(bookingStatus)}
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
                  {getPaymentStatusText(paymentStatus)}
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
            <p className="text-sm text-gray-500 mb-1">Mã đặt chỗ</p>
            <p className="font-mono text-sm">#{booking.bookingId}</p>
          </div>
        </div>

        {/* Helper information */}
        {booking.helperId && booking.helperName && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Người giúp việc:</span> {booking.helperName}
            </p>
            {booking.cancellationReason && (
              <p className="text-sm text-red-600 mt-1">
                <span className="font-medium">Lý do hủy:</span> {booking.cancellationReason}
              </p>
            )}
            {booking.freeCancellationDeadline && (
              <p className="text-sm text-orange-600 mt-1">
                <span className="font-medium">Hủy miễn phí đến:</span> {formatDate(booking.freeCancellationDeadline)}
              </p>
            )}
          </div>
        )}

        {/* Accept/Reject buttons for TemporaryAccepted status */}
        {bookingStatus === 'TemporaryAccepted' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Xác nhận người giúp việc:</span> {booking.helperName}
              </p>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={handleRejectHelper}
                  disabled={rejectingHelper || acceptingHelper}
                >
                  {rejectingHelper ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang từ chối
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <X className="h-4 w-4 mr-1" />
                      Từ chối
                    </span>
                  )}
                </Button>
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAcceptHelper}
                  disabled={rejectingHelper || acceptingHelper}
                >
                  {acceptingHelper ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang chấp nhận
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Chấp nhận
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Payment button - show based on payment status instead of booking status */}
        {isPaymentRequired() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Cần thanh toán:</span> {getPrice().toLocaleString('vi-VN')} ₫
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

        {/* Review section - show for completed bookings */}
        {booking.status === 'Completed' && !loadingReview && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {existingReview ? (
              <ReviewDisplay
                review={existingReview}
                helperName={booking.helperName}
                serviceName={getServiceName()}
              />
            ) : (
              (() => {
                console.log('ReviewButton bookingId:', booking.bookingId, 'helperId:', booking.helperId);
                if (!booking.helperId) {
                  return <div className="text-red-500">Không tìm thấy helperId cho booking này. Không thể gửi đánh giá.</div>;
                }
                return (
                  <ReviewButton
                    bookingId={booking.bookingId}
                    helperId={booking.helperId}
                    userId={userId}
                    bookingStatus={booking.status}
                    helperName={booking.helperName}
                    serviceName={getServiceName()}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                );
              })()
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard; 