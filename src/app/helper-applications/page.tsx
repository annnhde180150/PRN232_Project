'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationsList from '../../components/applications/ApplicationsList';
import ApplicationDetail from '../../components/applications/ApplicationDetail';

export default function HelperApplicationsPage() {
  const { userType, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [selectedHelperId, setSelectedHelperId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!loading && (!isAuthenticated || userType !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, userType, loading, router]);

  const handleApplicationSelect = (helperId: number) => {
    setSelectedHelperId(helperId);
  };

  const handleBack = () => {
    setSelectedHelperId(null);
  };

  const handleDecisionMade = () => {
    setSelectedHelperId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        {selectedHelperId ? (
          <ApplicationDetail
            helperId={selectedHelperId}
            onBack={handleBack}
            onDecisionMade={handleDecisionMade}
          />
        ) : (
          <ApplicationsList
            onApplicationSelect={handleApplicationSelect}
            refreshTrigger={refreshTrigger}
            onDecisionMade={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}
      </div>
    </div>
  );
}
