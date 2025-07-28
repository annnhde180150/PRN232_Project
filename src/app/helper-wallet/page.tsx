'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelperWallet } from '@/components/helper/HelperWallet';
import { useAuth } from '@/contexts/AuthContext';

export default function HelperWalletPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [helperId, setHelperId] = useState<number | null>(null);

  useEffect(() => {
    // Check if user is logged in and is a helper
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'Helper') {
      router.push('/dashboard');
      return;
    }

    setHelperId(user.id);
  }, [user, router]);

  if (!helperId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <HelperWallet helperId={helperId} />
      </div>
    </div>
  );
} 