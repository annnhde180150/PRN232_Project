'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer, Section } from '../layout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { HelperCard } from '../design-system/HelperCard';
import { ServiceCard } from '../design-system/ServiceCard';
import { cn } from '../../lib/utils';
import {
    Search,
    MapPin,
    Filter,
    Home,
    ChefHat,
    Shirt,
    Baby,
    Star,
    Clock,
    ArrowRight,
    Sparkles
} from 'lucide-react';

// Mock data for services
const quickServices = [
    {
        id: 'cleaning',
        name: 'Dọn dẹp nhà',
        icon: <Home className="w-6 h-6" />,
        priceRange: { min: 80000, max: 150000, currency: '₫' },
        duration: 'giờ',
        isPopular: true,
        availableHelpers: 45,
        category: 'Dọn dẹp'
    },
    {
        id: 'cooking',
        name: 'Nấu ăn',
        icon: <ChefHat className="w-6 h-6" />,
        priceRange: { min: 100000, max: 200000, currency: '₫' },
        duration: 'bữa',
        availableHelpers: 32,
        category: 'Ẩm thực'
    },
    {
        id: 'laundry',
        name: 'Giặt ủi',
        icon: <Shirt className="w-6 h-6" />,
        priceRange: { min: 60000, max: 120000, currency: '₫' },
        duration: 'kg',
        availableHelpers: 28,
        category: 'Giặt ủi'
    },
    {
        id: 'childcare',
        name: 'Chăm sóc trẻ',
        icon: <Baby className="w-6 h-6" />,
        priceRange: { min: 120000, max: 250000, currency: '₫' },
        duration: 'giờ',
        isPopular: true,
        availableHelpers: 18,
        category: 'Chăm sóc'
    }
];

// Mock data for nearby helpers
const nearbyHelpers = [
    {
        id: 'helper-1',
        name: 'Nguyễn Thị Mai',
        avatar: undefined,
        rating: 4.8,
        reviewCount: 127,
        services: ['Dọn dẹp', 'Nấu ăn', 'Giặt ủi'],
        priceRange: { min: 80000, max: 150000, currency: '₫' },
        distance: '0.8 km',
        isAvailable: true,
        isVerified: true
    },
    {
        id: 'helper-2',
        name: 'Trần Văn Hùng',
        avatar: undefined,
        rating: 4.9,
        reviewCount: 89,
        services: ['Chăm sóc trẻ', 'Dọn dẹp'],
        priceRange: { min: 120000, max: 200000, currency: '₫' },
        distance: '1.2 km',
        isAvailable: true,
        isVerified: true
    },
    {
        id: 'helper-3',
        name: 'Lê Thị Hoa',
        avatar: undefined,
        rating: 4.7,
        reviewCount: 156,
        services: ['Nấu ăn', 'Giặt ủi', 'Dọn dẹp'],
        priceRange: { min: 90000, max: 180000, currency: '₫' },
        distance: '1.5 km',
        isAvailable: false,
        isVerified: true
    },
    {
        id: 'helper-4',
        name: 'Phạm Minh Tuấn',
        avatar: undefined,
        rating: 4.6,
        reviewCount: 73,
        services: ['Dọn dẹp', 'Bảo trì'],
        priceRange: { min: 100000, max: 160000, currency: '₫' },
        distance: '2.1 km',
        isAvailable: true,
        isVerified: false
    }
];

// Mock data for recent orders
const recentOrders = [
    {
        id: 'order-1',
        service: 'Dọn dẹp nhà',
        helper: 'Nguyễn Thị Mai',
        status: 'completed',
        date: '2024-01-15',
        rating: 5
    },
    {
        id: 'order-2',
        service: 'Nấu ăn',
        helper: 'Trần Văn Hùng',
        status: 'in_progress',
        date: '2024-01-20',
        rating: null
    }
];

interface CustomerDashboardProps {
    className?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ className }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (searchQuery.trim()) {
                router.push(`/search-helper?q=${encodeURIComponent(searchQuery.trim())}}`);
            } else {
                router.push(`/search-helper}`);
            }
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // Handle service card click
    const handleServiceClick = (serviceId: string) => {
        try {
            router.push(`/search-helper?service=${serviceId}}`);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // Handle helper card click
    const handleHelperClick = (helperId: string) => {
        try {
            router.push(`/helper/${helperId}`);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // Handle helper booking
    const handleHelperBook = (helperId: string) => {
        try {
            router.push(`/booking?helper=${helperId}`);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // Handle location change
    const handleLocationClick = () => {
        // In a real app, this would open a location picker modal
        console.log('Open location picker');
    };

    return (
        <div className={cn('bg-gray-50 min-h-screen', className)}>
            {/* Hero Search Section */}
            <Section background="white" padding="lg" className="border-b border-gray-100">
                <PageContainer>
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Welcome message */}
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Chào mừng trở lại! 👋
                            </h1>
                            <p className="text-gray-600">
                                Tìm kiếm người giúp việc phù hợp với nhu cầu của bạn
                            </p>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className={cn(
                                'relative flex items-center bg-white border-2 rounded-xl shadow-sm transition-all duration-200',
                                isSearchFocused ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-gray-300'
                            )}>
                                <div className="flex items-center flex-1">
                                    <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm dịch vụ hoặc người giúp việc..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        className="pl-12 pr-4 py-4 text-base border-0 focus:ring-0 bg-transparent"
                                    />
                                </div>

                                {/* Location selector */}
                                <div className="flex items-center border-l border-gray-200 px-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLocationClick}
                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                                    >
                                    </Button>
                                </div>

                                {/* Search button */}
                                <Button
                                    type="submit"
                                    className="m-2 px-6 py-2 rounded-lg"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    Tìm kiếm
                                </Button>
                            </div>
                        </form>
                    </div>
                </PageContainer>
            </Section>

            {/* Quick Actions - Service Buttons Grid */}
            <Section padding="lg">
                <PageContainer>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Dịch vụ phổ biến
                                </h2>
                                <p className="text-gray-600">
                                    Các dịch vụ được yêu cầu nhiều nhất
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/search-helper')}
                                className="flex items-center gap-2 text-primary hover:text-primary-dark"
                            >
                                Xem tất cả
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickServices.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    onClick={handleServiceClick}
                                    compact
                                    className="h-full"
                                />
                            ))}
                        </div>
                    </div>
                </PageContainer>
            </Section>

            {/* Nearby Helpers Section */}
            <Section background="white" padding="lg">
                <PageContainer>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Gần bạn
                                </h2>
                                <p className="text-gray-600">
                                    Những người giúp việc uy tín trong khu vực của bạn
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/search-helper?nearby=true')}
                                className="flex items-center gap-2 text-primary hover:text-primary-dark"
                            >
                                Xem thêm
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {nearbyHelpers.map((helper) => (
                                <HelperCard
                                    key={helper.id}
                                    helper={helper}
                                    onClick={handleHelperClick}
                                    onBook={handleHelperBook}
                                    className="h-full"
                                />
                            ))}
                        </div>
                    </div>
                </PageContainer>
            </Section>

            {/* Recent Orders Section */}
            {recentOrders.length > 0 && (
                <Section padding="lg">
                    <PageContainer>
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                        Đơn hàng gần đây
                                    </h2>
                                    <p className="text-gray-600">
                                        Theo dõi trạng thái và đánh giá dịch vụ
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/customer-reports')}
                                    className="flex items-center gap-2 text-primary hover:text-primary-dark"
                                >
                                    Xem tất cả
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentOrders.map((order) => (
                                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{order.service}</h3>
                                                    <p className="text-sm text-gray-600">với {order.helper}</p>
                                                </div>
                                                <Badge
                                                    variant={order.status === 'completed' ? 'default' : 'secondary'}
                                                    className={cn(
                                                        order.status === 'completed' && 'bg-green-100 text-green-800',
                                                        order.status === 'in_progress' && 'bg-blue-100 text-blue-800'
                                                    )}
                                                >
                                                    {order.status === 'completed' ? 'Hoàn thành' : 'Đang thực hiện'}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(order.date).toLocaleDateString('vi-VN')}
                                                </span>

                                                {order.rating ? (
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: 5 }, (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={cn(
                                                                    'w-4 h-4',
                                                                    i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Button size="sm" variant="outline">
                                                        Đánh giá
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </PageContainer>
                </Section>
            )}
        </div>
    );
};