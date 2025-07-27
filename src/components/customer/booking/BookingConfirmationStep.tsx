'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { BookingFormData } from '@/types/booking';
import {
    Check,
    Clock,
    MapPin,
    User,
    Phone,
    CreditCard,
    Shield,
    Star,
    Calendar,
    Home,
    Building,
    Loader2
} from 'lucide-react';

interface BookingConfirmationStepProps {
    formData: BookingFormData;
    helperId?: string;
    isSubmitting: boolean;
    onSubmit: () => void;
}

// Mock helper data
const mockHelperData = {
    id: 'helper-1',
    name: 'Nguyễn Thị Mai',
    avatar: undefined,
    rating: 4.8,
    reviewCount: 127,
    isVerified: true,
    responseTime: '5 phút',
    completionRate: 98
};

const addressTypeIcons = {
    home: <Home className="w-4 h-4" />,
    office: <Building className="w-4 h-4" />,
    other: <MapPin className="w-4 h-4" />
};

const addressTypeLabels = {
    home: 'Nhà riêng',
    office: 'Văn phòng',
    other: 'Khác'
};

export const BookingConfirmationStep: React.FC<BookingConfirmationStepProps> = ({
    formData,
    helperId,
    isSubmitting,
    onSubmit
}) => {
    const { serviceSelection, dateTime, address } = formData;
    const estimatedPrice = serviceSelection?.priceRange.min || 0;
    const serviceFee = 0; // Free for now
    const totalPrice = estimatedPrice + serviceFee;

    return (
        <div className="space-y-6">
            {/* Booking Summary Header */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-blue-900 mb-2">
                            Xác nhận đặt dịch vụ
                        </h2>
                        <p className="text-blue-700">
                            Vui lòng kiểm tra lại thông tin trước khi xác nhận
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Chi tiết dịch vụ
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            {serviceSelection?.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                                {serviceSelection?.serviceName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{serviceSelection?.category}</Badge>
                                <span className="text-sm text-gray-500">
                                    Theo {serviceSelection?.duration}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-primary">
                                {estimatedPrice.toLocaleString('vi-VN')}₫
                            </p>
                            <p className="text-xs text-gray-500">Ước tính</p>
                        </div>
                    </div>

                    {serviceSelection?.description && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{serviceSelection.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Date & Time Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Thời gian thực hiện
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            {dateTime?.isFlexible ? (
                                <div>
                                    <h3 className="font-medium text-gray-900">Thời gian linh hoạt</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Người giúp việc sẽ đề xuất thời gian phù hợp trong khung giờ:
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline">Sáng sớm (7:00-11:00)</Badge>
                                        <Badge variant="outline">Buổi trưa (13:00-17:00)</Badge>
                                        <Badge variant="outline">Buổi tối (18:00-20:00)</Badge>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {dateTime?.date.toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {dateTime?.startTime}
                                        {dateTime?.endTime && ` - ${dateTime.endTime}`}
                                        {dateTime?.duration && ` (${dateTime.duration} giờ)`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Address Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Địa chỉ thực hiện
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                            {addressTypeIcons[address?.addressType || 'other']}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-gray-900">
                                    {addressTypeLabels[address?.addressType || 'other']}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                    {address?.addressType}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                {address?.fullAddress}
                            </p>

                            {(address?.contactName || address?.contactPhone) && (
                                <div className="space-y-1">
                                    {address.contactName && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-4 h-4" />
                                            <span>{address.contactName}</span>
                                        </div>
                                    )}
                                    {address.contactPhone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{address.contactPhone}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {address?.specialInstructions && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <strong>Ghi chú:</strong> {address.specialInstructions}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Helper Information (if available) */}
            {helperId && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Người giúp việc
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-gray-900">{mockHelperData.name}</h3>
                                    {mockHelperData.isVerified && (
                                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                            <Shield className="w-3 h-3 mr-1" />
                                            Đã xác minh
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span>{mockHelperData.rating} ({mockHelperData.reviewCount} đánh giá)</span>
                                    </div>
                                    <span>Phản hồi trong {mockHelperData.responseTime}</span>
                                    <span>{mockHelperData.completionRate}% hoàn thành</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Price Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Chi tiết thanh toán
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Giá dịch vụ</span>
                        <span className="font-medium">{estimatedPrice.toLocaleString('vi-VN')}₫</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Phí dịch vụ</span>
                        <span className="font-medium text-green-600">
                            {serviceFee === 0 ? 'Miễn phí' : `${serviceFee.toLocaleString('vi-VN')}₫`}
                        </span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Tổng cộng</span>
                        <span className="text-primary">{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Lưu ý:</strong> Giá cuối cùng có thể thay đổi tùy thuộc vào thời gian thực tế và yêu cầu cụ thể.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                            <p className="mb-2">
                                Bằng cách xác nhận đặt dịch vụ, bạn đồng ý với:
                            </p>
                            <ul className="space-y-1 text-xs">
                                <li>• Điều khoản sử dụng dịch vụ</li>
                                <li>• Chính sách bảo mật thông tin</li>
                                <li>• Quy định về thanh toán và hoàn tiền</li>
                                <li>• Cam kết chất lượng dịch vụ</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full md:w-auto px-8 py-3 text-base font-medium"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5 mr-2" />
                            Xác nhận đặt dịch vụ
                        </>
                    )}
                </Button>
            </div>

            {/* Support Contact */}
            <div className="text-center text-sm text-gray-500">
                <p>
                    Cần hỗ trợ? Liên hệ{' '}
                    <a href="tel:1900123456" className="text-primary hover:underline">
                        1900 123 456
                    </a>
                    {' '}hoặc{' '}
                    <a href="mailto:support@findhelper.vn" className="text-primary hover:underline">
                        support@findhelper.vn
                    </a>
                </p>
            </div>
        </div>
    );
};