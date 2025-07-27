'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ServiceSelection } from '@/types/booking';
import {
    Search,
    Home,
    ChefHat,
    Shirt,
    Baby,
    Wrench,
    Car,
    Sparkles,
    Clock,
    Users,
    Check
} from 'lucide-react';

interface ServiceSelectionStepProps {
    initialData?: ServiceSelection;
    onDataUpdate: (data: ServiceSelection) => void;
    error?: string;
}

// Mock services data
const availableServices: ServiceSelection[] = [
    {
        serviceId: 'cleaning',
        serviceName: 'Dọn dẹp nhà',
        category: 'Dọn dẹp',
        icon: <Home className="w-6 h-6" />,
        priceRange: { min: 80000, max: 150000, currency: '₫' },
        duration: 'giờ',
        description: 'Dọn dẹp tổng quát, lau chùi, hút bụi, sắp xếp đồ đạc'
    },
    {
        serviceId: 'deep-cleaning',
        serviceName: 'Dọn dẹp sâu',
        category: 'Dọn dẹp',
        icon: <Sparkles className="w-6 h-6" />,
        priceRange: { min: 120000, max: 200000, currency: '₫' },
        duration: 'giờ',
        description: 'Dọn dẹp chi tiết, vệ sinh sâu các góc khuất, khử trùng'
    },
    {
        serviceId: 'cooking',
        serviceName: 'Nấu ăn',
        category: 'Ẩm thực',
        icon: <ChefHat className="w-6 h-6" />,
        priceRange: { min: 100000, max: 200000, currency: '₫' },
        duration: 'bữa',
        description: 'Nấu các món ăn theo yêu cầu, chuẩn bị nguyên liệu'
    },
    {
        serviceId: 'meal-prep',
        serviceName: 'Chuẩn bị bữa ăn',
        category: 'Ẩm thực',
        icon: <Clock className="w-6 h-6" />,
        priceRange: { min: 150000, max: 300000, currency: '₫' },
        duration: 'ngày',
        description: 'Chuẩn bị và nấu nhiều bữa ăn trong ngày'
    },
    {
        serviceId: 'laundry',
        serviceName: 'Giặt ủi',
        category: 'Giặt ủi',
        icon: <Shirt className="w-6 h-6" />,
        priceRange: { min: 60000, max: 120000, currency: '₫' },
        duration: 'kg',
        description: 'Giặt, phơi, ủi quần áo và đồ vải'
    },
    {
        serviceId: 'childcare',
        serviceName: 'Chăm sóc trẻ em',
        category: 'Chăm sóc',
        icon: <Baby className="w-6 h-6" />,
        priceRange: { min: 120000, max: 250000, currency: '₫' },
        duration: 'giờ',
        description: 'Chăm sóc, vui chơi và giám sát trẻ em'
    },
    {
        serviceId: 'elderly-care',
        serviceName: 'Chăm sóc người già',
        category: 'Chăm sóc',
        icon: <Users className="w-6 h-6" />,
        priceRange: { min: 150000, max: 300000, currency: '₫' },
        duration: 'giờ',
        description: 'Chăm sóc, đồng hành và hỗ trợ người cao tuổi'
    },
    {
        serviceId: 'maintenance',
        serviceName: 'Sửa chữa nhỏ',
        category: 'Bảo trì',
        icon: <Wrench className="w-6 h-6" />,
        priceRange: { min: 100000, max: 200000, currency: '₫' },
        duration: 'việc',
        description: 'Sửa chữa các thiết bị nhỏ, lắp đặt đồ dùng'
    },
    {
        serviceId: 'car-wash',
        serviceName: 'Rửa xe',
        category: 'Xe cộ',
        icon: <Car className="w-6 h-6" />,
        priceRange: { min: 80000, max: 150000, currency: '₫' },
        duration: 'xe',
        description: 'Rửa xe ô tô, xe máy tại nhà'
    }
];

const serviceCategories = [
    'Tất cả',
    'Dọn dẹp',
    'Ẩm thực',
    'Giặt ủi',
    'Chăm sóc',
    'Bảo trì',
    'Xe cộ'
];

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
    initialData,
    onDataUpdate,
    error
}) => {
    const [selectedService, setSelectedService] = useState<ServiceSelection | null>(initialData || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');

    // Filter services based on search and category
    const filteredServices = availableServices.filter(service => {
        const matchesSearch = service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tất cả' || service.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Handle service selection
    const handleServiceSelect = (service: ServiceSelection) => {
        setSelectedService(service);
        onDataUpdate(service);
    };

    // Update parent when initial data changes
    useEffect(() => {
        if (initialData && !selectedService) {
            setSelectedService(initialData);
        }
    }, [initialData, selectedService]);

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {serviceCategories.map((category) => (
                        <Badge
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'secondary'}
                            className={cn(
                                'cursor-pointer transition-all hover:scale-105',
                                selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            )}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => {
                    const isSelected = selectedService?.serviceId === service.serviceId;

                    return (
                        <Card
                            key={service.serviceId}
                            className={cn(
                                'cursor-pointer transition-all hover:shadow-md border-2',
                                isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                            )}
                            onClick={() => handleServiceSelect(service)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'p-2 rounded-lg',
                                            isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                                        )}>
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{service.serviceName}</h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {service.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="p-1 bg-primary rounded-full">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {service.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <span className="font-medium text-primary">
                                            {service.priceRange.min.toLocaleString('vi-VN')} - {service.priceRange.max.toLocaleString('vi-VN')}
                                        </span>
                                        <span className="text-gray-500 ml-1">
                                            {service.priceRange.currency}/{service.duration}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>Theo {service.duration}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* No results */}
            {filteredServices.length === 0 && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không tìm thấy dịch vụ
                    </h3>
                    <p className="text-gray-600">
                        Thử thay đổi từ khóa tìm kiếm hoặc danh mục dịch vụ
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Selected Service Summary */}
            {selectedService && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                {selectedService.icon}
                            </div>
                            <div>
                                <h4 className="font-medium text-green-900">
                                    Đã chọn: {selectedService.serviceName}
                                </h4>
                                <p className="text-sm text-green-700">
                                    {selectedService.priceRange.min.toLocaleString('vi-VN')} - {selectedService.priceRange.max.toLocaleString('vi-VN')} {selectedService.priceRange.currency}/{selectedService.duration}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};