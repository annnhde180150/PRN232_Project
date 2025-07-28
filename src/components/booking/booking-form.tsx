'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { bookingApi, supportApi } from '@/lib/api/service-request';
import { Address, Service, Booking } from '@/types/service-request';

const formSchema = z.object({
    userId: z.number().min(1, 'ID người dùng là bắt buộc'),
    serviceId: z.number().min(1, 'Dịch vụ là bắt buộc'),
    addressId: z.number().min(1, 'Địa chỉ là bắt buộc'),
    requestedStartTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
    requestedDurationHours: z.number().min(1, 'Thời lượng phải ít nhất 1 giờ').max(8, 'Thời lượng không được vượt quá 8 giờ'),
    specialNotes: z.string().optional(),
    helperId: z.number().min(1, 'ID người giúp việc là bắt buộc')
});

type FormData = z.infer<typeof formSchema>;

interface BookingFormProps {
    editData?: Booking;
    helperId?: number;
    helperServiceName?: string; // Add helper service name prop
    onSuccess?: () => void;
}

export function BookingForm({ editData, helperId, helperServiceName, onSuccess }: BookingFormProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [helperServices, setHelperServices] = useState<Service[]>([]);
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const storedUser = localStorage.getItem("user_data");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: editData?.userId || currentUser?.id,
            serviceId: editData?.serviceId || 0,
            addressId: 0,
            requestedStartTime: editData?.scheduledStartTime ?
                new Date(editData.scheduledStartTime).toISOString().slice(0, 16) : '',
            requestedDurationHours: editData ?
                Math.round((new Date(editData.scheduledEndTime).getTime() - new Date(editData.scheduledStartTime).getTime()) / (1000 * 60 * 60)) : 2,
            specialNotes: '',
            helperId: editData?.helperId || helperId || 1
        }
    });

    useEffect(() => {
        loadData();
    }, [helperId]);

    const loadData = async () => {
        try {
            // Always load addresses
            const addressesRes = await supportApi.getUserAddresses(1);
            if (addressesRes.success) {
                setAddresses(addressesRes.data);
            }

            // Load services based on whether helperId is provided
            if (helperId) {
                const helperServicesRes = await supportApi.getHelperServices(helperId);
                if (helperServicesRes.success) {
                    setHelperServices(helperServicesRes.data);
                    
                    // Auto-set serviceId based on helper's service name
                    if (helperServiceName && helperServicesRes.data.length > 0) {
                        const matchingService = helperServicesRes.data.find(
                            service => service.serviceName === helperServiceName
                        );
                        if (matchingService) {
                            form.setValue('serviceId', matchingService.serviceId);
                        }
                    }
                }
            } else {
                const allServicesRes = await supportApi.getActiveServices();
                if (allServicesRes.success) {
                    setAllServices(allServicesRes.data);
                }
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
            console.error('Error loading data:', error);
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const bookingData = {
                userId: data.userId,
                serviceId: data.serviceId,
                addressId: data.addressId,
                requestedStartTime: new Date(data.requestedStartTime).toISOString(),
                requestedDurationHours: data.requestedDurationHours,
                specialNotes: data.specialNotes
            };

            let response;
            if (editData) {
                const editBookingData = {
                    ...editData,
                    scheduledStartTime: new Date(data.requestedStartTime).toISOString(),
                    scheduledEndTime: new Date(new Date(data.requestedStartTime).getTime() + data.requestedDurationHours * 60 * 60 * 1000).toISOString(),
                    serviceId: data.serviceId,
                    userId: data.userId,
                    helperId: data.helperId
                };
                response = await bookingApi.editBooking(editBookingData);
            } else {
                response = await bookingApi.bookHelper(data.helperId, bookingData);
            }

            if (response.success) {
                toast.success(editData ? 'Cập nhật đặt lịch thành công' : 'Đặt người giúp việc thành công');
                form.reset();
                onSuccess?.();

                // Chuyển hướng đến trang booking history sau khi đặt thành công
                setTimeout(() => {
                    router.push('/booking-history');
                }, 1500);
            } else {
                toast.error(response.message || 'Thao tác thất bại');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{editData ? 'Chỉnh sửa đặt lịch' : 'Đặt người giúp việc'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Hidden fields - userId and helperId will be sent automatically */}

                        {/* Service selection/display */}
                        {helperId && helperServiceName ? (
                            // Show read-only service when helper is specified
                            <FormField
                                control={form.control}
                                name="serviceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dịch vụ</FormLabel>
                                        <FormControl>
                                            <Input 
                                                value={helperServiceName}
                                                readOnly
                                                className="bg-gray-50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            // Show service selection dropdown when no helper is specified
                            <FormField
                                control={form.control}
                                name="serviceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dịch vụ</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn dịch vụ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {allServices.map((service) => (
                                                    <SelectItem key={service.serviceId} value={service.serviceId.toString()}>
                                                        {service.serviceName} - {service.basePrice.toLocaleString()} {service.priceUnit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="addressId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn địa chỉ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {addresses.map((address) => (
                                                <SelectItem key={address.addressId} value={address.addressId.toString()}>
                                                    {address.fullAddress} {address.isDefault && '(Mặc định)'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requestedStartTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thời gian bắt đầu yêu cầu</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requestedDurationHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thời lượng (Giờ)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="8"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="specialNotes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ghi chú đặc biệt</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Hướng dẫn đặc biệt nào khác..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Đang xử lý...' : (editData ? 'Cập nhật đặt lịch' : 'Đặt người giúp việc')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}