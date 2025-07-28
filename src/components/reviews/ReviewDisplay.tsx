'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Review } from '@/types/review';

interface ReviewDisplayProps {
  review: Review;
  helperName?: string;
  serviceName?: string;
}

export function ReviewDisplay({ review, helperName, serviceName }: ReviewDisplayProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm text-green-800">
              Đánh giá đã gửi
            </CardTitle>
            <p className="text-xs text-green-600 mt-1">
              {serviceName} của {helperName}
            </p>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {review.rating}/5
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Star Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {review.rating} sao
          </span>
        </div>

        {/* Comment */}
        <div>
          <p className="text-sm text-gray-800 leading-relaxed">
            {review.comment}
          </p>
        </div>

        {/* Review Date */}
        <div className="text-xs text-gray-500">
          Đánh giá vào: {formatDate(review.reviewDate)}
        </div>
      </CardContent>
    </Card>
  );
} 