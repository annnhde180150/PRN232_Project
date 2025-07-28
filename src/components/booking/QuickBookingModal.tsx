'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User, Star } from 'lucide-react';
import { BookingForm } from './booking-form';

interface Helper {
    helperId: number;
    helperName: string;
    serviceName: string;
    bio: string;
    rating: number;
    helperWorkAreas: string[];
    basePrice: number;
    availableStatus: string;
    avatar?: string;
    distance?: string;
}

interface QuickBookingModalProps {
    helper: Helper;
    isOpen: boolean;
    onClose: () => void;
    onBookingSuccess: () => void;
}

export function QuickBookingModal({ helper, isOpen, onClose, onBookingSuccess }: QuickBookingModalProps) {
    const [step, setStep] = useState<'preview' | 'form'>('preview');

    const handleBookNow = () => {
        setStep('form');
    };

    const handleBookingComplete = () => {
        onBookingSuccess();
        onClose();
        setStep('preview');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'preview' ? 'Đặt dịch vụ' : 'Thông tin đặt chỗ'}
                    </DialogTitle>
                </DialogHeader>

                {step === 'preview' ? (
                    <div className="space-y-6">
                        {/* Helper Info */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{helper.helperName}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span>{helper.rating}</span>
                                            <span>đánh giá</span>
                                            {helper.distance && (
                                                <>
                                                    <span>•</span>
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{helper.distance}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {helper.helperWorkAreas && helper.helperWorkAreas.map((area: string, index: number) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-600">
                                            {helper.basePrice}đ/giờ
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Info */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <div className="text-sm font-medium">Linh hoạt</div>
                                <div className="text-xs text-gray-600">Lịch trình</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                <div className="text-sm font-medium">2-8 giờ</div>
                                <div className="text-xs text-gray-600">Thời lượng</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <MapPin className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                <div className="text-sm font-medium">Tại nhà</div>
                                <div className="text-xs text-gray-600">Địa điểm</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <Button variant="outline" onClick={onClose} className="flex-1">
                                Hủy
                            </Button>
                            <Button onClick={handleBookNow} className="flex-1">
                                Đặt ngay
                            </Button>
                        </div>
                    </div>
                ) : (
                    <BookingForm
                        helperId={helper.helperId}
                        onSuccess={handleBookingComplete}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}