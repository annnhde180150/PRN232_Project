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
        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    Dashboard
                  </button>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {selectedHelperId ? 'Chi tiết đơn đăng ký' : 'Quản lý đơn đăng ký'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          
          {!selectedHelperId && (
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý đơn đăng ký người giúp việc
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Xem xét và duyệt các đơn đăng ký từ người giúp việc mới
              </p>
            </div>
          )}
        </div>

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
