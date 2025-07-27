'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Star,
  AlertCircle
} from 'lucide-react';

interface BookingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface HelperInfo {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  services: string[];
  responseTime: string;
}

interface BookingDetails {
  service: string;
  date: string;
  time: string;
  duration: number;
  address: string;
  notes: string;
  totalAmount: number;
}

interface BookingFlowProps {
  helper: HelperInfo;
  onComplete: (bookingDetails: BookingDetails) => void;
  onCancel: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  helper,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingDetails>>({
    service: '',
    date: '',
    time: '',
    duration: 2,
    address: '',
    notes: '',
    totalAmount: 0
  });

  const steps: BookingStep[] = [
    {
      id: 1,
      title: 'Chọn dịch vụ',
      description: 'Chọn loại dịch vụ bạn cần',
      completed: currentStep > 1,
      active: currentStep === 1
    },
    {
      id: 2,
      title: 'Thời gian & địa điểm',
      description: 'Chọn thời gian và địa chỉ',
      completed: currentStep > 2,
      active: currentStep === 2
    },
    {
      id: 3,
      title: 'Xác nhận & thanh toán',
      description: 'Xem lại và thanh toán',
      completed: currentStep > 3,
      active: currentStep === 3
    }
  ];

  const calculateTotal = () => {
    const duration = bookingData.duration || 2;
    const baseAmount = helper.pricePerHour * duration;
    const serviceFee = baseAmount * 0.1; // 10% service fee
    return baseAmount + serviceFee;
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete booking
      const total = calculateTotal();
      onComplete({
        ...bookingData,
        totalAmount: total
      } as BookingDetails);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateBookingData = (field: keyof BookingDetails, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step.completed 
                ? 'bg-green-500 text-white' 
                : step.active 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${
                step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500 max-w-24">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-px mx-4 ${
              step.completed ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn dịch vụ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {helper.services.map((service) => (
            <Card
              key={service}
              className={`cursor-pointer transition-all duration-200 ${
                bookingData.service === service
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => updateBookingData('service', service)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{service}</span>
                  <span className="text-blue-600 font-semibold">
                    {helper.pricePerHour.toLocaleString()}đ/giờ
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thời gian dự kiến (giờ)
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 6, 8].map((hours) => (
            <Button
              key={hours}
              variant={bookingData.duration === hours ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateBookingData('duration', hours)}
            >
              {hours}h
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Ngày làm việc
          </label>
          <Input
            type="date"
            value={bookingData.date}
            onChange={(e) => updateBookingData('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Giờ bắt đầu
          </label>
          <Input
            type="time"
            value={bookingData.time}
            onChange={(e) => updateBookingData('time', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Địa chỉ làm việc
        </label>
        <Input
          type="text"
          placeholder="Nhập địa chỉ chi tiết..."
          value={bookingData.address}
          onChange={(e) => updateBookingData('address', e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ghi chú đặc biệt (tùy chọn)
        </label>
        <textarea
          placeholder="Mô tả thêm về công việc, yêu cầu đặc biệt..."
          value={bookingData.notes}
          onChange={(e) => updateBookingData('notes', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep3 = () => {
    const total = calculateTotal();
    const serviceFee = total - (helper.pricePerHour * (bookingData.duration || 2));

    return (
      <div className="space-y-6">
        {/* Booking Summary */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Tóm tắt đặt lịch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Dịch vụ:</span>
              <span className="font-medium">{bookingData.service}</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian:</span>
              <span className="font-medium">
                {bookingData.date} lúc {bookingData.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Thời lượng:</span>
              <span className="font-medium">{bookingData.duration} giờ</span>
            </div>
            <div className="flex justify-between">
              <span>Địa chỉ:</span>
              <span className="font-medium text-right max-w-48">{bookingData.address}</span>
            </div>
            {bookingData.notes && (
              <div className="flex justify-between">
                <span>Ghi chú:</span>
                <span className="font-medium text-right max-w-48">{bookingData.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chi tiết thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Dịch vụ ({bookingData.duration}h × {helper.pricePerHour.toLocaleString()}đ)</span>
              <span>{(helper.pricePerHour * (bookingData.duration || 2)).toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí dịch vụ (10%)</span>
              <span>{serviceFee.toLocaleString()}đ</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{total.toLocaleString()}đ</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center p-3 border border-blue-200 rounded-lg bg-blue-50">
                <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-blue-900">Thanh toán trực tuyến</div>
                  <div className="text-sm text-blue-700">Visa, Mastercard, ATM nội địa</div>
                </div>
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900 mb-1">Đảm bảo an toàn</div>
                <div className="text-sm text-green-800">
                  Thanh toán được bảo vệ. Tiền chỉ được chuyển cho helper sau khi hoàn thành công việc.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.service && bookingData.duration;
      case 2:
        return bookingData.date && bookingData.time && bookingData.address;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Helper Info Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={helper.avatar} alt={helper.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {helper.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{helper.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{helper.rating}</span>
                  <span className="text-gray-600">({helper.reviewCount})</span>
                </div>
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {helper.responseTime}
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Nhắn tin</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Hủy
            </Button>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <span>
            {currentStep === 3 ? 'Xác nhận đặt lịch' : 'Tiếp tục'}
          </span>
          {currentStep < 3 && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Price Preview */}
      {currentStep < 3 && bookingData.duration && (
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-900 font-medium">Tổng ước tính:</span>
              <span className="text-xl font-bold text-blue-600">
                {calculateTotal().toLocaleString()}đ
              </span>
            </div>
            <div className="text-sm text-blue-700 mt-1">
              Bao gồm phí dịch vụ và thuế
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};