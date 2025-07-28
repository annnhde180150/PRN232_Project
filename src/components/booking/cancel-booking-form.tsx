'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { bookingApi } from '@/lib/api/service-request';
import { Booking } from '@/types/service-request';

const formSchema = z.object({
    cancellationReason: z.string()
        .min(1, 'Lý do hủy là bắt buộc')
        .max(500, 'Lý do hủy không được quá 500 ký tự')
        .refine(val => val.trim().length > 0, 'Lý do hủy không được để trống'),
    cancelledBy: z.enum(['User', 'Helper'], {
        message: 'Vui lòng chọn ai đang hủy'
    })
});

type FormData = z.infer<typeof formSchema>;

interface CancelBookingFormProps {
    booking: Booking;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CancelBookingForm({ booking, onSuccess, onCancel }: CancelBookingFormProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cancellationReason: '',
            cancelledBy: 'User'
        }
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            // Ensure all required fields are present and valid
            if (!booking.bookingId || !data.cancellationReason?.trim() || !data.cancelledBy) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                setLoading(false);
                return;
            }

            // Check deadline one more time before API call
            if (booking.freeCancellationDeadline && new Date() > new Date(booking.freeCancellationDeadline)) {
                toast.error('Đã quá hạn hủy miễn phí. Không thể hủy đặt lịch này.');
                setLoading(false);
                return;
            }

            const response = await bookingApi.cancelBooking({
                bookingId: booking.bookingId,
                cancellationReason: data.cancellationReason.trim(),
                cancelledBy: data.cancelledBy
            });

            if (response.success) {
                toast.success('Hủy đặt lịch thành công');
                onSuccess?.();
            } else {
                // Handle specific error messages
                const errorMessage = response.message || 'Không thể hủy đặt lịch';
                if (errorMessage.includes('Invalid request') || errorMessage.includes('deadline')) {
                    toast.error('Đã quá hạn hủy hoặc yêu cầu không hợp lệ');
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (error: any) {
            console.error('Error cancelling booking:', error);
            
            // Handle HTTP status codes from backend validation
            if (error.response?.status === 400) {
                const errorMsg = error.response?.data?.message || error.response?.data || 'Yêu cầu không hợp lệ';
                if (typeof errorMsg === 'string' && errorMsg.includes('deadline')) {
                    toast.error('Đã quá hạn hủy miễn phí');
                } else {
                    toast.error('Yêu cầu hủy không hợp lệ. Vui lòng kiểm tra lại thông tin.');
                }
            } else if (error.response?.status === 404) {
                toast.error('Không tìm thấy đặt lịch này');
            } else {
                toast.error('Đã xảy ra lỗi khi hủy đặt lịch. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Check if cancellation is allowed (before deadline)
    const canCancel = new Date() < new Date(booking.freeCancellationDeadline);
    const timeUntilDeadline = new Date(booking.freeCancellationDeadline).getTime() - new Date().getTime();
    const hoursUntilDeadline = Math.floor(timeUntilDeadline / (1000 * 60 * 60));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hủy đặt lịch #{booking.bookingId}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Chi tiết đặt lịch:</h4>
                    <p><strong>Thời gian bắt đầu:</strong> {new Date(booking.scheduledStartTime).toLocaleString()}</p>
                    <p><strong>Thời gian kết thúc:</strong> {new Date(booking.scheduledEndTime).toLocaleString()}</p>
                    <p><strong>Trạng thái:</strong> {booking.status}</p>
                    <p><strong>Giá ước tính:</strong> {booking.estimatedPrice.toLocaleString()} VND</p>
                    <p><strong>Hạn hủy miễn phí:</strong> {new Date(booking.freeCancellationDeadline).toLocaleString()}</p>

                    {!canCancel && (
                        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                            <strong>Cảnh báo:</strong> Đã quá hạn hủy miễn phí. Việc hủy có thể phát sinh phí.
                        </div>
                    )}

                    {canCancel && hoursUntilDeadline > 0 && (
                        <div className="mt-2 p-2 bg-green-100 text-green-700 rounded">
                            <strong>Hủy miễn phí:</strong> Bạn còn {hoursUntilDeadline} giờ để hủy miễn phí.
                        </div>
                    )}
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="cancelledBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Được hủy bởi</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn ai đang hủy" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="User">Người dùng</SelectItem>
                                            <SelectItem value="Helper">Người giúp việc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cancellationReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lý do hủy</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Vui lòng cung cấp lý do hủy..."
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <Button 
                                type="submit" 
                                disabled={loading || !canCancel} 
                                variant="destructive" 
                                className="flex-1"
                            >
                                {loading ? 'Đang hủy...' : !canCancel ? 'Không thể hủy' : 'Hủy đặt lịch'}
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                                Quay lại
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}