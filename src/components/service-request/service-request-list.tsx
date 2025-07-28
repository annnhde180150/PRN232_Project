"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { serviceRequestApi, supportApi } from "@/lib/api/service-request";
import { ServiceRequest, Service } from "@/types/service-request";
import { Eye, Users, Home, Plus, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

interface ServiceRequestListProps {
  userId?: number;
  showUserRequests?: boolean;
  onCreateRequest?: () => void;
}

export function ServiceRequestList({
  userId,
  showUserRequests = false,
  onCreateRequest,
}: ServiceRequestListProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(
    showUserRequests ? "my-requests" : "available-requests"
  );

  useEffect(() => {
    loadData();
  }, [userId, showUserRequests, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      let requestsPromise;

      requestsPromise = serviceRequestApi.getAvailableRequests();

      const [requestsRes, servicesRes] = await Promise.all([
        requestsPromise,
        supportApi.getActiveServices(),
      ]);

      if (requestsRes.success) {
        setRequests(requestsRes.data);
      }

      if (servicesRes.success) {
        setServices(servicesRes.data);
      }
    } catch (error) {
      toast.error("Không thể tải yêu cầu");
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToApplications = (requestId: number) => {
    router.push(`/service-request/applications/${requestId}`);
  };

  const navigateToDetail = (requestId: number) => {
    router.push(`/service-request/detail/${requestId}`);
  };

  const navigateToHome = () => {
    router.push("/");
  };

  const navigateToCreate = () => {
    if (onCreateRequest) {
      onCreateRequest();
    } else {
      router.push("/service-request/create");
    }
  };

  const getServiceName = (serviceId: number) => {
    const service = services.find((s) => s.serviceId === serviceId);
    return service?.serviceName || "Dịch vụ không xác định";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      case "InProgress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Đang chờ";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      case "InProgress":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải yêu cầu...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <button
          onClick={navigateToHome}
          className="hover:text-gray-700 flex items-center"
        >
          <Home className="h-4 w-4 mr-1" />
          <span>Trang chủ</span>
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Yêu cầu dịch vụ</span>
      </nav>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Yêu cầu dịch vụ</h2>
        <div className="flex gap-2">
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Làm mới
          </Button>
          <Button onClick={navigateToCreate} className="flex items-center">
            <Plus className="w-4 h-4 mr-1" />
            Tạo yêu cầu mới
          </Button>
        </div>
      </div>

      {userId && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="available-requests">Tất cả yêu cầu</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === "my-requests"
                ? "Bạn chưa có yêu cầu dịch vụ nào"
                : "Không tìm thấy yêu cầu dịch vụ nào"}
            </p>
            <Button onClick={navigateToCreate} className="mt-4">
              <Plus className="w-4 h-4 mr-1" />
              Tạo yêu cầu mới
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map(
            (request) =>
              userId &&
              request.userId === userId && (
                <Card
                  key={request.requestId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Yêu cầu #{request.requestId} -{" "}
                          {getServiceName(request.serviceId)}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          ID người dùng: {request.userId} | Thời lượng:{" "}
                          {request.requestedDurationHours}h
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <strong>Thời gian bắt đầu:</strong>{" "}
                        {new Date(request.requestedStartTime).toLocaleString()}
                      </p>
                      {request.specialNotes && (
                        <p>
                          <strong>Ghi chú:</strong> {request.specialNotes}
                        </p>
                      )}
                      {request.requestCreationTime && (
                        <p>
                          <strong>Được tạo:</strong>{" "}
                          {new Date(
                            request.requestCreationTime
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToDetail(request.requestId)}
                        className="flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
          )}
        </div>
      )}
    </div>
  );
}
