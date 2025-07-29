'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { HelperApplications } from '@/components/service-request';
import { serviceRequestApi } from '@/lib/api/service-request';
import { ServiceRequest } from '@/types/service-request';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, List, Plus, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ApplicationsPageProps {
    params: Promise<{
        requestId: string;
    }>;
}

export default function ApplicationsPage({ params }: ApplicationsPageProps) {
    const router = useRouter();
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const resolvedParams = use(params);
    const requestId = parseInt(resolvedParams.requestId);

    useEffect(() => {
        if (isNaN(requestId)) {
            toast.error('ID yêu cầu không hợp lệ');
            router.push('/service-request/view');
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
            } else {
                toast.error(response.message || 'Không thể tải thông tin yêu cầu');
                router.push('/service-request/view');
            }
        } catch (error) {
            console.error('Error loading request:', error);
            toast.error('Đã xảy ra lỗi khi tải thông tin yêu cầu');
            router.push('/service-request/view');
        } finally {
            setLoading(false);
        }
    };

    const handleApplicationAccepted = () => {
        toast.success('Đã chấp nhận đăng ký. Người giúp việc sẽ bắt đầu xử lý yêu cầu của bạn.');
        // Reload request data to get updated status
        loadRequest();
    };

    const navigateToHome = () => {
        router.push('/');
    };

    const navigateToViewRequests = () => {
        router.push('/service-request/view');
    };

    const navigateToDetail = (requestId: number) => {
        router.push(`/service-request/detail/${requestId}`);
    };

    const navigateToCreateRequest = () => {
        router.push('/service-request/create');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500';
            case 'Completed': return 'bg-green-500';
            case 'Cancelled': return 'bg-red-500';
            case 'InProgress': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Pending': return 'Đang chờ';
            case 'Completed': return 'Hoàn thành';
            case 'Cancelled': return 'Đã hủy';
            case 'InProgress': return 'Đang xử lý';
            default: return status;
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
                <div className="text-center py-12">Không tìm thấy thông tin yêu cầu</div>
                <div className="flex justify-center">
                    <Button onClick={navigateToViewRequests} className="flex items-center">
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
                <button onClick={navigateToHome} className="hover:text-gray-700 flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    <span>Trang chủ</span>
                </button>
                <span className="mx-2">/</span>
                <button onClick={navigateToViewRequests} className="hover:text-gray-700 flex items-center">
                    <span>Yêu cầu dịch vụ</span>
                </button>
                <span className="mx-2">/</span>
                <button onClick={() => navigateToDetail(requestId)} className="hover:text-gray-700 flex items-center">
                    <span>Chi tiết yêu cầu #{requestId}</span>
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">Danh sách đăng ký</span>
            </nav>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateToDetail(requestId)}
                        className="mr-4 flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Quay lại
                    </Button>
                    <h1 className="text-2xl font-bold">Đăng ký cho yêu cầu #{requestId}</h1>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateToDetail(requestId)}
                        className="flex items-center"
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={navigateToViewRequests}
                        className="flex items-center"
                    >
                        <List className="w-4 h-4 mr-1" />
                        Danh sách yêu cầu
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
                            <p><strong>Dịch vụ ID:</strong> {request.serviceId}</p>
                            <p><strong>Thời gian bắt đầu:</strong> {new Date(request.requestedStartTime).toLocaleString()}</p>
                            <p><strong>Thời lượng:</strong> {request.requestedDurationHours} giờ</p>
                        </div>
                        <div>
                            <p><strong>Địa chỉ ID:</strong> {request.addressId}</p>
                            <p><strong>Ngày tạo:</strong> {request.requestCreationTime ? new Date(request.requestCreationTime).toLocaleString() : 'N/A'}</p>
                            {request.specialNotes && (
                                <p><strong>Ghi chú:</strong> {request.specialNotes}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {request.status === 'Pending' ? (
                <HelperApplications 
                    requestId={requestId} 
                    onApplicationAccepted={handleApplicationAccepted} 
                />
            ) : (
                <Card>
                    <CardContent className="py-6 text-center">
                        <p className="text-gray-500">
                            {request.status === 'InProgress' 
                                ? 'Yêu cầu này đã được chấp nhận và đang được xử lý.' 
                                : 'Yêu cầu này không còn nhận đăng ký mới.'}
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => navigateToDetail(requestId)}
                                className="flex items-center"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Xem chi tiết yêu cầu
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
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 