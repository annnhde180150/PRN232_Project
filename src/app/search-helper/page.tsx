"use client";
import { useState, useEffect } from "react";
import { searchHelpers, getAllServices, Service } from "../../lib/api";
import type { HelperSearchResult } from "../../types/reports";

export default function SearchHelperPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HelperSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [serviceLoading, setServiceLoading] = useState(true);

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
    try {
      const res = await searchHelpers(service.serviceId);
      setResults(res.data);
    } catch (err: any) {
      setError("Không thể tìm kiếm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (helperId: number) => {
    alert(`Book helper ${helperId}`);
  };
  
  const handleAddFavorite = (helperId: number) => {
    alert(`Add helper ${helperId} to favorite`);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Tìm Người Giúp Việc</h1>
      
      {/* Service Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Chọn dịch vụ</h2>
        {serviceLoading ? (
          <div>Đang tải danh sách dịch vụ...</div>
        ) : services.length === 0 ? (
          <div>Không có dịch vụ nào.</div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {services.map(service => (
              <button
                key={service.serviceId}
                className={`px-4 py-2 rounded border flex flex-col items-center w-40 h-40 justify-center text-center gap-2 
                  ${selectedService?.serviceId === service.serviceId 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-indigo-600 border-indigo-600'} 
                  hover:bg-indigo-100 transition-colors`}
                onClick={() => handleSelectService(service)}
                disabled={loading && selectedService?.serviceId === service.serviceId}
              >
                <span className="font-semibold">{service.serviceName}</span>
                <span className="text-xs text-gray-500 line-clamp-2">{service.description}</span>
                <span className="text-sm font-medium text-indigo-700">{service.basePrice.toLocaleString()} {service.priceUnit}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Helper Results */}
      <div>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
        
        {!loading && selectedService && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">Không có kết quả.</div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(helper => (
              <div key={helper.helperId} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Helper Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{helper.helperName}</h3>
                      <p className="text-sm text-gray-500">{helper.serviceName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      helper.availableStatus === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {helper.availableStatus}
                    </span>
                  </div>

                  {/* Helper Info */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Bio:</p>
                      <p className="text-gray-900">{helper.bio || 'Chưa có thông tin'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Đánh giá:</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{helper.rating || 'Chưa có đánh giá'}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Khu vực làm việc:</p>
                      {helper.helperWorkAreas.length > 0 ? (
                        <div className="space-y-1">
                          {helper.helperWorkAreas.map(area => (
                            <p key={area.workAreaId} className="text-gray-900">
                              {area.city}, {area.district}, {area.ward}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Chưa có thông tin</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Giá cơ bản:</p>
                      <p className="text-lg font-semibold text-indigo-600">
                        {helper.basePrice.toLocaleString()} đ
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      onClick={() => handleBook(helper.helperId)}
                    >
                      Book
                    </button>
                    <button
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                      onClick={() => handleAddFavorite(helper.helperId)}
                    >
                      Add Favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 