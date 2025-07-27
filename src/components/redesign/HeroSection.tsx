'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  Search, 
  MapPin, 
  Home, 
  ChefHat, 
  Baby, 
  Heart,
  Shield,
  Star,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  popular?: boolean;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'cleaning',
    name: 'Dọn dẹp nhà',
    icon: Home,
    description: 'Vệ sinh, lau chùi, sắp xếp',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    popular: true
  },
  {
    id: 'cooking',
    name: 'Nấu ăn',
    icon: ChefHat,
    description: 'Chuẩn bị bữa ăn gia đình',
    color: 'bg-orange-50 text-orange-600 border-orange-200'
  },
  {
    id: 'childcare',
    name: 'Chăm sóc trẻ',
    icon: Baby,
    description: 'Trông trẻ, đưa đón, học tập',
    color: 'bg-pink-50 text-pink-600 border-pink-200',
    popular: true
  },
  {
    id: 'eldercare',
    name: 'Chăm sóc người già',
    icon: Heart,
    description: 'Đồng hành, chăm sóc sức khỏe',
    color: 'bg-green-50 text-green-600 border-green-200'
  }
];

const trustIndicators = [
  { icon: Users, label: '1,000+ Helpers', description: 'Đã xác thực' },
  { icon: Star, label: '4.8/5 Đánh giá', description: 'Từ khách hàng' },
  { icon: Shield, label: '100% An toàn', description: 'Bảo hiểm toàn diện' },
  { icon: Clock, label: '24/7 Hỗ trợ', description: 'Luôn sẵn sàng' }
];

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Quận 1, TP.HCM');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    params.set('location', location);
    router.push(`/search-helper?${params.toString()}`);
  };

  const handleServiceClick = (serviceId: string) => {
    router.push(`/search-helper?service=${serviceId}&location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          {/* Main Headline */}
          <div className="mb-6">
            <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              <CheckCircle className="w-4 h-4 mr-2" />
              Nền tảng #1 tại Việt Nam
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Tìm Người Giúp Việc
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Uy Tín & Chuyên Nghiệp
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kết nối bạn với những người giúp việc đã được xác thực, 
              có kinh nghiệm và đánh giá cao từ cộng đồng
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
            <Card className={`p-2 transition-all duration-300 ${
              isSearchFocused ? 'ring-4 ring-blue-100 shadow-xl' : 'shadow-lg'
            }`}>
              <div className="flex flex-col md:flex-row gap-2">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Tìm dịch vụ bạn cần..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="pl-12 h-14 text-lg border-0 focus:ring-0 bg-transparent"
                  />
                </div>

                {/* Location Input */}
                <div className="md:w-64 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-12 h-14 text-lg border-0 focus:ring-0 bg-transparent"
                  />
                </div>

                {/* Search Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </Card>
          </form>

          {/* Quick Service Categories */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Dịch vụ phổ biến</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {serviceCategories.map((service) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={service.id}
                    className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${service.color}`}
                    onClick={() => handleServiceClick(service.id)}
                  >
                    {service.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1">
                        Phổ biến
                      </Badge>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className={`p-3 rounded-full ${service.color.replace('text-', 'bg-').replace('border-', 'bg-')}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-semibold text-gray-900 text-lg">{indicator.label}</div>
                  <div className="text-sm text-gray-600">{indicator.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};