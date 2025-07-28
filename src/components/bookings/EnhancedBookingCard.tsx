'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Phone, MessageCircle, X, Star } from 'lucide-react';
import { CancelBookingForm } from '@/components/booking/cancel-booking-form';

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
    helperName?: string;
    helperPhone?: string;
    helperRating?: number;
}

interface EnhancedBookingCardProps {
    booking: Booking;
    onStatusUpdate: () => void;
    userType: 'customer' | 'helper';
}

export function EnhancedBookingCard({ booking, onStatusUpdate, userType }: EnhancedBookingCardProps) {
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'InProgress': return 'bg-blue-500 text-white';
            case 'Completed': return 'bg-green-500 text-white';
            case 'Cancelled': return 'bg-red-500 text-white';
            case 'Pending': return 'bg-yellow-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const canCancel = booking.status === 'Pending' || booking.status === 'InProgress';
    const canReview = booking.status === 'Completed' && userType === 'customer';
    const canComplete = booking.status === 'InProgress' && userType === 'helper';

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
                        <p className="text-sm text-gray-600">#{booking.bookingId}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                    </Badge>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{userType === 'customer' ? booking.helperName : booking.fullName}</span>
                        {booking.helperRating && (
                            <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{booking.helperRating}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{booking.fullAddress}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(booking.scheduledStartTime).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>
                            {new Date(booking.scheduledStartTime).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })} - {new Date(booking.scheduledEndTime).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-green-600">
                        {booking.estimatedPrice.toLocaleString()}đ
                    </span>
                </div>

                <div className="flex space-x-2">
                    {booking.helperPhone && (
                        <Button variant="outline" size="sm" className="flex-1">
                            <Phone className="w-4 h-4 mr-1" />
                            Gọi
                        </Button>
                    )}

                    <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                    </Button>

                    {canComplete && (
                        <Button size="sm" onClick={onStatusUpdate} className="flex-1">
                            Hoàn thành
                        </Button>
                    )}

                    {canReview && (
                        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="flex-1">
                                    <Star className="w-4 h-4 mr-1" />
                                    Đánh giá
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Đánh giá dịch vụ</DialogTitle>
                                </DialogHeader>
                                {/* Review form component would go here */}
                                <div className="p-4 text-center text-gray-500">
                                    Review form component
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    {canCancel && (
                        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <X className="w-4 h-4 mr-1" />
                                    Hủy
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Hủy đặt chỗ</DialogTitle>
                                </DialogHeader>
                                <CancelBookingForm
                                    booking={booking}
                                    onSuccess={() => {
                                        setShowCancelDialog(false);
                                        onStatusUpdate();
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