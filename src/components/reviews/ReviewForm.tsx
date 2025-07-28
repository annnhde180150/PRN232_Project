'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { createReview } from '@/lib/review-api';
import { CreateReviewRequest } from '@/types/review';

interface ReviewFormProps {
  bookingId: number;
  helperId: number;
  helperName?: string;
  serviceName?: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

export function ReviewForm({ 
  bookingId, 
  helperId, 
  helperName = 'Helper', 
  serviceName = 'Service',
  onReviewSubmitted,
  onCancel 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nhận xét của bạn');
      return;
    }

    setLoading(true);
    try {
      const reviewData: CreateReviewRequest = {
        bookingId,
        helperId,
        rating,
        comment: comment.trim()
      };

      await createReview(reviewData);
      toast.success('Đánh giá đã được gửi thành công!');
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className="focus:outline-none transition-colors"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
          aria-label={`Rate ${starValue} stars`}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              isFilled 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-lg">
          Đánh giá dịch vụ
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          {serviceName} của {helperName}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Đánh giá của bạn *
          </label>
          <div className="flex justify-center space-x-1">
            {renderStars()}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-gray-600">
              {rating}/5 sao
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Nhận xét của bạn *
          </label>
          <Textarea
            placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right">
            {comment.length}/500 ký tự
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0 || !comment.trim()}
            className="flex-1"
          >
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Hủy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 