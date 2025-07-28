'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, CheckCircle, Star } from 'lucide-react';
import { ServiceRequestForm } from '@/components/service-request/service-request-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface QuickStats {
    activeRequests: number;
    completedBookings: number;
    pendingReviews: number;
    favoriteHelpers: number;
}

interface RecentActivity {
    id: number;
    type: 'request' | 'booking' | 'review';
    title: string;
    status: string;
    date: string;
}

export function EnhancedCustomerDashboard() {
    const [stats, setStats] = useState<QuickStats>({
        activeRequests: 0,
        completedBookings: 0,
        pendingReviews: 0,
        favoriteHelpers: 0
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [showCreateRequest, setShowCreateRequest] = useState(false);

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Dialog open={showCreateRequest} onOpenChange={setShowCreateRequest}>
                            <DialogTrigger asChild>
                                <Button className="h-20 flex flex-col items-center gap-2">
                                    <Plus className="w-6 h-6" />
                                    <span>Tạo yêu cầu</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Tạo yêu cầu dịch vụ mới</DialogTitle>
                                </DialogHeader>
                                <ServiceRequestForm onSuccess={() => setShowCreateRequest(false)} />
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                            <Clock className="w-6 h-6" />
                            <span>Đơn đang chờ</span>
                        </Button>

                        <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            <span>Lịch sử</span>
                        </Button>

                        <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                            <Star className="w-6 h-6" />
                            <span>Yêu thích</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.activeRequests}</div>
                        <div className="text-sm text-gray-600">Yêu cầu đang chờ</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
                        <div className="text-sm text-gray-600">Đã hoàn thành</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
                        <div className="text-sm text-gray-600">Chờ đánh giá</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.favoriteHelpers}</div>
                        <div className="text-sm text-gray-600">Helper yêu thích</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium">{activity.title}</div>
                                    <div className="text-sm text-gray-600">{activity.date}</div>
                                </div>
                                <Badge variant="outline">{activity.status}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}