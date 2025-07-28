"use client";
import { useState, useEffect } from "react";
import { searchHelpers, getAllServices, Service } from "../../lib/api";
import type { HelperSearchResult } from "../../types/reports";
import { ServiceDiscovery, ServiceDiscoveryFilters } from "../../components/customer/ServiceDiscovery";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { QuickBookingModal } from "../../components/booking/QuickBookingModal";


export default function SearchHelperPage() {
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
  });
  const [selectedHelperForBooking, setSelectedHelperForBooking] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    setServiceLoading(true);
    getAllServices()
      .then(setServices)
      .catch(() => setError("Không thể tải danh sách dịch vụ."))
      .finally(() => setServiceLoading(false));
  }, []);

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

  const handleAddFavorite = (helperId: number) => {
    // Add to favorites
    alert(`Đã thêm helper ${helperId} vào danh sách yêu thích`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tìm Người Giúp Việc</h1>
        <p className="text-gray-600">Tìm kiếm và đặt dịch vụ giúp việc nhà phù hợp với nhu cầu của bạn</p>
      </div>

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn loại dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          {serviceLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Không có dịch vụ nào.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {services.map(service => (
                <Button
                  key={service.serviceId}
                  variant={selectedService?.serviceId === service.serviceId ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2 text-center"
                  onClick={() => handleSelectService(service)}
                  disabled={loading && selectedService?.serviceId === service.serviceId}
                >
                  <span className="font-semibold text-sm">{service.serviceName}</span>
                  <span className="text-xs text-gray-500 line-clamp-2">{service.description}</span>
                  <span className="text-xs font-medium text-primary">
                    {service.basePrice.toLocaleString()} {service.priceUnit}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Service Discovery Interface */}
      {selectedService && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Kết quả tìm kiếm cho "{selectedService.serviceName}"
            </h2>
          </div>

          <ServiceDiscovery
            results={filteredResults}
            loading={loading}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onHelperSelect={handleHelperSelect}
            onBookHelper={handleBook}
            onAddToFavorites={handleAddFavorite}
          />
        </div>
      )}

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