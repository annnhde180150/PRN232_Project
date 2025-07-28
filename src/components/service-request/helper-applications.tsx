'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-hot-toast';
import { serviceRequestApi } from '@/lib/api/service-request';
import { HelperApplication, HelperApplicationResponse } from '@/types/service-request';
import { Star } from 'lucide-react';

interface HelperApplicationsProps {
    requestId: number;
    onApplicationAccepted?: () => void;
}

export function HelperApplications({ requestId, onApplicationAccepted }: HelperApplicationsProps) {
    const [applications, setApplications] = useState<HelperApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState<number | null>(null);

    useEffect(() => {
        if (requestId) {
            loadApplications();
        }
    }, [requestId]);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const response = await serviceRequestApi.getRequestApplications(requestId);
            if (response.success) {
                setApplications(response.data);
            } else {
                toast.error(response.message || 'Không thể tải danh sách đăng ký');
            }
        } catch (error) {
            console.error('Error loading applications:', error);
            toast.error('Đã xảy ra lỗi khi tải danh sách đăng ký');
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (application: HelperApplication, accepted: boolean) => {
        setProcessing(application.applicationId);
        try {
            const responseData: HelperApplicationResponse = {
                applicationId: application.applicationId,
                requestId: application.requestId,
                helperId: application.helperId,
                accepted
            };

            const response = await serviceRequestApi.respondToApplication(responseData);
            
            if (response.success) {
                toast.success(accepted 
                    ? 'Đã chấp nhận đăng ký. Người giúp việc sẽ bắt đầu xử lý yêu cầu của bạn.' 
                    : 'Đã từ chối đăng ký');
                
                if (accepted && onApplicationAccepted) {
                    onApplicationAccepted();
                } else {
                    // Reload applications to update status
                    loadApplications();
                }
            } else {
                toast.error(response.message || 'Không thể xử lý phản hồi');
            }
        } catch (error) {
            console.error('Error responding to application:', error);
            toast.error('Đã xảy ra lỗi khi xử lý phản hồi');
        } finally {
            setProcessing(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Badge className="bg-yellow-500">Đang chờ</Badge>;
            case 'Accepted':
                return <Badge className="bg-green-500">Đã chấp nhận</Badge>;
            case 'Rejected':
                return <Badge className="bg-red-500">Đã từ chối</Badge>;
            default:
                return <Badge className="bg-gray-500">{status}</Badge>;
        }
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải danh sách đăng ký...</div>;
    }

    if (applications.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-6">
                    <p className="text-gray-500">Chưa có người giúp việc nào đăng ký yêu cầu này</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Danh sách đăng ký ({applications.length})</h3>
                <Button variant="outline" size="sm" onClick={loadApplications}>
                    Làm mới
                </Button>
            </div>

            <div className="grid gap-4">
                {applications.map((application) => (
                    <Card key={application.applicationId}>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={application.helperAvatar} alt={application.helperName} />
                                    <AvatarFallback>{application.helperName.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <h4 className="font-semibold">{application.helperName}</h4>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                <span>{application.helperRating?.toFixed(1) || 'N/A'}</span>
                                                <span className="mx-2">•</span>
                                                <span>{application.completedJobs || 0} công việc hoàn thành</span>
                                            </div>
                                        </div>
                                        {getStatusBadge(application.status)}
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 mt-1">
                                        Đăng ký lúc: {new Date(application.applicationTime).toLocaleString()}
                                    </p>
                                    
                                    {application.status === 'Pending' && (
                                        <div className="flex gap-2 mt-3">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleResponse(application, true)}
                                                disabled={processing === application.applicationId}
                                            >
                                                {processing === application.applicationId ? 'Đang xử lý...' : 'Chấp nhận'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleResponse(application, false)}
                                                disabled={processing === application.applicationId}
                                            >
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 