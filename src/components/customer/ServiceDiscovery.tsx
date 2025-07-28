"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MapPin, Star, Clock, DollarSign, Map, Grid3X3, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelperSearchResult } from '@/types/reports';
import { cn } from '@/lib/utils';

export interface ServiceDiscoveryFilters {
    priceRange: [number, number];
    rating: number;
    distance: number;
    availability: 'all' | 'available' | 'busy';
    sortBy: 'relevance' | 'price' | 'rating' | 'distance';
    showFavoritesOnly: boolean;
}

export interface ServiceDiscoveryProps {
    results: HelperSearchResult[];
    loading: boolean;
    favoriteHelperIds: number[];
    onSearch: (query: string) => void;
    onFilterChange: (filters: ServiceDiscoveryFilters) => void;
    onHelperSelect: (helper: HelperSearchResult) => void;
    onBookHelper: (helperId: number) => void;
    onAddToFavorites: (helperId: number) => void;
    onRemoveFromFavorites: (helperId: number) => void;
}

const DEFAULT_FILTERS: ServiceDiscoveryFilters = {
    priceRange: [0, 1000000],
    rating: 0,
    distance: 50,
    availability: 'all',
    sortBy: 'relevance',
    showFavoritesOnly: false,
};

export function ServiceDiscovery({
    results,
    loading,
    favoriteHelperIds,
    onSearch,
    onFilterChange,
    onHelperSelect,
    onBookHelper,
    onAddToFavorites,
    onRemoveFromFavorites,
}: ServiceDiscoveryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<ServiceDiscoveryFilters>(DEFAULT_FILTERS);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Handle search input changes
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearch(value);
    };

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<ServiceDiscoveryFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    // Filter and sort results based on current filters
    const filteredAndSortedResults = useMemo(() => {
        let filtered = results.filter(helper => {
            // Price filter
            if (helper.basePrice < filters.priceRange[0] || helper.basePrice > filters.priceRange[1]) {
                return false;
            }

            // Rating filter
            if (filters.rating > 0 && (helper.rating || 0) < filters.rating) {
                return false;
            }

            // Availability filter
            if (filters.availability !== 'all') {
                const isAvailable = helper.availableStatus === 'Available';
                if (filters.availability === 'available' && !isAvailable) return false;
                if (filters.availability === 'busy' && isAvailable) return false;
            }

            // Favorites filter
            if (filters.showFavoritesOnly && !favoriteHelperIds.includes(helper.helperId)) {
                return false;
            }

            return true;
        });

        // Sort results
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'price':
                    return a.basePrice - b.basePrice;
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'distance':
                    // For now, we'll use a placeholder distance calculation
                    return 0;
                case 'relevance':
                default:
                    return 0;
            }
        });

        return filtered;
    }, [results, filters, favoriteHelperIds]);

    return (
        <div className="space-y-6">
            {/* Search and View Toggle Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm theo tên, khu vực..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(showFilters && "bg-primary text-white")}
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Bộ lọc
                    </Button>

                    {/* View Mode Toggle */}
                    <div className="flex border rounded-md">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="rounded-r-none"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'map' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('map')}
                            className="rounded-l-none"
                        >
                            <Map className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Bộ lọc tìm kiếm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Khoảng giá</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Từ"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => handleFilterChange({
                                            priceRange: [Number(e.target.value), filters.priceRange[1]]
                                        })}
                                        className="text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <Input
                                        type="number"
                                        placeholder="Đến"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => handleFilterChange({
                                            priceRange: [filters.priceRange[0], Number(e.target.value)]
                                        })}
                                        className="text-sm"
                                    />
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Đánh giá tối thiểu</label>
                                <Select
                                    value={filters.rating.toString()}
                                    onValueChange={(value) => handleFilterChange({ rating: Number(value) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn đánh giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Tất cả</SelectItem>
                                        <SelectItem value="3">3+ sao</SelectItem>
                                        <SelectItem value="4">4+ sao</SelectItem>
                                        <SelectItem value="4.5">4.5+ sao</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Availability Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Trạng thái</label>
                                <Select
                                    value={filters.availability}
                                    onValueChange={(value: 'all' | 'available' | 'busy') =>
                                        handleFilterChange({ availability: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="available">Có sẵn</SelectItem>
                                        <SelectItem value="busy">Bận</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Favorites Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Chỉ hiển thị yêu thích</label>
                                <Select
                                    value={filters.showFavoritesOnly ? 'true' : 'false'}
                                    onValueChange={(value) => handleFilterChange({ showFavoritesOnly: value === 'true' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">Tất cả</SelectItem>
                                        <SelectItem value="true">Chỉ yêu thích</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sắp xếp theo</label>
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value: ServiceDiscoveryFilters['sortBy']) =>
                                        handleFilterChange({ sortBy: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sắp xếp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">Liên quan</SelectItem>
                                        <SelectItem value="price">Giá thấp đến cao</SelectItem>
                                        <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                                        <SelectItem value="distance">Khoảng cách gần nhất</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="mt-4 pt-4 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFilters(DEFAULT_FILTERS);
                                    onFilterChange(DEFAULT_FILTERS);
                                }}
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Tìm thấy {filteredAndSortedResults.length} người giúp việc
                </p>
            </div>

            {/* Results Display */}
            {viewMode === 'grid' ? (
                <HelperGridView
                    helpers={filteredAndSortedResults}
                    loading={loading}
                    onHelperSelect={onHelperSelect}
                    onBookHelper={onBookHelper}
                    onAddToFavorites={onAddToFavorites}
                    onRemoveFromFavorites={onRemoveFromFavorites}
                    favoriteHelperIds={favoriteHelperIds}
                />
            ) : (
                <HelperMapView
                    helpers={filteredAndSortedResults}
                    loading={loading}
                    onHelperSelect={onHelperSelect}
                />
            )}
        </div>
    );
}

// Helper Grid View Component
interface HelperGridViewProps {
    helpers: HelperSearchResult[];
    loading: boolean;
    onHelperSelect: (helper: HelperSearchResult) => void;
    onBookHelper: (helperId: number) => void;
    onAddToFavorites: (helperId: number) => void;
    onRemoveFromFavorites: (helperId: number) => void;
    favoriteHelperIds: number[];
}

function HelperGridView({
    helpers,
    loading,
    onHelperSelect,
    onBookHelper,
    onAddToFavorites,
    onRemoveFromFavorites,
    favoriteHelperIds,
}: HelperGridViewProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                                <div className="flex gap-2">
                                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (helpers.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600">
                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpers.map((helper) => (
                <HelperProfileCard
                    key={helper.helperId}
                    helper={helper}
                    onSelect={() => onHelperSelect(helper)}
                    onBook={() => onBookHelper(helper.helperId)}
                    onAddToFavorites={() => onAddToFavorites(helper.helperId)}
                    onRemoveFromFavorites={() => onRemoveFromFavorites(helper.helperId)}
                    isFavorite={favoriteHelperIds.includes(helper.helperId)}
                />
            ))}
        </div>
    );
}

// Helper Map View Component (Placeholder)
interface HelperMapViewProps {
    helpers: HelperSearchResult[];
    loading: boolean;
    onHelperSelect: (helper: HelperSearchResult) => void;
}

function HelperMapView({ helpers, loading }: HelperMapViewProps) {
    return (
        <Card className="h-96">
            <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Chế độ xem bản đồ
                    </h3>
                    <p className="text-gray-600">
                        Tính năng bản đồ sẽ được triển khai trong phiên bản tiếp theo
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Hiển thị {helpers.length} người giúp việc trên bản đồ
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

// Helper Profile Card Component
interface HelperProfileCardProps {
    helper: HelperSearchResult;
    onSelect: () => void;
    onBook: () => void;
    onAddToFavorites: () => void;
    onRemoveFromFavorites: () => void;
    isFavorite: boolean;
}

function HelperProfileCard({
    helper,
    onSelect,
    onBook,
    onAddToFavorites,
    onRemoveFromFavorites,
    isFavorite,
}: HelperProfileCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1" onClick={onSelect}>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                            {helper.helperName}
                        </h3>
                        <p className="text-sm text-gray-600">{helper.serviceName}</p>
                    </div>
                    <Badge
                        variant={helper.availableStatus === 'Available' ? 'default' : 'secondary'}
                        className={cn(
                            helper.availableStatus === 'Available'
                                ? 'bg-success text-white'
                                : 'bg-gray-100 text-gray-600'
                        )}
                    >
                        {helper.availableStatus === 'Available' ? 'Có sẵn' : 'Bận'}
                    </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">
                            {helper.rating ? helper.rating.toFixed(1) : 'Chưa có đánh giá'}
                        </span>
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-4" onClick={onSelect}>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {helper.bio || 'Chưa có thông tin giới thiệu'}
                    </p>
                </div>

                {/* Work Areas */}
                <div className="mb-4" onClick={onSelect}>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                            {helper.helperWorkAreas.length > 0 ? (
                                <div className="space-y-1">
                                    {helper.helperWorkAreas.slice(0, 2).map((area, index) => (
                                        <div key={area.workAreaId}>
                                            {area.district}, {area.city}
                                        </div>
                                    ))}
                                    {helper.helperWorkAreas.length > 2 && (
                                        <div className="text-xs text-gray-500">
                                            +{helper.helperWorkAreas.length - 2} khu vực khác
                                        </div>
                                    )}
                                </div>
                            ) : (
                                'Chưa có thông tin khu vực'
                            )}
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-4" onClick={onSelect}>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-semibold text-primary">
                            {helper.basePrice.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-sm text-gray-500">/ giờ</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                    <Button
                        onClick={onBook}
                        className="flex-1"
                        disabled={helper.availableStatus !== 'Available'}
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        Đặt ngay
                    </Button>
                    {isFavorite ? (
                        <Button
                            variant="outline"
                            onClick={onRemoveFromFavorites}
                            className="flex-1"
                        >
                            <Star className="h-4 w-4 mr-2 text-red-500" />
                            Bỏ yêu thích
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={onAddToFavorites}
                            className="flex-1"
                        >
                            <Star className="h-4 w-4 mr-2" />
                            Yêu thích
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}