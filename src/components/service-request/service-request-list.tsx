'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { serviceRequestApi, supportApi } from '@/lib/api/service-request';
import { ServiceRequest, Service } from '@/types/service-request';
import { ServiceRequestForm } from './service-request-form';
import { Edit, Trash2, Eye } from 'lucide-react';

export function ServiceRequestList() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
    const [viewingRequest, setViewingRequest] = useState<ServiceRequest | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [requestsRes, servicesRes] = await Promise.all([
                serviceRequestApi.getAvailableRequests(),
                supportApi.getActiveServices()
            ]);

            if (requestsRes.success) {
                setRequests(requestsRes.data);
            }

            if (servicesRes.success) {
                setServices(servicesRes.data);
            }
        } catch (error) {
            toast.error('Không thể tải yêu cầu');
            console.error('Error loading requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (requestId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) return;

        try {
            const response = await serviceRequestApi.deleteRequest(requestId);
            if (response.success) {
                toast.success('Xóa yêu cầu thành công');
                loadData();
            } else {
                toast.error(response.message || 'Không thể xóa yêu cầu');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi xóa');
            console.error('Error deleting request:', error);
        }
    };

    const getServiceName = (serviceId: number) => {
        const service = services.find(s => s.serviceId === serviceId);
        return service?.serviceName || 'Dịch vụ không xác định';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500';
            case 'Completed': return 'bg-green-500';
            case 'Cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải yêu cầu...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Yêu cầu dịch vụ</h2>
                <Button onClick={loadData}>Làm mới</Button>
            </div>

            {requests.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500">Không tìm thấy yêu cầu dịch vụ nào</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <Card key={request.requestId}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">
                                            Yêu cầu #{request.requestId} - {getServiceName(request.serviceId)}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            ID người dùng: {request.userId} | Thời lượng: {request.requestedDurationHours}h
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(request.status)}>
                                        {request.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p><strong>Thời gian bắt đầu:</strong> {new Date(request.requestedStartTime).toLocaleString()}</p>
                                    {request.specialNotes && (
                                        <p><strong>Ghi chú:</strong> {request.specialNotes}</p>
                                    )}
                                    {request.requestCreationTime && (
                                        <p><strong>Được tạo:</strong> {new Date(request.requestCreationTime).toLocaleString()}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => setViewingRequest(request)}>
                                                <Eye className="w-4 h-4 mr-1" />
                                                Xem
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Chi tiết yêu cầu</DialogTitle>
                                            </DialogHeader>
                                            {viewingRequest && (
                                                <div className="space-y-3">
                                                    <div><strong>ID yêu cầu:</strong> {viewingRequest.requestId}</div>
                                                    <div><strong>ID người dùng:</strong> {viewingRequest.userId}</div>
                                                    <div><strong>Dịch vụ:</strong> {getServiceName(viewingRequest.serviceId)}</div>
                                                    <div><strong>ID địa chỉ:</strong> {viewingRequest.addressId}</div>
                                                    <div><strong>Thời gian bắt đầu:</strong> {new Date(viewingRequest.requestedStartTime).toLocaleString()}</div>
                                                    <div><strong>Thời lượng:</strong> {viewingRequest.requestedDurationHours} giờ</div>
                                                    <div><strong>Trạng thái:</strong> <Badge className={getStatusColor(viewingRequest.status)}>{viewingRequest.status}</Badge></div>
                                                    {viewingRequest.specialNotes && (
                                                        <div><strong>Ghi chú đặc biệt:</strong> {viewingRequest.specialNotes}</div>
                                                    )}
                                                    {viewingRequest.requestCreationTime && (
                                                        <div><strong>Được tạo:</strong> {new Date(viewingRequest.requestCreationTime).toLocaleString()}</div>
                                                    )}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>

                                    {request.status === 'Pending' && (
                                        <>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setEditingRequest(request)}>
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Chỉnh sửa
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Chỉnh sửa yêu cầu</DialogTitle>
                                                    </DialogHeader>
                                                    <ServiceRequestForm
                                                        editData={editingRequest || undefined}
                                                        onSuccess={() => {
                                                            setEditingRequest(null);
                                                            loadData();
                                                        }}
                                                    />
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(request.requestId)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Xóa
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}