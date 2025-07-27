'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Heart,
  MessageCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface HelperProfile {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  services: string[];
  bio: string;
  experience: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  distance: string;
  isAvailable: boolean;
  isVerified: boolean;
  responseTime: string;
  completedJobs: number;
  languages?: string[];
  specialties?: string[];
}

interface HelperProfileCardProps {
  helper: HelperProfile;
  onViewProfile?: (helperId: string) => void;
  onBookNow?: (helperId: string) => void;
  onAddToFavorites?: (helperId: string) => void;
  onSendMessage?: (helperId: string) => void;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export const HelperProfileCard: React.FC<HelperProfileCardProps> = ({
  helper,
  onViewProfile,
  onBookNow,
  onAddToFavorites,
  onSendMessage,
  variant = 'default',
  className = ''
}) => {
  const {
    id,
    name,
    avatar,
    rating,
    reviewCount,
    services,
    bio,
    experience,
    priceRange,
    distance,
    isAvailable,
    isVerified,
    responseTime,
    completedJobs,
    specialties = []
  } = helper;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleViewProfile = () => onViewProfile?.(id);
  const handleBookNow = () => onBookNow?.(id);
  const handleAddToFavorites = () => onAddToFavorites?.(id);
  const handleSendMessage = () => onSendMessage?.(id);

  if (variant === 'compact') {
    return (
      <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              <div className="flex items-center space-x-1">
                {renderStars(rating)}
                <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-blue-600">
                {priceRange.currency}{priceRange.min.toLocaleString()}+
              </div>
              <div className="text-xs text-gray-500">{distance}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${
      variant === 'featured' ? 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-white' : ''
    } ${className}`}>
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="relative p-6 pb-4">
          {variant === 'featured' && (
            <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              Nổi bật
            </Badge>
          )}
          
          <div className="flex items-start space-x-4">
            {/* Avatar with Status */}
            <div className="relative">
              <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              {/* Verification Badge */}
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Availability Indicator */}
              <div className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                isAvailable ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900 truncate">{name}</h3>
                {isVerified && (
                  <Shield className="w-5 h-5 text-blue-500" />
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(rating)}
                </div>
                <span className="font-semibold text-gray-900">{rating}</span>
                <span className="text-gray-600">({reviewCount} đánh giá)</span>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{responseTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{completedJobs} việc</span>
                </div>
              </div>
            </div>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToFavorites}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Services Tags */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 3).map((service, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {service}
              </Badge>
            ))}
            {services.length > 3 && (
              <Badge variant="outline" className="text-gray-500">
                +{services.length - 3} khác
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 pb-4">
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
            {bio}
          </p>
        </div>

        {/* Specialties */}
        {specialties.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="font-medium">Chuyên môn:</span>
              <span>{specialties.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Pricing & Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {priceRange.currency}{priceRange.min.toLocaleString()}
                {priceRange.min !== priceRange.max && (
                  <span> - {priceRange.currency}{priceRange.max.toLocaleString()}</span>
                )}
              </div>
              <div className="text-sm text-gray-600">per giờ</div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isAvailable ? 'Có sẵn' : 'Bận'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewProfile}
              className="flex-1 border-gray-300 hover:border-blue-300 hover:text-blue-600"
            >
              Xem hồ sơ
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMessage}
              className="border-gray-300 hover:border-blue-300 hover:text-blue-600"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={handleBookNow}
              disabled={!isAvailable}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {isAvailable ? 'Đặt ngay' : 'Không có sẵn'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};