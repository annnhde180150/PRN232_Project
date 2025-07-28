'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { supportApi, bookingApi } from '@/lib/api/service-request';
import { Review, BookingServiceName } from '@/types/service-request';
import { Star, Search } from 'lucide-react';

export function ReviewsView() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookingServices, setBookingServices] = useState<BookingServiceName[]>([]);
    const [loading, setLoading] = useState(false);
    const [helperId, setHelperId] = useState<string>('');

    const loadReviews = async (helperIdToLoad: number) => {
        setLoading(true);
        try {
            const [reviewsRes, servicesRes] = await Promise.all([
                supportApi.getHelperReviews(helperIdToLoad),
                bookingApi.getHelperBookingServiceNames(helperIdToLoad)
            ]);

            if (reviewsRes.success) {
                setReviews(reviewsRes.data);
            } else {
                setReviews([]);
                toast.error(reviewsRes.message || 'Failed to load reviews');
            }

            if (servicesRes.success) {
                setBookingServices(servicesRes.data);
            } else {
                setBookingServices([]);
            }
        } catch (error) {
            toast.error('Failed to load reviews');
            console.error('Error loading reviews:', error);
            setReviews([]);
            setBookingServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const id = parseInt(helperId);
        if (isNaN(id) || id <= 0) {
            toast.error('Please enter a valid helper ID');
            return;
        }
        loadReviews(id);
    };

    const getServiceName = (bookingId: number) => {
        const service = bookingServices.find(s => s.bookingId === bookingId);
        return service?.serviceName || 'Unknown Service';
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ));
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Helper Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Enter Helper ID"
                            value={helperId}
                            onChange={(e) => setHelperId(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            <Search className="w-4 h-4 mr-1" />
                            Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {loading && (
                <Card>
                    <CardContent className="text-center py-8">
                        <p>Loading reviews...</p>
                    </CardContent>
                </Card>
            )}

            {!loading && helperId && reviews.length === 0 && (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500">No reviews found for Helper ID {helperId}</p>
                    </CardContent>
                </Card>
            )}

            {!loading && reviews.length > 0 && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reviews Summary for Helper #{helperId}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold">{averageRating}</div>
                                <div className="flex items-center gap-1">
                                    {renderStars(Math.round(parseFloat(averageRating.toString())))}
                                </div>
                                <div className="text-gray-600">
                                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4">
                        {reviews.map((review) => (
                            <Card key={review.reviewId}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">
                                                Review #{review.reviewId} - {getServiceName(review.bookingId)}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Booking #{review.bookingId} | User #{review.userId}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                            <Badge variant="outline">{review.rating}/5</Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-gray-800">{review.comment}</p>
                                        <p className="text-sm text-gray-500">
                                            <strong>Review Date:</strong> {new Date(review.reviewDate).toLocaleString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}