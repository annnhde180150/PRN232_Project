'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Phone, MessageCircle, X, Star, CheckCircle, Eye } from 'lucide-react';
import { CancelBookingForm } from '@/components/booking/cancel-booking-form';
import { ReviewButton, ReviewDisplay, ReviewModal } from '@/components/reviews';
import { getReviewByBookingId } from '@/lib/review-api';
import { Review } from '@/types/review';
import { PaymentStatus } from '@/types/payment';
import { BookingDetails, BookingStatus } from '@/types/bookings';
import { useRouter } from 'next/navigation';
import { useChat } from '@/contexts/ChatContext';
import { Conversation } from '@/types/chat';

interface EnhancedBookingCardProps {
    booking: BookingDetails;
    onStatusUpdate: (newStatus?: string) => void;
    onRefresh?: () => void;
    userType: 'customer' | 'helper';
    userId: number;
}

export function EnhancedBookingCard({ booking, onStatusUpdate, onRefresh, userType, userId }: EnhancedBookingCardProps) {
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [existingReview, setExistingReview] = useState<Review | null>(null);
    const [loadingReview, setLoadingReview] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const router = useRouter();
    const { selectConversation } = useChat();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500 text-white';
            case 'Accepted': return 'bg-blue-500 text-white';
            case 'InProgress': return 'bg-orange-500 text-white';
            case 'Completed': return 'bg-green-500 text-white';
            case 'Cancelled': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

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

    const getPaymentStatusColor = (paymentStatus: string | null) => {
        switch (paymentStatus) {
            case 'Success': return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Failed': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const canCancel = (booking.status === 'Pending' || booking.status === 'Accepted' || booking.status === 'InProgress') &&
                     booking.freeCancellationDeadline && 
                     new Date() < new Date(booking.freeCancellationDeadline);
    const canReview = booking.status === 'Completed' && userType === 'customer' && booking.paymentStatus === 'Success';
    const canComplete = booking.status === 'InProgress' && userType === 'helper';
    const canViewReview = booking.status === 'Completed' && userType === 'helper';
    const canAccept = booking.status === 'Pending' && userType === 'helper';
    const canStart = booking.status === 'Accepted' && userType === 'helper';

    // Fetch review data when booking is completed
    useEffect(() => {
        const fetchReviewData = async () => {
            if (booking.status === 'Completed') {
                setLoadingReview(true);
                try {
                    // Fetch existing review
                    const review = await getReviewByBookingId(booking.bookingId);
                    setExistingReview(review);
                } catch (error) {
                    console.error('Error fetching review data:', error);
                } finally {
                    setLoadingReview(false);
                }
            }
        };

        fetchReviewData();
    }, [booking.status, booking.bookingId]);

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

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return '0';
        return price.toLocaleString('vi-VN');
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Improved address display logic - prioritize fullAddress over address
    const getAddressDisplay = () => {
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

    const getCustomerLabel = () => {
        return userType === 'customer' ? 'Khách hàng' : 'Khách hàng';
    };

    const getHelperLabel = () => {
        return userType === 'customer' ? (booking.helperName || 'Người giúp việc') : 'Khách hàng';
    };

    const getDateLabel = () => {
        return booking.scheduledStartTime ? new Date(booking.scheduledStartTime).toLocaleDateString('vi-VN') : 'Ngày không có sẵn';
    };

    const getTimeLabel = () => {
        if (booking.scheduledStartTime && booking.scheduledEndTime) {
            return `${formatTime(booking.scheduledStartTime)} - ${formatTime(booking.scheduledEndTime)}`;
        }
        return 'Thời gian không có sẵn';
    };

    // Function to handle opening chat
    const handleOpenChat = async () => {
        setLoadingChat(true);
        
        try {
            // Create a conversation object based on the booking
            const conversation: Conversation = {
                conversationId: `booking_${booking.bookingId}`,
                bookingId: booking.bookingId,
                participantUserId: userType === 'helper' ? booking.userId : null,
                participantHelperId: userType === 'customer' ? booking.helperId : null,
                participantName: userType === 'customer' ? booking.helperName : (booking.fullName || 'Khách hàng'),
                participantProfilePicture: null, // We don't have this info from the booking
                participantType: userType === 'customer' ? 'Helper' : 'User',
                lastMessage: {
                    chatId: 0,
                    bookingId: booking.bookingId,
                    senderUserId: null,
                    senderHelperId: null,
                    receiverUserId: null,
                    receiverHelperId: null,
                    messageContent: '',
                    timestamp: new Date().toISOString(),
                    isReadByReceiver: true,
                    readTimestamp: null,
                    isModerated: false,
                    moderatorAdminId: null,
                    senderName: '',
                    senderProfilePicture: null,
                    senderType: userType === 'customer' ? 'Helper' : 'User'
                },
                unreadCount: 0,
                lastActivity: new Date().toISOString()
            };

            // Select the conversation and navigate to chat page
            await selectConversation(conversation);
            router.push('/chat');
        } catch (error) {
            console.error('Error opening chat:', error);
            // If there's an error, we could show a toast notification here
            // but for now we'll just log it and reset the loading state
        } finally {
            setLoadingChat(false);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">{booking.serviceName || 'Dịch vụ'}</h3>
                        <p className="text-sm text-gray-600">#{booking.bookingId}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                    </Badge>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{getHelperLabel()}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{getAddressDisplay()}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{getDateLabel()}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{getTimeLabel()}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-green-600">
                        {formatPrice(booking.finalPrice || booking.estimatedPrice)}đ
                    </span>
                    {booking.paymentStatus && (
                        <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} font-semibold`}>
                            {booking.paymentStatus === 'Success' ? 'Đã thanh toán' : 
                             booking.paymentStatus === 'Pending' ? 'Chờ thanh toán' : 
                             booking.paymentStatus === 'Failed' ? 'Thanh toán thất bại' : 
                             booking.paymentStatus}
                        </Badge>
                    )}
                </div>

                <div className="flex space-x-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={handleOpenChat}
                        disabled={loadingChat}
                    >
                        {loadingChat ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                <span>Đang tải...</span>
                            </div>
                        ) : (
                            <>
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Nhắn tin
                            </>
                        )}
                    </Button>

                    {/* Helper Status Progression Buttons */}
                    {canAccept && (
                        <Button 
                            size="sm" 
                            onClick={() => onStatusUpdate('Accepted')} 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Chấp nhận
                        </Button>
                    )}

                    {canStart && (
                        <Button 
                            size="sm" 
                            onClick={() => onStatusUpdate('InProgress')} 
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg"
                        >
                            <Clock className="w-4 h-4 mr-1" />
                            Bắt đầu
                        </Button>
                    )}

                    {canComplete && (
                        <Button 
                            size="sm" 
                            onClick={() => onStatusUpdate('Completed')} 
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Hoàn thành
                        </Button>
                    )}

                    {/* Customer Review Button */}
                    {canReview && !existingReview && !loadingReview && (
                        <ReviewButton
                            bookingId={booking.bookingId}
                            helperId={booking.helperId}
                            userId={userId}
                            bookingStatus={booking.status as BookingStatus}
                            helperName={booking.helperName || 'Người giúp việc'}
                            serviceName={booking.serviceName || 'Dịch vụ'}
                            onReviewSubmitted={handleReviewSubmitted}
                        />
                    )}

                    {/* Helper View Review Button */}
                    {canViewReview && existingReview && (
                        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Xem đánh giá
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Đánh giá từ khách hàng</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                    <ReviewDisplay
                                        review={existingReview}
                                        helperName={booking.helperName || 'Người giúp việc'}
                                        serviceName={booking.serviceName || 'Dịch vụ'}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Customer Review Display */}
                    {userType === 'customer' && existingReview && (
                        <div className="flex-1">
                            <ReviewDisplay
                                review={existingReview}
                                helperName={booking.helperName || 'Người giúp việc'}
                                serviceName={booking.serviceName || 'Dịch vụ'}
                            />
                        </div>
                    )}

                    {canCancel && (
                        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                    <X className="w-4 h-4 mr-1" />
                                    Hủy
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Hủy đặt chỗ</DialogTitle>
                                </DialogHeader>
                                <CancelBookingForm
                                    booking={{
                                        bookingId: booking.bookingId,
                                        requestId: booking.requestId,
                                        userId: booking.userId,
                                        serviceId: booking.serviceId,
                                        helperId: booking.helperId,
                                        scheduledStartTime: booking.scheduledStartTime,
                                        scheduledEndTime: booking.scheduledEndTime,
                                        actualStartTime: booking.actualStartTime || undefined,
                                        actualEndTime: booking.actualEndTime || undefined,
                                        status: booking.status as 'Pending' | 'InProgress' | 'Completed' | 'Cancelled',
                                        cancellationReason: booking.cancellationReason || undefined,
                                        cancelledBy: booking.cancelledBy || undefined,
                                        cancellationTime: booking.cancellationTime || undefined,
                                        freeCancellationDeadline: booking.freeCancellationDeadline,
                                        estimatedPrice: booking.estimatedPrice,
                                        finalPrice: booking.finalPrice || undefined,
                                        bookingCreationTime: booking.bookingCreationTime || undefined
                                    }}
                                    onSuccess={() => {
                                        setShowCancelDialog(false);
                                        onRefresh?.(); 
                                    }}
                                    onCancel={() => setShowCancelDialog(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}