"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { serviceRequestApi, supportApi } from "@/lib/api/service-request";
import { addressAPI } from "@/lib/api";
import { ServiceRequest, Service } from "@/types/service-request";
import { UserAddress } from "@/types/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Users, Home, List, Plus, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ServiceRequestForm } from "@/components/service-request";

interface RequestDetailPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const router = useRouter();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [address, setAddress] = useState<UserAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const resolvedParams = use(params);
  const requestId = parseInt(resolvedParams.requestId);

  useEffect(() => {
    if (isNaN(requestId)) {
      toast.error("ID yêu cầu không hợp lệ");
      router.push("/service-request/view");
      return;
    }

    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    setLoading(true);
    try {
      const response = await serviceRequestApi.getRequest(requestId);
      if (response.success) {
        setRequest(response.data);

        // Load service information
        const serviceRes = await supportApi.getActiveServices();
        if (serviceRes.success) {
          const matchingService = serviceRes.data.find(
            (s) => s.serviceId === response.data.serviceId
          );
          if (matchingService) {
            setService(matchingService);
          }
        }

        // Load address information
        try {
          const addressData = await addressAPI.getAddress(response.data.addressId);
          setAddress(addressData);
        } catch (addressError) {
          console.error("Error loading address:", addressError);
          // Don't show error toast for address, just log it
        }
      } else {
        toast.error(response.message || "Không thể tải thông tin yêu cầu");
        router.push("/service-request/view");
      }
    } catch (error) {
      console.error("Error loading request:", error);
      toast.error("Đã xảy ra lỗi khi tải thông tin yêu cầu");
      router.push("/service-request/view");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!request) return;

    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu này?")) return;

    try {
      const response = await serviceRequestApi.deleteRequest(request.requestId);
      if (response.success) {
        toast.success("Xóa yêu cầu thành công");
        router.push("/service-request/view");
      } else {
        toast.error(response.message || "Không thể xóa yêu cầu");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa");
      console.error("Error deleting request:", error);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    toast.success("Cập nhật yêu cầu thành công");
    loadRequest();
  };

  const navigateToHome = () => {
    router.push("/");
  };

  const navigateToViewRequests = () => {
    router.push("/service-request/view");
  };

  const navigateToApplications = (requestId: number) => {
    router.push(`/service-request/applications/${requestId}`);
  };

  const navigateToCreateRequest = () => {
    router.push("/service-request/create");
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
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">Đang tải thông tin...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          Không tìm thấy thông tin yêu cầu
        </div>
        <div className="flex justify-center">
          <Button
            onClick={navigateToViewRequests}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại danh sách yêu cầu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
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
        <button
          onClick={navigateToViewRequests}
          className="hover:text-gray-700 flex items-center"
        >
          <span>Yêu cầu dịch vụ</span>
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">
          Chi tiết yêu cầu #{requestId}
        </span>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToViewRequests}
            className="mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết yêu cầu #{requestId}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToViewRequests}
            className="flex items-center"
          >
            <List className="w-4 h-4 mr-1" />
            Danh sách yêu cầu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToCreateRequest}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tạo yêu cầu mới
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Thông tin yêu cầu</CardTitle>
            <Badge className={getStatusColor(request.status)}>
              {getStatusText(request.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Dịch vụ:</strong>{" "}
                {service ? service.serviceName : `ID: ${request.serviceId}`}
              </p>
              <p>
                <strong>Thời gian bắt đầu:</strong>{" "}
                {new Date(request.requestedStartTime).toLocaleString()}
              </p>
              <p>
                <strong>Thời lượng:</strong> {request.requestedDurationHours}{" "}
                giờ
              </p>
            </div>
            <div>
              <p>
                <strong>Địa chỉ:</strong>{" "}
                {address ? (
                  <>
                    <MapPin className="w-4 h-4 inline mr-1 text-gray-500" />
                    {address.fullAddress}
                  </>
                ) : (
                  `ID: ${request.addressId}`
                )}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {request.requestCreationTime
                  ? new Date(request.requestCreationTime).toLocaleString()
                  : "N/A"}
              </p>
              {request.specialNotes && (
                <p>
                  <strong>Ghi chú:</strong> {request.specialNotes}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {request.status === "Pending" && (
              <>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa yêu cầu</DialogTitle>
                    </DialogHeader>
                    <ServiceRequestForm
                      editData={request}
                      onSuccess={handleEditSuccess}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {service && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Tên dịch vụ:</strong> {service.serviceName}
              </p>
              <p>
                <strong>Mô tả:</strong> {service.description}
              </p>
              <p>
                <strong>Giá cơ bản:</strong>{" "}
                {service.basePrice.toLocaleString()} {service.priceUnit}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
