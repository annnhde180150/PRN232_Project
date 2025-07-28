'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceRequestForm } from '@/components/service-request';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, List } from 'lucide-react';

export default function CreateServiceRequestPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRequestCreated = () => {
        toast.success('Yêu cầu đã được tạo thành công!');
        // Redirect to the view requests page after successful creation
        router.push('/service-request/view');
    };

    const navigateToHome = () => {
        router.push('/');
    };

    const navigateToViewRequests = () => {
        router.push('/service-request/view');
    };

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
                <span className="text-gray-900 font-medium">Tạo yêu cầu</span>
            </nav>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tạo yêu cầu dịch vụ</h1>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={navigateToViewRequests}
                        className="flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Quay lại
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={navigateToViewRequests}
                        className="flex items-center"
                    >
                        <List className="h-4 w-4 mr-1" />
                        Xem yêu cầu
                    </Button>
                </div>
            </div>
            
            <ServiceRequestForm 
                onSuccess={handleRequestCreated} 
                onSubmitStart={() => setIsSubmitting(true)}
                onSubmitEnd={() => setIsSubmitting(false)}
            />
            
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Hướng dẫn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Điền đầy đủ thông tin yêu cầu dịch vụ của bạn</li>
                            <li>Chọn thời gian bắt đầu phù hợp (tối thiểu 2 giờ kể từ thời điểm hiện tại)</li>
                            <li>Thời lượng dịch vụ từ 1-8 giờ</li>
                            <li>Cung cấp ghi chú đặc biệt nếu có yêu cầu cụ thể</li>
                            <li>Sau khi tạo yêu cầu, các người giúp việc có thể đăng ký thực hiện dịch vụ</li>
                            <li>Bạn có thể xem và chấp nhận/từ chối đăng ký của người giúp việc</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 