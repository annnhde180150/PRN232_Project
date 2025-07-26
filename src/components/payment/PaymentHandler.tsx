import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaymentInfo, updatePaymentStatus, createVnpayPaymentUrl } from '@/lib/payment-api';
import { toast } from 'react-hot-toast';

interface PaymentHandlerProps {
  userId: number;
  bookingId: number;
}

export const PaymentHandler = ({ userId, bookingId }: PaymentHandlerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePayment = async () => {
    try {
      // Get payment information
      const paymentInfo = await getPaymentInfo(userId, bookingId);
      
      if (!paymentInfo.success) {
        toast.error('Failed to get payment information');
        return;
      }

      // Create VNPAY payment URL
      const returnUrl = `${window.location.origin}/dashboard?paymentId=${paymentInfo.data.paymentId}`;
      const paymentUrl = await createVnpayPaymentUrl(
        paymentInfo.data.amount,
        paymentInfo.data.paymentId,
        returnUrl
      );

      // Redirect to VNPAY
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed to initialize');
    }
  };

  useEffect(() => {
    // Check if we're returning from VNPAY
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const paymentId = searchParams.get('paymentId');

    if (vnp_ResponseCode && paymentId) {
      const handlePaymentResponse = async () => {
        try {
          // Update payment status based on VNPAY response
          const status = vnp_ResponseCode === '00' ? 'Success' : 'Cancelled';
          await updatePaymentStatus(Number(paymentId), status);

          if (status === 'Success') {
            toast.success('Payment successful');
          } else {
            toast.error('Payment failed');
          }

          // Redirect to dashboard
          router.push('/dashboard');
        } catch (error) {
          console.error('Payment status update error:', error);
          toast.error('Failed to update payment status');
        }
      };

      handlePaymentResponse();
    }
  }, [searchParams, router]);

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Pay with VNPAY
    </button>
  );
}; 