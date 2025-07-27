'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import {
    Home,
    Search,
    MessageCircle,
    User,
    FileText,
    Users,
    ShieldCheck,
    UserCheck,
    Bell
} from 'lucide-react';

interface TabItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    activeFor?: string[];
}

export const BottomTabNavigation: React.FC = () => {
    const { user, userType } = useAuth();
    const { unreadCount } = useChat();
    const pathname = usePathname();

    if (!user) return null;

    const getTabItems = (): TabItem[] => {
        const baseItems: TabItem[] = [
            {
                href: '/dashboard',
                label: 'Trang chủ',
                icon: Home,
                activeFor: ['/dashboard', '/']
            }
        ];

        const userTypeItems: Record<string, TabItem[]> = {
            user: [
                {
                    href: '/search-helper',
                    label: 'Tìm kiếm',
                    icon: Search,
                    activeFor: ['/search-helper', '/search']
                },
                {
                    href: '/chat',
                    label: 'Tin nhắn',
                    icon: MessageCircle,
                    badge: unreadCount,
                    activeFor: ['/chat']
                },
                {
                    href: '/customer-reports',
                    label: 'Đơn hàng',
                    icon: FileText,
                    activeFor: ['/customer-reports', '/orders']
                },
                {
                    href: '/profile',
                    label: 'Cá nhân',
                    icon: User,
                    activeFor: ['/profile', '/settings']
                }
            ],
            helper: [
                {
                    href: '/chat',
                    label: 'Tin nhắn',
                    icon: MessageCircle,
                    badge: unreadCount,
                    activeFor: ['/chat']
                },
                {
                    href: '/helper-reports',
                    label: 'Báo cáo',
                    icon: FileText,
                    activeFor: ['/helper-reports', '/reports']
                },
                {
                    href: '/notifications',
                    label: 'Thông báo',
                    icon: Bell,
                    activeFor: ['/notifications']
                },
                {
                    href: '/profile',
                    label: 'Cá nhân',
                    icon: User,
                    activeFor: ['/profile', '/settings']
                }
            ],
            admin: [
                {
                    href: '/helper-applications',
                    label: 'Ứng tuyển',
                    icon: UserCheck,
                    activeFor: ['/helper-applications', '/applications']
                },
                {
                    href: '/profile-management',
                    label: 'Quản lý',
                    icon: Users,
                    activeFor: ['/profile-management', '/management']
                },
                {
                    href: '/admin-reports',
                    label: 'Báo cáo',
                    icon: ShieldCheck,
                    activeFor: ['/admin-reports', '/reports']
                },
                {
                    href: '/profile',
                    label: 'Cá nhân',
                    icon: User,
                    activeFor: ['/profile', '/settings']
                }
            ]
        };

        return [...baseItems, ...(userTypeItems[userType as string] || [])];
    };

    const tabItems = getTabItems();

    const isActive = (item: TabItem): boolean => {
        if (item.activeFor) {
            return item.activeFor.some(path => pathname === path || pathname.startsWith(path));
        }
        return pathname === item.href;
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border md:hidden"
            role="navigation"
            aria-label="Bottom navigation"
        >
            <div className="flex items-center justify-around h-16 px-2">
                {tabItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs font-medium transition-colors duration-200 rounded-lg",
                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                active
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            aria-current={active ? "page" : undefined}
                        >
                            <div className="relative">
                                <Icon className={cn("w-5 h-5 mb-1", active && "text-primary")} />
                                {item.badge && item.badge > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px] flex items-center justify-center"
                                    >
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </Badge>
                                )}
                            </div>
                            <span className={cn(
                                "truncate max-w-full",
                                active && "text-primary font-semibold"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};