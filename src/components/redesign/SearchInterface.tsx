'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import {
  Search,
  Filter,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Grid3X3,
  Map,
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react';

interface SearchFilters {
  priceRange: [number, number];
  rating: number;
  distance: number;
  availability: 'all' | 'available' | 'busy';
  services: string[];
  experience: number;
  verified: boolean;
}

interface SearchInterfaceProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onViewModeChange: (mode: 'grid' | 'map') => void;
  viewMode: 'grid' | 'map';
  resultCount?: number;
  loading?: boolean;
}

const serviceOptions = [
  'Dọn dẹp nhà',
  'Nấu ăn',
  'Chăm sóc trẻ em',
  'Chăm sóc người già',
  'Giặt ủi',
  'Mua sắm',
  'Làm vườn',
  'Sửa chữa nhỏ'
];

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  onViewModeChange,
  viewMode,
  resultCount = 0,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [50000, 300000],
    rating: 0,
    distance: 10,
    availability: 'all',
    services: [],
    experience: 0,
    verified: false
  });

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    handleFilterChange('services', newServices);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      priceRange: [50000, 300000],
      rating: 0,
      distance: 10,
      availability: 'all',
      services: [],
      experience: 0,
      verified: false
    };
    setFilters(defaultFilters);
    onSearch(searchQuery, defaultFilters);
  };

  const activeFilterCount = [
    filters.rating > 0,
    filters.availability !== 'all',
    filters.services.length > 0,
    filters.experience > 0,
    filters.verified,
    filters.priceRange[0] > 50000 || filters.priceRange[1] < 300000,
    filters.distance < 10
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, dịch vụ, khu vực..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-4 border-gray-200 ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Bộ lọc
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-blue-500 text-white text-xs px-2 py-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-none h-12 px-4"
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('map')}
                className="rounded-none h-12 px-4"
              >
                <Map className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="shadow-lg border-0 animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
              <div className="flex items-center space-x-2">
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Xóa tất cả
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Khoảng giá (VNĐ/giờ)
                </label>
                <div className="px-3">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={500000}
                    min={30000}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{filters.priceRange[0].toLocaleString()}đ</span>
                    <span>{filters.priceRange[1].toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Đánh giá tối thiểu
                </label>
                <div className="flex space-x-2">
                  {[0, 3, 4, 4.5, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.rating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('rating', rating)}
                      className="flex items-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>{rating === 0 ? 'Tất cả' : `${rating}+`}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Khoảng cách (km)
                </label>
                <div className="px-3">
                  <Slider
                    value={[filters.distance]}
                    onValueChange={(value) => handleFilterChange('distance', value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-2">
                    Trong vòng {filters.distance} km
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Tình trạng
                </label>
                <div className="flex space-x-2">
                  {[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'available', label: 'Có sẵn' },
                    { value: 'busy', label: 'Bận' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.availability === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('availability', option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Kinh nghiệm tối thiểu (năm)
                </label>
                <div className="flex space-x-2">
                  {[0, 1, 2, 3, 5].map((years) => (
                    <Button
                      key={years}
                      variant={filters.experience === years ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange('experience', years)}
                    >
                      {years === 0 ? 'Tất cả' : `${years}+ năm`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Verified Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Xác thực
                </label>
                <Button
                  variant={filters.verified ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('verified', !filters.verified)}
                  className="w-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Chỉ hiển thị đã xác thực
                </Button>
              </div>
            </div>

            {/* Services Filter */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Loại dịch vụ
              </label>
              <div className="flex flex-wrap gap-2">
                {serviceOptions.map((service) => (
                  <Badge
                    key={service}
                    variant={filters.services.includes(service) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all duration-200 ${
                      filters.services.includes(service)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'hover:bg-blue-50 hover:border-blue-300'
                    }`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    {service}
                    {filters.services.includes(service) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {loading ? (
            <span>Đang tìm kiếm...</span>
          ) : (
            <span>Tìm thấy {resultCount.toLocaleString()} kết quả</span>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <div className="flex items-center space-x-2">
            <span>Đã áp dụng {activeFilterCount} bộ lọc</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800"
            >
              Xóa tất cả
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};