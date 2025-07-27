'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    BookingFormData,
    BookingStep,
    BookingStepId,
    BOOKING_STEPS,
    BookingValidationErrors,
    BookingSubmissionResponse
} from '@/types/booking';
import { ServiceSelectionStep } from './ServiceSelectionStep';
import { DateTimeSelectionStep } from './DateTimeSelectionStep';
import { AddressSelectionStep } from './AddressSelectionStep';
import { BookingConfirmationStep } from './BookingConfirmationStep';
import {
    ChevronLeft,
    ChevronRight,
    Check,
    Clock,
    MapPin,
    CreditCard,
    AlertCircle
} from 'lucide-react';

interface BookingWizardProps {
    initialData?: Partial<BookingFormData>;
    helperId?: string;
    onComplete?: (bookingId: string) => void;
    className?: string;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
    initialData,
    helperId,
    onComplete,
    className
}) => {
    const router = useRouter();
    const [currentStepId, setCurrentStepId] = useState<BookingStepId>('service');
    const [steps, setSteps] = useState<Record<BookingStepId, BookingStep>>(BOOKING_STEPS);
    const [formData, setFormData] = useState<Partial<BookingFormData>>(initialData || {});
    const [errors, setErrors] = useState<BookingValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get current step index
    const stepIds: BookingStepId[] = ['service', 'datetime', 'address', 'confirmation'];
    const currentStepIndex = stepIds.indexOf(currentStepId);

    // Update step completion status
    const updateStepStatus = useCallback((stepId: BookingStepId, isCompleted: boolean) => {
        setSteps(prev => ({
            ...prev,
            [stepId]: {
                ...prev[stepId],
                isCompleted
            }
        }));
    }, []);

    // Validate current step
    const validateCurrentStep = useCallback((): boolean => {
        const newErrors: BookingValidationErrors = {};

        switch (currentStepId) {
            case 'service':
                if (!formData.serviceSelection) {
                    newErrors.serviceSelection = 'Vui lòng chọn dịch vụ';
                }
                break;

            case 'datetime':
                if (!formData.dateTime?.date) {
                    newErrors.dateTime = 'Vui lòng chọn ngày';
                } else if (!formData.dateTime?.startTime) {
                    newErrors.dateTime = 'Vui lòng chọn giờ bắt đầu';
                }
                break;

            case 'address':
                if (!formData.address?.fullAddress) {
                    newErrors.address = 'Vui lòng nhập địa chỉ';
                } else if (!formData.address?.ward || !formData.address?.district || !formData.address?.city) {
                    newErrors.address = 'Vui lòng chọn địa chỉ đầy đủ';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [currentStepId, formData]);

    // Handle step data update
    const handleStepDataUpdate = useCallback((stepData: Partial<BookingFormData>) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        setErrors({});
    }, []);

    // Handle next step
    const handleNext = useCallback(() => {
        if (!validateCurrentStep()) return;

        updateStepStatus(currentStepId, true);

        if (currentStepIndex < stepIds.length - 1) {
            const nextStepId = stepIds[currentStepIndex + 1];
            setCurrentStepId(nextStepId);

            // Update step active status
            setSteps(prev => ({
                ...prev,
                [currentStepId]: { ...prev[currentStepId], isActive: false },
                [nextStepId]: { ...prev[nextStepId], isActive: true }
            }));
        }
    }, [currentStepId, currentStepIndex, stepIds, validateCurrentStep, updateStepStatus]);

    // Handle previous step
    const handlePrevious = useCallback(() => {
        if (currentStepIndex > 0) {
            const prevStepId = stepIds[currentStepIndex - 1];
            setCurrentStepId(prevStepId);

            // Update step active status
            setSteps(prev => ({
                ...prev,
                [currentStepId]: { ...prev[currentStepId], isActive: false },
                [prevStepId]: { ...prev[prevStepId], isActive: true }
            }));
        }
    }, [currentStepId, currentStepIndex, stepIds]);

    // Handle booking submission
    const handleSubmit = useCallback(async () => {
        if (!validateCurrentStep()) return;

        setIsSubmitting(true);
        try {
            // Mock API call - replace with actual API
            const response: BookingSubmissionResponse = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        bookingId: 'booking-' + Date.now(),
                        message: 'Đặt dịch vụ thành công!',
                        estimatedPrice: formData.serviceSelection?.priceRange.min || 0,
                        confirmationCode: 'CONF' + Math.random().toString(36).substr(2, 6).toUpperCase()
                    });
                }, 2000);
            });

            if (response.success && response.bookingId) {
                updateStepStatus('confirmation', true);
                onComplete?.(response.bookingId);
            }
        } catch (error) {
            console.error('Booking submission error:', error);
            setErrors({ address: 'Có lỗi xảy ra khi đặt dịch vụ. Vui lòng thử lại.' });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateCurrentStep, updateStepStatus, onComplete]);

    // Render step content
    const renderStepContent = () => {
        switch (currentStepId) {
            case 'service':
                return (
                    <ServiceSelectionStep
                        initialData={formData.serviceSelection}
                        onDataUpdate={(data) => handleStepDataUpdate({ serviceSelection: data })}
                        error={errors.serviceSelection}
                    />
                );

            case 'datetime':
                return (
                    <DateTimeSelectionStep
                        initialData={formData.dateTime}
                        serviceData={formData.serviceSelection}
                        helperId={helperId}
                        onDataUpdate={(data) => handleStepDataUpdate({ dateTime: data })}
                        error={errors.dateTime}
                    />
                );

            case 'address':
                return (
                    <AddressSelectionStep
                        initialData={formData.address}
                        onDataUpdate={(data) => handleStepDataUpdate({ address: data })}
                        error={errors.address}
                    />
                );

            case 'confirmation':
                return (
                    <BookingConfirmationStep
                        formData={formData as BookingFormData}
                        helperId={helperId}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                );

            default:
                return null;
        }
    };

    // Calculate estimated price
    const estimatedPrice = formData.serviceSelection?.priceRange.min || 0;

    return (
        <div className={cn('max-w-4xl mx-auto', className)}>
            {/* Progress Steps */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        {stepIds.map((stepId, index) => {
                            const step = steps[stepId];
                            const isLast = index === stepIds.length - 1;

                            return (
                                <React.Fragment key={stepId}>
                                    <div className="flex items-center">
                                        <div
                                            className={cn(
                                                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                                                step.isCompleted
                                                    ? 'bg-primary border-primary text-white'
                                                    : step.isActive
                                                        ? 'border-primary text-primary bg-primary/10'
                                                        : 'border-gray-300 text-gray-400'
                                            )}
                                        >
                                            {step.isCompleted ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <span className="text-sm font-medium">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="ml-3 hidden sm:block">
                                            <p
                                                className={cn(
                                                    'text-sm font-medium',
                                                    step.isActive ? 'text-primary' : 'text-gray-500'
                                                )}
                                            >
                                                {step.title}
                                            </p>
                                            {step.description && (
                                                <p className="text-xs text-gray-400">{step.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    {!isLast && (
                                        <div
                                            className={cn(
                                                'flex-1 h-0.5 mx-4 transition-all',
                                                step.isCompleted ? 'bg-primary' : 'bg-gray-200'
                                            )}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Step Content */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {currentStepId === 'service' && <CreditCard className="w-5 h-5" />}
                                {currentStepId === 'datetime' && <Clock className="w-5 h-5" />}
                                {currentStepId === 'address' && <MapPin className="w-5 h-5" />}
                                {currentStepId === 'confirmation' && <Check className="w-5 h-5" />}
                                {steps[currentStepId].title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderStepContent()}
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Tóm tắt đặt dịch vụ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Service Summary */}
                            {formData.serviceSelection && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Dịch vụ</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            {formData.serviceSelection.serviceName}
                                        </span>
                                        <Badge variant="secondary">
                                            {formData.serviceSelection.category}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* DateTime Summary */}
                            {formData.dateTime && (
                                <>
                                    <Separator />
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Thời gian</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {formData.dateTime.date.toLocaleDateString('vi-VN')}
                                            </div>
                                            {formData.dateTime.startTime && (
                                                <div className="ml-6">
                                                    {formData.dateTime.startTime}
                                                    {formData.dateTime.endTime && ` - ${formData.dateTime.endTime}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Address Summary */}
                            {formData.address && (
                                <>
                                    <Separator />
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Địa chỉ</h4>
                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{formData.address.fullAddress}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Price Estimate */}
                            {estimatedPrice > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Ước tính chi phí</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Dịch vụ</span>
                                            <span className="font-medium">
                                                {estimatedPrice.toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                                            <span>Phí dịch vụ</span>
                                            <span>Miễn phí</span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex items-center justify-between font-medium">
                                            <span>Tổng cộng</span>
                                            <span className="text-primary">
                                                {estimatedPrice.toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Error Display */}
                            {Object.keys(errors).length > 0 && (
                                <>
                                    <Separator />
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-800">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Cần hoàn thiện thông tin</span>
                                        </div>
                                        <ul className="mt-2 text-sm text-red-700 space-y-1">
                                            {Object.values(errors).map((error, index) => (
                                                <li key={index}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Quay lại
                </Button>

                <div className="flex items-center gap-3">
                    {currentStepId !== 'confirmation' ? (
                        <Button
                            onClick={handleNext}
                            disabled={!validateCurrentStep()}
                            className="flex items-center gap-2"
                        >
                            Tiếp tục
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !validateCurrentStep()}
                            className="flex items-center gap-2"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt dịch vụ'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};