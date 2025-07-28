import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaymentInfo, updatePaymentStatus, createVnpayPaymentUrl } from '@/lib/payment-api';
import { addMoneyToWallet } from '@/lib/helper-api';
import { toast } from 'react-hot-toast';

interface PaymentHandlerProps {
  userId: number;
  bookingId: number;
  onPaymentStatusChange?: () => void;
}

export const PaymentHandler = ({ userId, bookingId, onPaymentStatusChange }: PaymentHandlerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePayment = async () => {
    try {
      // Get payment information
      console.log('Getting payment info for:', { userId, bookingId });
      const paymentInfo = await getPaymentInfo(userId, bookingId);
      console.log('Full payment info response:', paymentInfo);
      
      if (!paymentInfo.success) {
        toast.error('Failed to get payment information');
        return;
      }

      // Log payment details
      console.log('Payment details:', {
        paymentId: paymentInfo.data.paymentId,
        amount: paymentInfo.data.amount,
        userId: paymentInfo.data.userId,
        helperId: paymentInfo.data.helperId,
        bookingId: paymentInfo.data.bookingId
      });

      // Create VNPAY payment URL
      const returnUrl = `${window.location.origin}/booking-history?paymentId=${paymentInfo.data.paymentId}&helperId=${paymentInfo.data.helperId}&amount=${paymentInfo.data.amount}`;
      console.log('Return URL:', returnUrl);

      const paymentUrl = await createVnpayPaymentUrl(
        paymentInfo.data.amount,
        paymentInfo.data.paymentId,
        returnUrl
      );

      console.log('Final VNPAY URL:', paymentUrl);

      // Redirect to VNPAY
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initialize payment');
    }
  };

  const handleAddMoneyToWallet = async (helperId: number, amount: number) => {
    try {
      console.log('Adding money to helper wallet:', { helperId, amount });
      const addMoneyResult = await addMoneyToWallet(helperId, amount);
      
      if (addMoneyResult.success && addMoneyResult.data.isSuccess) {
        console.log('Successfully added money to wallet:', addMoneyResult);
        toast.success('Money added to helper wallet successfully');
        return true;
      } else {
        console.error('Failed to add money to wallet:', addMoneyResult);
        toast.error('Failed to add money to helper wallet');
        return false;
      }
    } catch (error) {
      console.error('Error adding money to wallet:', error);
      toast.error('Failed to add money to helper wallet');
      return false;
    }
  };

  useEffect(() => {
    // Check if we're returning from VNPAY
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const paymentId = searchParams.get('paymentId');
    const helperId = searchParams.get('helperId');
    const amount = searchParams.get('amount');

    console.log('Return from VNPAY:', {
      vnp_ResponseCode,
      paymentId,
      helperId,
      amount,
      allParams: Object.fromEntries(searchParams.entries())
    });

    if (vnp_ResponseCode && paymentId && helperId && amount) {
      const handlePaymentResponse = async () => {
        try {
          // Update payment status based on VNPAY response
          const status = vnp_ResponseCode === '00' ? 'Success' : 'Cancelled';
          
          console.log('Updating payment status:', {
            paymentId,
            status,
            responseCode: vnp_ResponseCode
          });

          const updateResult = await updatePaymentStatus(Number(paymentId), status);
          console.log('Update payment result:', updateResult);

          if (status === 'Success' && updateResult.success) {
            // Add money to helper's wallet
            await handleAddMoneyToWallet(Number(helperId), Number(amount));
          } else {
            toast.error('Payment failed');
          }

          // Notify parent component about payment status change
          onPaymentStatusChange?.();

          // Redirect back to booking-history page
          router.push('/booking-history');
        } catch (error) {
          console.error('Payment status update error:', error);
          toast.error('Failed to update payment status');
        }
      };

      handlePaymentResponse();
    }
  }, [searchParams, router, onPaymentStatusChange]);

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Pay with VNPAY
    </button>
  );
};