'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { NotificationBell } from '../notifications';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';
import {
  Home,
  MessageCircle,
  Bell,
  Search,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  UserCheck,
  ShieldCheck,
  MapPin,
  Filter
} from 'lucide-react';

interface HeaderProps {
  className?: string;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ className, showSearch = true }) => {
  const { user, userType, logout } = useAuth();
  const { unreadCount } = useChat();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search-helper?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  type NavigationItem = {
    href: string;
    label: string;
    icon: any;
    badge?: number;
  };

  const getNavigationItems = (): NavigationItem[] => {
    if (!user) return [];

    const baseItems: NavigationItem[] = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
    ];

    const userTypeItems: Record<string, NavigationItem[]> = {
      admin: [
        { href: '/admin-reports', label: 'Báo cáo Admin', icon: FileText },
        { href: '/helper-applications', label: 'Đơn ứng tuyển', icon: UserCheck },
        { href: '/profile-management', label: 'Quản lý hồ sơ', icon: Users },
      ],
      helper: [
        { href: '/helper-reports', label: 'Báo cáo của tôi', icon: FileText },
      ],
      user: [
        { href: '/search-helper', label: 'Tìm người giúp việc', icon: Search },
        { href: '/customer-reports', label: 'Báo cáo khách hàng', icon: FileText },
      ]
    };

    return [...baseItems, ...(userTypeItems[userType as string] || [])];
  };

  const navigationItems = getNavigationItems();

  const getUserRoleIcon = () => {
    switch (userType) {
      case 'admin': return <ShieldCheck className="w-3 h-3" />;
      case 'helper': return <UserCheck className="w-3 h-3" />;
      default: return null;
    }
  };

  const getUserRoleColor = () => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'helper': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <header className={cn(
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo và tên ứng dụng */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary hidden sm:block">Homezy</span>
            </Link>
          </div>

          {/* Search Bar - Only for customers */}
          {user && userType === 'user' && showSearch && (
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className={cn(
                  "relative flex items-center transition-all duration-200",
                  isSearchFocused && "ring-2 ring-primary ring-offset-2 rounded-lg"
                )}>
                  <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm dịch vụ, người giúp việc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="pl-10 pr-20 h-10 bg-muted/50 border-0 focus:bg-background"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Vị trí</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                    >
                      <Filter className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Navigation Menu - Desktop */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="relative"
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              ))}
            </nav>
          )}

          {/* Right side - User menu hoặc Login */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as any).avatar} alt={user.fullName} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.fullName?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className={`text-xs px-2 py-0.5 ${getUserRoleColor()}`}>
                            <div className="flex items-center gap-1">
                              {getUserRoleIcon()}
                              <span className="capitalize">{userType}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Cài đặt</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col space-y-4 mt-4">
                      <div className="flex items-center space-x-2 pb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={(user as any).avatar} alt={user.fullName} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.fullName?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.fullName}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                      <Separator />
                      <nav className="flex flex-col space-y-2">
                        {navigationItems.map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            asChild
                            className="justify-start"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link href={item.href} className="flex items-center gap-3">
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                              {item.badge && item.badge > 0 && (
                                <Badge variant="destructive" className="ml-auto">
                                  {item.badge > 99 ? '99+' : item.badge}
                                </Badge>
                              )}
                            </Link>
                          </Button>
                        ))}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
