'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { serviceRequestApi, supportApi } from '@/lib/api/service-request';
import { Address, Service, ServiceRequest } from '@/types/service-request';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
    userId: z.number().min(1, 'ID người dùng là bắt buộc'),
    serviceId: z.number().min(1, 'Dịch vụ là bắt buộc'),
    addressId: z.number().min(1, 'Địa chỉ là bắt buộc'),
    requestedStartTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
    requestedDurationHours: z.number().min(1, 'Thời lượng phải ít nhất 1 giờ').max(8, 'Thời lượng không được vượt quá 8 giờ'),
    specialNotes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface ServiceRequestFormProps {
    editData?: ServiceRequest;
    onSuccess?: () => void;
    onSubmitStart?: () => void;
    onSubmitEnd?: () => void;
}

export function ServiceRequestForm({ editData, onSuccess, onSubmitStart, onSubmitEnd }: ServiceRequestFormProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const getCurrentUserId = (): number => {
      if (!isAuthenticated || !user) {
        return 0;
      }
      return user.id || 0;
    };
  
    const userId = getCurrentUserId();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: editData?.userId || userId,
            serviceId: editData?.serviceId || 0,
            addressId: editData?.addressId || 0,
            requestedStartTime: editData?.requestedStartTime ?
                new Date(editData.requestedStartTime).toISOString().slice(0, 16) : '',
            requestedDurationHours: editData?.requestedDurationHours || 2,
            specialNotes: editData?.specialNotes || ''
        }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [addressesRes, servicesRes] = await Promise.all([
                supportApi.getUserAddresses(1), // Default user ID
                supportApi.getActiveServices()
            ]);

            if (addressesRes.success) {
                setAddresses(addressesRes.data);
            }

            if (servicesRes.success) {
                setServices(servicesRes.data);
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
            console.error('Error loading data:', error);
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        if (onSubmitStart) onSubmitStart();
        
        try {
            const requestData = {
                ...data,
                requestedStartTime: new Date(data.requestedStartTime).toISOString()
            };

            let response;
            if (editData) {
                response = await serviceRequestApi.editRequest({
                    ...editData,
                    ...requestData
                });
            } else {
                response = await serviceRequestApi.createRequest(requestData);
            }

            if (response.success) {
                toast.success(editData ? 'Cập nhật yêu cầu thành công' : 'Tạo yêu cầu thành công');
                form.reset();
                if (onSuccess) onSuccess();
            } else {
                toast.error(response.message || 'Thao tác thất bại');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi');
            console.error('Error:', error);
        } finally {
            setLoading(false);
            if (onSubmitEnd) onSubmitEnd();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{editData ? 'Chỉnh sửa yêu cầu dịch vụ' : 'Tạo yêu cầu dịch vụ'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                            {services.map((service) => (
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
                            {loading ? 'Đang xử lý...' : (editData ? 'Cập nhật yêu cầu' : 'Tạo yêu cầu')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}