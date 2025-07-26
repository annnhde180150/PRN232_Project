'use client';

import { PaymentHandler } from '@/components/payment';
import { useSearchParams } from 'next/navigation';

export default function TestPaymentPage() {
  const searchParams = useSearchParams();
  
  // Get values from URL parameters or use defaults
  const userId = Number(searchParams.get('userId')) || 1;
  const bookingId = Number(searchParams.get('bookingId')) || 3;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Test Payment</h1>
        <div className="mb-4">
          <p className="text-gray-600">Testing payment with:</p>
          <ul className="list-disc list-inside mt-2">
            <li>User ID: {userId}</li>
            <li>Booking ID: {bookingId}</li>
          </ul>
        </div>
        <PaymentHandler userId={userId} bookingId={bookingId} />
      </div>
    </div>
  );
} 