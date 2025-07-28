'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer, Section } from '../layout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { getAllServices, searchHelpers, Service } from '../../lib/api';
import {
    Search,
    MapPin,
    Star,
    ArrowRight,
    Sparkles
} from 'lucide-react';

interface CustomerDashboardProps {
    className?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ className }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Load services on component mount
    useEffect(() => {
        const loadServices = async () => {
            try {
                const servicesData = await getAllServices();
                setServices(servicesData);
            } catch (error) {
                console.error('Error loading services:', error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (searchQuery.trim()) {
                router.push(`/search-helper?q=${encodeURIComponent(searchQuery.trim())}`);
            } else {
                router.push(`/search-helper`);
            }
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
                                        <MapPin className="w-4 h-4" />
                                        <span>Vị trí</span>
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
                    </div>
                </PageContainer>
            </Section>
        </div>
    );
};