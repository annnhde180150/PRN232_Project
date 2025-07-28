"use client";
import { useState, useEffect } from "react";
import { searchHelpers, getAllServices, Service, favoriteHelperAPI } from "../../lib/api";
import type { HelperSearchResult } from "../../types/reports";
import { ServiceDiscovery, ServiceDiscoveryFilters } from "../../components/customer/ServiceDiscovery";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { QuickBookingModal } from "../../components/booking/QuickBookingModal";
import { useAuth } from "../../contexts/AuthContext";

export default function SearchHelperPage() {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HelperSearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<HelperSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ServiceDiscoveryFilters>({
    priceRange: [0, 1000000],
    rating: 0,
    distance: 50,
    availability: 'all',
    sortBy: 'relevance',
    showFavoritesOnly: false,
  });
  const [selectedHelperForBooking, setSelectedHelperForBooking] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [favoriteHelperIds, setFavoriteHelperIds] = useState<number[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get current user ID from auth context
  const getCurrentUserId = (): number => {
    if (!isAuthenticated || !user) {
      return 0;
    }
    return user.id || 0;
  };

  // Load user's favorite helpers
  const loadFavorites = async () => {
    const userId = getCurrentUserId();
    if (userId === 0) return;

    setFavoritesLoading(true);
    try {
      const response = await favoriteHelperAPI.getUserFavorites(userId);
      if (response.success) {
        const favoriteIds = response.data.map((item: any) => item.helperId);
        setFavoriteHelperIds(favoriteIds);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    setServiceLoading(true);
    getAllServices()
      .then(setServices)
      .catch(() => setError("Không thể tải danh sách dịch vụ."))
      .finally(() => setServiceLoading(false));

    // Load favorites if user is authenticated
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const handleSelectService = async (service: Service) => {
    setSelectedService(service);
    setLoading(true);
    setError(null);
    setResults([]);
    setFilteredResults([]);
    try {
      const res = await searchHelpers(service.serviceId);
      setResults(res.data);
      setFilteredResults(res.data);
    } catch (err: any) {
      setError("Không thể tìm kiếm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterResults(query, filters);
  };

  const handleFilterChange = (newFilters: ServiceDiscoveryFilters) => {
    setFilters(newFilters);
    filterResults(searchQuery, newFilters);
  };

  const filterResults = (query: string, newFilters: ServiceDiscoveryFilters) => {
    let filtered = [...results];

    // Text search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(helper =>
        helper.helperName.toLowerCase().includes(searchLower) ||
        helper.serviceName.toLowerCase().includes(searchLower) ||
        helper.bio?.toLowerCase().includes(searchLower) ||
        helper.helperWorkAreas.some(area =>
          area.city.toLowerCase().includes(searchLower) ||
          area.district.toLowerCase().includes(searchLower) ||
          area.ward.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply additional filters from newFilters if needed
    // TODO: Implement price, rating, distance filters

    setFilteredResults(filtered);
  };

  const handleHelperSelect = (helper: HelperSearchResult) => {
    // Navigate to helper detail page or show modal
    console.log("Selected helper:", helper);
  };

  const handleBook = (helperId: number) => {
    const helper = filteredResults.find(h => h.helperId === helperId);
    if (helper) {
      setSelectedHelperForBooking(helper);
      setShowBookingModal(true);
    }
  };

  const handleAddFavorite = async (helperId: number) => {
    const userId = getCurrentUserId();
    if (userId === 0) {
      alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      return;
    }

    try {
      await favoriteHelperAPI.addToFavorites({ userId, helperId });
      setFavoriteHelperIds(prev => [...prev, helperId]);
      alert('Đã thêm vào danh sách yêu thích');
    } catch (err: any) {
      alert('Không thể thêm vào danh sách yêu thích. Vui lòng thử lại.');
    }
  };

  const handleRemoveFavorite = async (helperId: number) => {
    const userId = getCurrentUserId();
    if (userId === 0) {
      alert('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }

    try {
      await favoriteHelperAPI.removeFromFavorites({ userId, helperId });
      setFavoriteHelperIds(prev => prev.filter(id => id !== helperId));
      alert('Đã xóa khỏi danh sách yêu thích');
    } catch (err: any) {
      alert('Không thể xóa khỏi danh sách yêu thích. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Sidebar - Service Selection */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-70'} transition-all duration-300 bg-white shadow-xl border-r border-gray-200 flex-shrink-0`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Dịch vụ</h2>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-8 h-8 p-0 hover:bg-gray-100"
              >
                <svg 
                  className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Service List */}
          <div className="overflow-y-auto h-full pb-20">
            {serviceLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
                </div>
                {!sidebarCollapsed && <p className="text-gray-500 text-sm">Đang tải...</p>}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                  </svg>
                </div>
                {!sidebarCollapsed && <p className="text-gray-500 text-sm">Không có dịch vụ</p>}
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {services.map(service => (
                  <Button
                    key={service.serviceId}
                    variant={selectedService?.serviceId === service.serviceId ? "default" : "ghost"}
                    className={`w-full justify-start ${sidebarCollapsed ? 'p-3' : 'p-4'} h-auto transition-all duration-200 ${
                      selectedService?.serviceId === service.serviceId 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => handleSelectService(service)}
                    disabled={loading && selectedService?.serviceId === service.serviceId}
                    title={sidebarCollapsed ? service.serviceName : undefined}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedService?.serviceId === service.serviceId 
                          ? "bg-blue-500" 
                          : "bg-gray-100"
                      }`}>
                        <svg className={`w-5 h-5 ${
                          selectedService?.serviceId === service.serviceId ? "text-white" : "text-gray-600"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                        </svg>
                      </div>
                      
                      {!sidebarCollapsed && (
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-semibold text-sm truncate mb-1">
                            {service.serviceName}
                          </div>
                          <div className={`text-xs line-clamp-2 mb-2 ${
                            selectedService?.serviceId === service.serviceId ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {service.description}
                          </div>
                          <div className={`text-xs font-bold ${
                            selectedService?.serviceId === service.serviceId 
                              ? "text-blue-200" 
                              : "text-blue-600"
                          }`}>
                            {service.basePrice.toLocaleString()} {service.priceUnit}
                          </div>
                        </div>
                      )}
                      
                      {loading && selectedService?.serviceId === service.serviceId && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-full px-6 py-6 space-y-6">
              {/* Error Display */}
              {error && (
                <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 text-red-700">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="font-medium text-sm">{error}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Welcome Message */}
              {!selectedService && !loading && (
                                  <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Chọn loại dịch vụ để bắt đầu</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Chọn một dịch vụ từ danh sách bên trái để tìm kiếm các chuyên gia phù hợp với nhu cầu của bạn
                  </p>
                </div>
              )}

              {/* Service Discovery Results */}
              {selectedService && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
                    <div className="p-4">
                      <ServiceDiscovery
                        results={filteredResults}
                        loading={loading}
                        favoriteHelperIds={favoriteHelperIds}
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                        onHelperSelect={handleHelperSelect}
                        onBookHelper={handleBook}
                        onAddToFavorites={handleAddFavorite}
                        onRemoveFromFavorites={handleRemoveFavorite}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Modal */}
      {selectedHelperForBooking && (
        <QuickBookingModal
          helper={selectedHelperForBooking}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedHelperForBooking(null);
          }}
          onBookingSuccess={() => {
            // Thông báo sẽ được hiển thị từ BookingForm component
            // và sẽ tự động chuyển hướng đến booking-history
          }}
        />
      )}
    </div>
  );
}