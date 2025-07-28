'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceRequestForm } from '@/components/service-request/service-request-form';
import { ServiceRequestList } from '@/components/service-request/service-request-list';
import { BookingForm } from '@/components/booking/booking-form';
import { CancelBookingForm } from '@/components/booking/cancel-booking-form';
import { ReviewsView } from '@/components/reviews/reviews-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { bookingApi } from '@/lib/api/service-request';
import { Booking } from '@/types/service-request';

export default function ServiceRequestDemoPage() {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [bookingId, setBookingId] = useState<string>('');
    const [loadingBooking, setLoadingBooking] = useState(false);

    const loadBooking = async () => {
        const id = parseInt(bookingId);
        if (isNaN(id) || id <= 0) {
            toast.error('Vui lòng nhập ID đặt lịch hợp lệ');
            return;
        }

        setLoadingBooking(true);
        try {
            const response = await bookingApi.getBooking(id);
            if (response.success) {
                setSelectedBooking(response.data);
                toast.success('Tải đặt lịch thành công');
            } else {
                toast.error(response.message || 'Không thể tải đặt lịch');
                setSelectedBooking(null);
            }
        } catch (error) {
            toast.error('Không thể tải đặt lịch');
            console.error('Error loading booking:', error);
            setSelectedBooking(null);
        } finally {
            setLoadingBooking(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Tabs defaultValue="create-request" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="create-request">Tạo yêu cầu</TabsTrigger>
                    <TabsTrigger value="view-requests">Xem yêu cầu</TabsTrigger>
                    <TabsTrigger value="book-helper">Đặt người giúp việc</TabsTrigger>
                    <TabsTrigger value="cancel-booking">Hủy đặt lịch</TabsTrigger>
                    <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                </TabsList>

                <TabsContent value="create-request">
                    <ServiceRequestForm onSuccess={() => toast.success('Yêu cầu đã được tạo! Kiểm tra tab Xem yêu cầu.')} />
                </TabsContent>

                <TabsContent value="view-requests">
                    <ServiceRequestList />
                </TabsContent>

                <TabsContent value="book-helper">
                    <BookingForm onSuccess={() => toast.success('Đặt người giúp việc thành công!')} />
                </TabsContent>

                <TabsContent value="cancel-booking">
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tải đặt lịch để hủy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Nhập ID đặt lịch"
                                        value={bookingId}
                                        onChange={(e) => setBookingId(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onClick={loadBooking} disabled={loadingBooking}>
                                        {loadingBooking ? 'Đang tải...' : 'Tải đặt lịch'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {selectedBooking && (
                            <CancelBookingForm
                                booking={selectedBooking}
                                onSuccess={() => {
                                    setSelectedBooking(null);
                                    setBookingId('');
                                    toast.success('Hủy đặt lịch thành công!');
                                }}
                                onCancel={() => {
                                    setSelectedBooking(null);
                                    setBookingId('');
                                }}
                            />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="reviews">
                    <ReviewsView />
                </TabsContent>
            </Tabs>
        </div>
    );
}