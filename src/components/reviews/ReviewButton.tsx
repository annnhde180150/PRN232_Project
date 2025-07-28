'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { ReviewModal } from './ReviewModal';
import { getReviewByBookingId } from '@/lib/review-api';
import { Review } from '@/types/review';
import { getPaymentStatusForBooking } from '@/lib/payment-api';
import { PaymentStatus } from '@/types/payment';
import { BookingStatus } from '@/types/bookings';

interface ReviewButtonProps {
  bookingId: number;
  helperId: number;
  userId: number;
  bookingStatus: BookingStatus;
  helperName?: string;
  serviceName?: string;
  onReviewSubmitted?: () => void;
}

export function ReviewButton({
  bookingId,
  helperId,
  userId,
  bookingStatus,
  helperName,
  serviceName,
  onReviewSubmitted
}: ReviewButtonProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      try {
        // Check payment status
        const paymentStatus = await getPaymentStatusForBooking(userId, bookingId);
        setPaymentStatus(paymentStatus);

        // Check if review already exists
        const review = await getReviewByBookingId(bookingId);
        setExistingReview(review);
      } catch (error) {
        console.error('Error checking review eligibility:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingStatus === 'Completed') {
      checkReviewEligibility();
    } else {
      setLoading(false);
    }
  }, [bookingId, userId, bookingStatus]);

  // Show review button only if:
  // 1. Booking status is 'Completed'
  // 2. Payment status is 'Success'
  // 3. No existing review
  // 4. Not loading
  const canReview = 
    !loading && 
    bookingStatus === 'Completed' && 
    paymentStatus === 'Success' && 
    !existingReview;

  if (!canReview) {
    return null;
  }

  const handleReviewSubmitted = () => {
    setExistingReview({} as Review); // Mark as reviewed
    onReviewSubmitted?.();
  };

  return (
    <>
      <Button
        onClick={() => setShowReviewModal(true)}
        size="sm"
        className="flex items-center space-x-2"
      >
        <Star className="w-4 h-4" />
        <span>Đánh giá</span>
      </Button>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        bookingId={bookingId}
        helperId={helperId}
        helperName={helperName}
        serviceName={serviceName}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
} 