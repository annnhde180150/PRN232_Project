'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { DateTimeSelection, ServiceSelection, TimeSlot, AvailableDate } from '@/types/booking';
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    Zap
} from 'lucide-react';

interface DateTimeSelectionStepProps {
    initialData?: DateTimeSelection;
    serviceData?: ServiceSelection;
    helperId?: string;
    onDataUpdate: (data: DateTimeSelection) => void;
    error?: string;
}

// Mock time slots data
const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const isToday = date.toDateString() === new Date().toDateString();
    const currentHour = new Date().getHours();

    for (let hour = 7; hour <= 20; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

        // Skip past time slots for today
        const isAvailable = !isToday || hour > currentHour + 1;

        // Mock some slots as unavailable
        const isUnavailable = Math.random() < 0.2;

        slots.push({
            id: `slot-${hour}`,
            startTime,
            endTime,
            isAvailable: isAvailable && !isUnavailable,
            price: 100000 + (hour - 7) * 5000 // Price varies by time
        });
    }

    return slots;
};

// Generate available dates for the next 30 days
const generateAvailableDates = (): AvailableDate[] => {
    const dates: AvailableDate[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const timeSlots = generateTimeSlots(date);
        const availableSlots = timeSlots.filter(slot => slot.isAvailable);

        dates.push({
            date,
            timeSlots,
            isFullyBooked: availableSlots.length === 0
        });
    }

    return dates;
};

const popularTimeSlots = [
    { label: 'Sáng sớm', time: '07:00', description: '7:00 - 11:00' },
    { label: 'Buổi trưa', time: '13:00', description: '13:00 - 17:00' },
    { label: 'Buổi tối', time: '18:00', description: '18:00 - 20:00' }
];

export const DateTimeSelectionStep: React.FC<DateTimeSelectionStepProps> = ({
    initialData,
    serviceData,
    helperId,
    onDataUpdate,
    error
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialData?.date || null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
    const [isFlexible, setIsFlexible] = useState(initialData?.isFlexible || false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availableDates] = useState<AvailableDate[]>(generateAvailableDates());

    // Get available dates for current month
    const getMonthDates = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const dates: (Date | null)[] = [];
        const current = new Date(startDate);

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            if (current.getMonth() === month) {
                dates.push(new Date(current));
            } else {
                dates.push(null);
            }
            current.setDate(current.getDate() + 1);
        }

        return dates;
    };

    // Get time slots for selected date
    const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
        const availableDate = availableDates.find(
            d => d.date.toDateString() === date.toDateString()
        );
        return availableDate?.timeSlots || [];
    };

    // Handle date selection
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
        updateFormData(date, null, isFlexible);
    };

    // Handle time slot selection
    const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
        setSelectedTimeSlot(timeSlot);
        updateFormData(selectedDate!, timeSlot, isFlexible);
    };

    // Handle flexibility toggle
    const handleFlexibilityToggle = () => {
        const newFlexible = !isFlexible;
        setIsFlexible(newFlexible);
        updateFormData(selectedDate!, selectedTimeSlot, newFlexible);
    };

    // Update form data
    const updateFormData = (date: Date | null, timeSlot: TimeSlot | null, flexible: boolean) => {
        if (!date) return;

        const dateTimeData: DateTimeSelection = {
            date,
            startTime: timeSlot?.startTime || '',
            endTime: timeSlot?.endTime,
            duration: timeSlot ? 1 : undefined,
            isFlexible: flexible,
            preferredTimeSlots: flexible ? popularTimeSlots.map(slot => slot.time) : undefined
        };

        onDataUpdate(dateTimeData);
    };

    // Initialize with initial data
    useEffect(() => {
        if (initialData && !selectedDate) {
            setSelectedDate(initialData.date);
            if (initialData.startTime) {
                const timeSlots = getTimeSlotsForDate(initialData.date);
                const timeSlot = timeSlots.find(slot => slot.startTime === initialData.startTime);
                if (timeSlot) {
                    setSelectedTimeSlot(timeSlot);
                }
            }
            setIsFlexible(initialData.isFlexible);
        }
    }, [initialData]);

    const monthDates = getMonthDates();
    const selectedDateSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];
    const availableSlots = selectedDateSlots.filter(slot => slot.isAvailable);

    return (
        <div className="space-y-6">
            {/* Service Info */}
            {serviceData && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                {serviceData.icon}
                            </div>
                            <div>
                                <h4 className="font-medium text-blue-900">
                                    {serviceData.serviceName}
                                </h4>
                                <p className="text-sm text-blue-700">
                                    Thời gian ước tính: 1-3 {serviceData.duration}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Flexibility Option */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-orange-500" />
                            <div>
                                <h4 className="font-medium text-gray-900">Thời gian linh hoạt</h4>
                                <p className="text-sm text-gray-600">
                                    Cho phép người giúp việc đề xuất thời gian phù hợp
                                </p>
                            </div>
                        </div>
                        <Button
                            variant={isFlexible ? 'default' : 'outline'}
                            size="sm"
                            onClick={handleFlexibilityToggle}
                        >
                            {isFlexible ? 'Đã bật' : 'Bật'}
                        </Button>
                    </div>

                    {isFlexible && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2 text-orange-800 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Khung giờ ưu tiên</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {popularTimeSlots.map((slot) => (
                                    <Badge key={slot.time} variant="secondary" className="bg-orange-100 text-orange-800">
                                        {slot.label} ({slot.description})
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {!isFlexible && (
                <>
                    {/* Calendar */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Chọn ngày
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const prev = new Date(currentMonth);
                                            prev.setMonth(prev.getMonth() - 1);
                                            setCurrentMonth(prev);
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm font-medium min-w-[120px] text-center">
                                        {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const next = new Date(currentMonth);
                                            next.setMonth(next.getMonth() + 1);
                                            setCurrentMonth(next);
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-4">
                                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {monthDates.map((date, index) => {
                                    if (!date) {
                                        return <div key={index} className="p-2" />;
                                    }

                                    const isToday = date.toDateString() === new Date().toDateString();
                                    const isPast = date < new Date() && !isToday;
                                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                                    const availableDate = availableDates.find(
                                        d => d.date.toDateString() === date.toDateString()
                                    );
                                    const isFullyBooked = availableDate?.isFullyBooked || false;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => !isPast && !isFullyBooked && handleDateSelect(date)}
                                            disabled={isPast || isFullyBooked}
                                            className={cn(
                                                'p-2 text-sm rounded-lg transition-all hover:bg-gray-100',
                                                isSelected && 'bg-primary text-white hover:bg-primary/90',
                                                isToday && !isSelected && 'bg-blue-50 text-blue-600 font-medium',
                                                isPast && 'text-gray-300 cursor-not-allowed',
                                                isFullyBooked && !isPast && 'text-red-400 cursor-not-allowed',
                                                !isPast && !isFullyBooked && !isSelected && 'hover:bg-gray-100'
                                            )}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-100 rounded"></div>
                                    <span>Hôm nay</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-primary rounded"></div>
                                    <span>Đã chọn</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-100 rounded"></div>
                                    <span>Hết chỗ</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Time Slots */}
                    {selectedDate && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Chọn giờ - {selectedDate.toLocaleDateString('vi-VN')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {selectedDateSlots.map((slot) => {
                                            const isSelected = selectedTimeSlot?.id === slot.id;
                                            const isAvailable = slot.isAvailable;

                                            return (
                                                <button
                                                    key={slot.id}
                                                    onClick={() => isAvailable && handleTimeSlotSelect(slot)}
                                                    disabled={!isAvailable}
                                                    className={cn(
                                                        'p-3 rounded-lg border-2 transition-all text-left',
                                                        isSelected
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : isAvailable
                                                                ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                    )}
                                                >
                                                    <div className="font-medium text-sm">
                                                        {slot.startTime} - {slot.endTime}
                                                    </div>
                                                    {slot.price && isAvailable && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {slot.price.toLocaleString('vi-VN')}₫
                                                        </div>
                                                    )}
                                                    {!isAvailable && (
                                                        <div className="text-xs text-red-500 mt-1">
                                                            Không có sẵn
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-6 h-6 text-red-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Không có khung giờ trống
                                        </h3>
                                        <p className="text-gray-600">
                                            Vui lòng chọn ngày khác hoặc bật tùy chọn thời gian linh hoạt
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Selection Summary */}
            {(selectedDate || isFlexible) && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-green-900">
                                    {isFlexible ? 'Thời gian linh hoạt' : 'Đã chọn thời gian'}
                                </h4>
                                <p className="text-sm text-green-700">
                                    {isFlexible
                                        ? 'Người giúp việc sẽ đề xuất thời gian phù hợp'
                                        : selectedDate && selectedTimeSlot
                                            ? `${selectedDate.toLocaleDateString('vi-VN')} lúc ${selectedTimeSlot.startTime}`
                                            : selectedDate
                                                ? `${selectedDate.toLocaleDateString('vi-VN')} - Chưa chọn giờ`
                                                : ''
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};