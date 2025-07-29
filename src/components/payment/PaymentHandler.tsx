import { useEffect, useRef, useState } from 'react';
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
  const hasProcessedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleAddMoneyToWallet = async (helperId: number, amount: number, paymentId: string) => {
    try {
      // Multiple layers of protection
      const storageKey = `wallet_added_${paymentId}`;
      
      // Check sessionStorage first
      if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) {
        console.log('Payment already processed (sessionStorage):', paymentId);
        return true;
      }

      console.log('Adding money to helper wallet:', { helperId, amount, paymentId });
      const addMoneyResult = await addMoneyToWallet(helperId, amount);
      
      if (addMoneyResult.success && addMoneyResult.data.isSuccess) {
        // Mark as processed in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(storageKey, 'true');
        }
        console.log('Successfully added money to wallet:', addMoneyResult);
        toast.success('Payment successfully');
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
    // Prevent multiple executions
    if (hasProcessedRef.current || isProcessing) {
      console.log('Already processed or processing');
      return;
    }

    const processPayment = async () => {
      // Check if we're returning from VNPAY
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const paymentId = searchParams.get('paymentId');
      const helperId = searchParams.get('helperId');
      const amount = searchParams.get('amount');
      const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');

      console.log('Return from VNPAY:', {
        vnp_ResponseCode,
        paymentId,
        helperId,
        amount,
        vnp_TransactionNo,
        allParams: Object.fromEntries(searchParams.entries())
      });

      if (!vnp_ResponseCode || !paymentId || !helperId || !amount) {
        console.log('Missing required parameters');
        return;
      }

      // Mark as processing immediately
      hasProcessedRef.current = true;
      setIsProcessing(true);

      // Create a unique identifier for this payment
      const paymentIdentifier = `${paymentId}_${vnp_TransactionNo || Date.now()}`;

      // Additional check with sessionStorage
      const processKey = `payment_processed_${paymentIdentifier}`;
      if (typeof window !== 'undefined' && sessionStorage.getItem(processKey)) {
        console.log('Payment already fully processed:', paymentIdentifier);
        setIsProcessing(false);
        return;
      }

      try {
        // Mark this payment as being processed
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(processKey, 'processing');
        }

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
          const walletResult = await handleAddMoneyToWallet(Number(helperId), Number(amount), paymentIdentifier);
          
          if (walletResult) {
            // Mark as fully processed
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(processKey, 'completed');
            }
          }
        } else if (status !== 'Success') {
          toast.error('Payment failed');
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(processKey, 'failed');
          }
        }

        // Notify parent component about payment status change
        onPaymentStatusChange?.();

        // Clean up URL parameters
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('vnp_ResponseCode');
        currentUrl.searchParams.delete('paymentId');
        currentUrl.searchParams.delete('helperId');
        currentUrl.searchParams.delete('amount');
        currentUrl.searchParams.delete('vnp_TransactionNo');
        currentUrl.searchParams.delete('vnp_TxnRef');
        currentUrl.searchParams.delete('vnp_Amount');
        currentUrl.searchParams.delete('vnp_BankCode');
        currentUrl.searchParams.delete('vnp_PayDate');
        currentUrl.searchParams.delete('vnp_SecureHash');
        
        window.history.replaceState({}, '', currentUrl.toString());
        
        // Force refresh when redirecting to ensure latest data
        setTimeout(() => {
          // Add parameter to indicate payment was updated
          window.location.href = '/booking-history?paymentUpdated=true';
        }, 500);

      } catch (error) {
        console.error('Payment status update error:', error);
        toast.error('Failed to update payment status');
        
        // Mark as failed
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(processKey, 'error');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    // Only process if we have VNPAY return parameters
    const hasVnpayParams = searchParams.get('vnp_ResponseCode');
    if (hasVnpayParams) {
      processPayment();
    }

  }, []); // Empty dependency array - only run once on mount

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className={`font-bold py-2 px-4 rounded ${
        isProcessing 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-500 hover:bg-blue-700 text-white'
      }`}
    >
      {isProcessing ? 'Processing...' : 'Pay with VNPAY'}
    </button>
  );
};