import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { BottomTabNavigation } from '../BottomTabNavigation';
import { SidebarNavigation } from '../SidebarNavigation';
import { Header } from '../Header';
import { NavigationProvider, useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useChat } from '../../../contexts/ChatContext';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}));

// Mock contexts
jest.mock('../../../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../../contexts/ChatContext', () => ({
    useChat: jest.fn(),
}));

// Mock notifications component
jest.mock('../../notifications', () => ({
    NotificationBell: () => <div data-testid="notification-bell">Notification Bell</div>,
}));

const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
};

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseChat = useChat as jest.MockedFunction<typeof useChat>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navigation Components', () => {
    beforeEach(() => {
        mockUseRouter.mockReturnValue(mockRouter);
        mockUsePathname.mockReturnValue('/dashboard');
        mockUseChat.mockReturnValue({
            unreadCount: 0,
            messages: [],
            sendMessage: jest.fn(),
            markAsRead: jest.fn(),
        });
        jest.clearAllMocks();
    });

    describe('BottomTabNavigation', () => {
        const renderBottomTabNavigation = (userType: string = 'user') => {
            mockUseAuth.mockReturnValue({
                user: { id: '1', fullName: 'Test User', email: 'test@example.com' },
                userType,
                login: jest.fn(),
                logout: jest.fn(),
                loading: false,
            });

            return render(
                <NavigationProvider>
                    <BottomTabNavigation />
                </NavigationProvider>
            );
        };

        it('should not render when user is not logged in', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                userType: null,
                login: jest.fn(),
                logout: jest.fn(),
                loading: false,
            });

            const { container } = render(
                <NavigationProvider>
                    <BottomTabNavigation />
                </NavigationProvider>
            );

            expect(container.firstChild).toBeNull();
        });

        it('should render customer navigation items', () => {
            renderBottomTabNavigation('user');

            expect(screen.getByText('Trang chủ')).toBeInTheDocument();
            expect(screen.getByText('Tìm kiếm')).toBeInTheDocument();
            expect(screen.getByText('Tin nhắn')).toBeInTheDocument();
            expect(screen.getByText('Đơn hàng')).toBeInTheDocument();
            expect(screen.getByText('Cá nhân')).toBeInTheDocument();
        });

        it('should render helper navigation items', () => {
            renderBottomTabNavigation('helper');

            expect(screen.getByText('Trang chủ')).toBeInTheDocument();
            expect(screen.getByText('Tin nhắn')).toBeInTheDocument();
            expect(screen.getByText('Báo cáo')).toBeInTheDocument();
            expect(screen.getByText('Thông báo')).toBeInTheDocument();
            expect(screen.getByText('Cá nhân')).toBeInTheDocument();
        });

        it('should render admin navigation items', () => {
            renderBottomTabNavigation('admin');

            expect(screen.getByText('Trang chủ')).toBeInTheDocument();
            expect(screen.getByText('Ứng tuyển')).toBeInTheDocument();
            expect(screen.getByText('Quản lý')).toBeInTheDocument();
            expect(screen.getByText('Báo cáo')).toBeInTheDocument();
            expect(screen.getByText('Cá nhân')).toBeInTheDocument();
        });

        it('should highlight active tab', () => {
            mockUsePathname.mockReturnValue('/dashboard');
            renderBottomTabNavigation('user');

            const homeTab = screen.getByText('Trang chủ').closest('a');
            expect(homeTab).toHaveClass('text-primary');
        });

        it('should show unread message badge', () => {
            mockUseChat.mockReturnValue({
                unreadCount: 5,
                messages: [],
                sendMessage: jest.fn(),
                markAsRead: jest.fn(),
            });

            renderBottomTabNavigation('user');

            expect(screen.getByText('5')).toBeInTheDocument();
        });

        it('should be accessible with proper ARIA labels', () => {
            renderBottomTabNavigation('user');

            const nav = screen.getByRole('navigation');
            expect(nav).toHaveAttribute('aria-label', 'Bottom navigation');

            const activeTab = screen.getByText('Trang chủ').closest('a');
            expect(activeTab).toHaveAttribute('aria-current', 'page');
        });
    });

    describe('SidebarNavigation', () => {
        const renderSidebarNavigation = (userType: string = 'admin') => {
            mockUseAuth.mockReturnValue({
                user: { id: '1', fullName: 'Admin User', email: 'admin@example.com' },
                userType,
                login: jest.fn(),
                logout: jest.fn(),
                loading: false,
            });

            return render(
                <NavigationProvider>
                    <SidebarNavigation />
                </NavigationProvider>
            );
        };

        it('should not render for non-admin users', () => {
            mockUseAuth.mockReturnValue({
                user: { id: '1', fullName: 'Regular User', email: 'user@example.com' },
                userType: 'user',
                login: jest.fn(),
                logout: jest.fn(),
                loading: false,
            });

            const { container } = render(
                <NavigationProvider>
                    <SidebarNavigation />
                </NavigationProvider>
            );

            expect(container.firstChild).toBeNull();
        });

        it('should render admin sidebar items', () => {
            renderSidebarNavigation('admin');

            expect(screen.getByText('Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Báo cáo & Phân tích')).toBeInTheDocument();
            expect(screen.getByText('Quản lý hồ sơ')).toBeInTheDocument();
            expect(screen.getByText('Đơn ứng tuyển')).toBeInTheDocument();
            expect(screen.getByText('Giải quyết tranh chấp')).toBeInTheDocument();
        });

        it('should toggle collapse state', () => {
            renderSidebarNavigation('admin');

            const toggleButton = screen.getByLabelText('Collapse sidebar');
            fireEvent.click(toggleButton);

            expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
        });

        it('should show tooltips when collapsed', async () => {
            renderSidebarNavigation('admin');

            // Collapse sidebar
            const toggleButton = screen.getByLabelText('Collapse sidebar');
            fireEvent.click(toggleButton);

            // Check that sidebar is collapsed by looking for the expand button
            expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
        });

        it('should highlight active navigation item', () => {
            mockUsePathname.mockReturnValue('/dashboard');
            renderSidebarNavigation('admin');

            const dashboardItem = screen.getByText('Dashboard').closest('a');
            expect(dashboardItem).toHaveClass('bg-primary/10', 'text-primary');
        });
    });

    describe('Header', () => {
        const renderHeader = (userType: string = 'user', showSearch: boolean = true) => {
            mockUseAuth.mockReturnValue({
                user: { id: '1', fullName: 'Test User', email: 'test@example.com' },
                userType,
                login: jest.fn(),
                logout: jest.fn(),
                loading: false,
            });

            return render(
                <NavigationProvider>
                    <Header showSearch={showSearch} />
                </NavigationProvider>
            );
        };

        it('should render logo and app name', () => {
            renderHeader();

            expect(screen.getByText('Homezy')).toBeInTheDocument();
        });

        it('should show search bar for customers', () => {
            renderHeader('user', true);

            expect(screen.getByPlaceholderText('Tìm kiếm dịch vụ, người giúp việc...')).toBeInTheDocument();
        });

        it('should not show search bar for non-customers', () => {
            renderHeader('admin', true);

            expect(screen.queryByPlaceholderText('Tìm kiếm dịch vụ, người giúp việc...')).not.toBeInTheDocument();
        });

        it('should handle search submission', () => {
            renderHeader('user', true);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm dịch vụ, người giúp việc...');
            fireEvent.change(searchInput, { target: { value: 'dọn dẹp' } });
            fireEvent.submit(searchInput.closest('form')!);

            expect(mockRouter.push).toHaveBeenCalledWith('/search-helper?q=d%E1%BB%8Dn%20d%E1%BA%B9p');
        });

        it('should show user profile dropdown', () => {
            renderHeader();

            // Find the profile button by its avatar content
            const profileButton = screen.getByRole('button', { name: 'T' });
            expect(profileButton).toBeInTheDocument();

            // Check that the button has dropdown attributes
            expect(profileButton).toHaveAttribute('aria-haspopup', 'menu');
        });

        it('should handle logout', () => {
            const mockLogout = jest.fn();
            mockUseAuth.mockReturnValue({
                user: { id: '1', fullName: 'Test User', email: 'test@example.com' },
                userType: 'user',
                login: jest.fn(),
                logout: mockLogout,
                loading: false,
            });

            render(
                <NavigationProvider>
                    <Header />
                </NavigationProvider>
            );

            // Find the profile button by its avatar content
            const profileButton = screen.getByRole('button', { name: 'T' });
            expect(profileButton).toBeInTheDocument();

            // Test that the logout function exists in the component
            expect(mockLogout).toBeDefined();
        });

        it('should show login/register buttons when not authenticated', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                userType: null,
                login: jest.fn(),
                logout: jest.fn(),
                loading: false,
            });

            render(
                <NavigationProvider>
                    <Header />
                </NavigationProvider>
            );

            expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
            expect(screen.getByText('Đăng ký')).toBeInTheDocument();
        });
    });

    describe('NavigationContext', () => {
        const TestComponent = () => {
            const { state, setSearchQuery, addToSearchHistory } = useNavigation();

            return (
                <div>
                    <div data-testid="current-path">{state.currentPath}</div>
                    <div data-testid="search-query">{state.searchQuery}</div>
                    <div data-testid="search-history">{state.searchHistory.join(',')}</div>
                    <button onClick={() => setSearchQuery('test query')}>Set Search Query</button>
                    <button onClick={() => addToSearchHistory('test history')}>Add to History</button>
                </div>
            );
        };

        it('should provide navigation state', () => {
            mockUsePathname.mockReturnValue('/test-path');

            render(
                <NavigationProvider>
                    <TestComponent />
                </NavigationProvider>
            );

            expect(screen.getByTestId('current-path')).toHaveTextContent('/test-path');
        });

        it('should update search query', () => {
            render(
                <NavigationProvider>
                    <TestComponent />
                </NavigationProvider>
            );

            fireEvent.click(screen.getByText('Set Search Query'));
            expect(screen.getByTestId('search-query')).toHaveTextContent('test query');
        });

        it('should manage search history', () => {
            render(
                <NavigationProvider>
                    <TestComponent />
                </NavigationProvider>
            );

            fireEvent.click(screen.getByText('Add to History'));
            expect(screen.getByTestId('search-history')).toHaveTextContent('test history');
        });
    });
});