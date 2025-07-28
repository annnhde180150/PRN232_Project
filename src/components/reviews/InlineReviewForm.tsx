'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface InlineReviewFormProps {
    bookingId: number;
    helperName: string;
    serviceName: string;
    onReviewSubmitted: () => void;
}

export function InlineReviewForm({ bookingId, helperName, serviceName, onReviewSubmitted }: InlineReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }

        setLoading(true);
        try {
            // API call to submit review
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    rating,
                    comment: comment.trim()
                })
            });

            if (response.ok) {
                toast.success('Đánh giá đã được gửi thành công!');
                onReviewSubmitted();
            } else {
                toast.error('Có lỗi xảy ra khi gửi đánh giá');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-4 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                            Đánh giá dịch vụ {serviceName} của {helperName}
                        </h4>

                        {/* Star Rating */}
                        <div className="flex items-center space-x-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`w-6 h-6 ${star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                                {rating > 0 && `${rating}/5 sao`}
                            </span>
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <Textarea
                            placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || rating === 0}
                            size="sm"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onReviewSubmitted}
                        >
                            Bỏ qua
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}