'use client';

import React, { useState } from 'react';
import { BottomTabNavigation } from './BottomTabNavigation';
import { SidebarNavigation } from './SidebarNavigation';
import { Header } from './Header';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

// Mock auth context for demo
const MockAuthProvider: React.FC<{
    children: React.ReactNode;
    userType: string;
    user: any;
}> = ({ children, userType, user }) => {
    const mockAuthValue = {
        user,
        userType,
        login: () => { },
        logout: () => { },
        loading: false,
    };

    return (
        <div data-mock-auth={JSON.stringify(mockAuthValue)}>
            {children}
        </div>
    );
};

// Mock chat context for demo
const MockChatProvider: React.FC<{
    children: React.ReactNode;
    unreadCount: number;
}> = ({ children, unreadCount }) => {
    const mockChatValue = {
        unreadCount,
        messages: [],
        sendMessage: () => { },
        markAsRead: () => { },
    };

    return (
        <div data-mock-chat={JSON.stringify(mockChatValue)}>
            {children}
        </div>
    );
};

export const NavigationDemo: React.FC = () => {
    const [selectedUserType, setSelectedUserType] = useState<'user' | 'helper' | 'admin'>('user');
    const [unreadCount, setUnreadCount] = useState(3);

    const mockUsers = {
        user: {
            id: '1',
            fullName: 'Nguyễn Văn A',
            email: 'customer@example.com',
            avatar: null
        },
        helper: {
            id: '2',
            fullName: 'Trần Thị B',
            email: 'helper@example.com',
            avatar: null
        },
        admin: {
            id: '3',
            fullName: 'Admin User',
            email: 'admin@example.com',
            avatar: null
        }
    };

    const userTypeLabels = {
        user: 'Khách hàng',
        helper: 'Người giúp việc',
        admin: 'Quản trị viên'
    };

    return (
        <NavigationProvider>
            <MockAuthProvider userType={selectedUserType} user={mockUsers[selectedUserType]}>
                <MockChatProvider unreadCount={unreadCount}>
                    <div className="min-h-screen bg-background">
                        {/* Demo Controls */}
                        <div className="p-6 bg-muted/50 border-b">
                            <div className="max-w-7xl mx-auto">
                                <h1 className="text-2xl font-bold mb-4">Navigation Components Demo</h1>

                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="flex gap-2">
                                        <span className="text-sm font-medium">User Type:</span>
                                        {Object.entries(userTypeLabels).map(([type, label]) => (
                                            <Button
                                                key={type}
                                                variant={selectedUserType === type ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedUserType(type as any)}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </div>

                                    <Separator orientation="vertical" className="h-6" />

                                    <div className="flex gap-2 items-center">
                                        <span className="text-sm font-medium">Unread Messages:</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setUnreadCount(Math.max(0, unreadCount - 1))}
                                        >
                                            -
                                        </Button>
                                        <Badge variant="secondary">{unreadCount}</Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setUnreadCount(unreadCount + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Components */}
                        <div className="flex">
                            {/* Sidebar (Admin only) */}
                            <SidebarNavigation />

                            {/* Main Content */}
                            <div className="flex-1 flex flex-col">
                                {/* Header */}
                                <Header />

                                {/* Content Area */}
                                <main className="flex-1 p-6">
                                    <div className="max-w-7xl mx-auto space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Navigation Components Overview</CardTitle>
                                                <CardDescription>
                                                    Demonstrating the navigation system for different user types
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <h3 className="font-semibold mb-2">Current User: {userTypeLabels[selectedUserType]}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Switch between user types to see different navigation options.
                                                    </p>
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <Card>
                                                        <CardHeader className="pb-3">
                                                            <CardTitle className="text-base">Header Navigation</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="text-sm space-y-2">
                                                            <p>• Logo and branding</p>
                                                            <p>• Search bar (customers only)</p>
                                                            <p>• User profile dropdown</p>
                                                            <p>• Desktop navigation menu</p>
                                                            <p>• Mobile hamburger menu</p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card>
                                                        <CardHeader className="pb-3">
                                                            <CardTitle className="text-base">Bottom Tab Navigation</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="text-sm space-y-2">
                                                            <p>• Mobile-first design</p>
                                                            <p>• Role-based tab items</p>
                                                            <p>• Badge notifications</p>
                                                            <p>• Active state indicators</p>
                                                            <p>• Touch-friendly targets</p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card>
                                                        <CardHeader className="pb-3">
                                                            <CardTitle className="text-base">Sidebar Navigation</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="text-sm space-y-2">
                                                            <p>• Admin panel only</p>
                                                            <p>• Collapsible design</p>
                                                            <p>• Grouped sections</p>
                                                            <p>• Tooltips when collapsed</p>
                                                            <p>• Desktop optimized</p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Features Demonstrated</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="font-semibold mb-3">Accessibility Features</h4>
                                                        <ul className="text-sm space-y-1 text-muted-foreground">
                                                            <li>• ARIA labels and semantic HTML</li>
                                                            <li>• Keyboard navigation support</li>
                                                            <li>• Focus indicators</li>
                                                            <li>• Screen reader compatibility</li>
                                                            <li>• Touch-friendly targets (44px minimum)</li>
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold mb-3">Responsive Design</h4>
                                                        <ul className="text-sm space-y-1 text-muted-foreground">
                                                            <li>• Mobile-first approach</li>
                                                            <li>• Adaptive layouts</li>
                                                            <li>• Touch gestures support</li>
                                                            <li>• Progressive enhancement</li>
                                                            <li>• Cross-device compatibility</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </main>

                                {/* Bottom Navigation (Mobile) */}
                                <BottomTabNavigation />
                            </div>
                        </div>
                    </div>
                </MockChatProvider>
            </MockAuthProvider>
        </NavigationProvider>
    );
};