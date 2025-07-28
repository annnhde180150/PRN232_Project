'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewForm } from './ReviewForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  helperId: number;
  helperName?: string;
  serviceName?: string;
  onReviewSubmitted: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  helperId,
  helperName,
  serviceName,
  onReviewSubmitted
}: ReviewModalProps) {
  const handleReviewSubmitted = () => {
    onReviewSubmitted();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Đánh giá dịch vụ
          </DialogTitle>
        </DialogHeader>
        <ReviewForm
          bookingId={bookingId}
          helperId={helperId}
          helperName={helperName}
          serviceName={serviceName}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
} 