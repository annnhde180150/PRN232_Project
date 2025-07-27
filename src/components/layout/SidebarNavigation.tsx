'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import {
    Home,
    Users,
    FileText,
    Settings,
    ShieldCheck,
    UserCheck,
    BarChart3,
    MessageSquare,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    Database
} from 'lucide-react';

interface SidebarItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    activeFor?: string[];
    description?: string;
}

interface SidebarSection {
    title: string;
    items: SidebarItem[];
}

interface SidebarNavigationProps {
    className?: string;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ className }) => {
    const { user, userType } = useAuth();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Only show sidebar for admin users
    if (!user || userType !== 'admin') return null;

    const sidebarSections: SidebarSection[] = [
        {
            title: 'Tổng quan',
            items: [
                {
                    href: '/dashboard',
                    label: 'Dashboard',
                    icon: Home,
                    activeFor: ['/dashboard', '/'],
                    description: 'Tổng quan hệ thống'
                },
                {
                    href: '/admin-reports',
                    label: 'Báo cáo & Phân tích',
                    icon: BarChart3,
                    activeFor: ['/admin-reports', '/analytics'],
                    description: 'Thống kê và báo cáo chi tiết'
                }
            ]
        },
        {
            title: 'Quản lý người dùng',
            items: [
                {
                    href: '/profile-management',
                    label: 'Quản lý hồ sơ',
                    icon: Users,
                    activeFor: ['/profile-management', '/users'],
                    description: 'Quản lý tài khoản người dùng'
                },
                {
                    href: '/helper-applications',
                    label: 'Đơn ứng tuyển',
                    icon: UserCheck,
                    activeFor: ['/helper-applications', '/applications'],
                    description: 'Duyệt đơn ứng tuyển helper'
                }
            ]
        },
        {
            title: 'Vận hành',
            items: [
                {
                    href: '/dispute-resolution',
                    label: 'Giải quyết tranh chấp',
                    icon: AlertTriangle,
                    activeFor: ['/dispute-resolution', '/disputes'],
                    description: 'Xử lý khiếu nại và tranh chấp'
                },
                {
                    href: '/chat-monitoring',
                    label: 'Giám sát tin nhắn',
                    icon: MessageSquare,
                    activeFor: ['/chat-monitoring', '/chat-admin'],
                    description: 'Theo dõi và kiểm duyệt tin nhắn'
                },
                {
                    href: '/notifications-admin',
                    label: 'Quản lý thông báo',
                    icon: Bell,
                    activeFor: ['/notifications-admin'],
                    description: 'Gửi và quản lý thông báo hệ thống'
                }
            ]
        },
        {
            title: 'Hệ thống',
            items: [
                {
                    href: '/system-settings',
                    label: 'Cài đặt hệ thống',
                    icon: Settings,
                    activeFor: ['/system-settings', '/settings-admin'],
                    description: 'Cấu hình và thiết lập hệ thống'
                },
                {
                    href: '/data-management',
                    label: 'Quản lý dữ liệu',
                    icon: Database,
                    activeFor: ['/data-management', '/data'],
                    description: 'Backup và quản lý dữ liệu'
                }
            ]
        }
    ];

    const isActive = (item: SidebarItem): boolean => {
        if (item.activeFor) {
            return item.activeFor.some(path => pathname === path || pathname.startsWith(path));
        }
        return pathname === item.href;
    };

    const SidebarItem: React.FC<{ item: SidebarItem; collapsed: boolean }> = ({ item, collapsed }) => {
        const Icon = item.icon;
        const active = isActive(item);

        const content = (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "hover:bg-muted/50",
                    active
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "text-muted-foreground hover:text-foreground",
                    collapsed && "justify-center px-2"
                )}
                aria-current={active ? "page" : undefined}
            >
                <div className="relative flex-shrink-0">
                    <Icon className={cn("w-5 h-5", active && "text-primary")} />
                    {item.badge && item.badge > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px] flex items-center justify-center"
                        >
                            {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                    )}
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                    </div>
                )}
            </Link>
        );

        if (collapsed && item.description) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {content}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <div>
                                <p className="font-medium">{item.label}</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        return content;
    };

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col bg-background border-r border-border transition-all duration-300",
                isCollapsed ? "w-16" : "w-64",
                className
            )}
            role="navigation"
            aria-label="Admin sidebar navigation"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <span className="font-semibold text-primary">Admin Panel</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="h-8 w-8"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {sidebarSections.map((section, sectionIndex) => (
                    <div key={section.title}>
                        {!isCollapsed && (
                            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {section.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <SidebarItem key={item.href} item={item} collapsed={isCollapsed} />
                            ))}
                        </div>
                        {sectionIndex < sidebarSections.length - 1 && !isCollapsed && (
                            <Separator className="mt-4" />
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                {!isCollapsed ? (
                    <div className="text-xs text-muted-foreground">
                        <p className="font-medium">Admin Dashboard</p>
                        <p>Phiên bản 1.0.0</p>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                    </div>
                )}
            </div>
        </aside>
    );
};