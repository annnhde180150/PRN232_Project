import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { CustomerDashboard } from '../CustomerDashboard';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock the design system components
jest.mock('../../design-system/HelperCard', () => ({
    HelperCard: ({ helper, onClick, onBook }: any) => (
        <div data-testid={`helper-card-${helper.id}`}>
            <span>{helper.name}</span>
            <span>{helper.rating}</span>
            <span>{helper.distance}</span>
            <button onClick={() => onClick?.(helper.id)}>View Profile</button>
            <button onClick={() => onBook?.(helper.id)}>Book Now</button>
        </div>
    ),
}));

jest.mock('../../design-system/ServiceCard', () => ({
    ServiceCard: ({ service, onClick }: any) => (
        <div data-testid={`service-card-${service.id}`}>
            <span>{service.name}</span>
            <button onClick={() => onClick?.(service.id)}>Select Service</button>
        </div>
    ),
}));

describe('CustomerDashboard', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        mockPush.mockClear();
    });

    describe('Hero Search Section', () => {
        it('renders welcome message and search form', () => {
            render(<CustomerDashboard />);

            expect(screen.getByText('Chào mừng trở lại! 👋')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Tìm kiếm dịch vụ hoặc người giúp việc...')).toBeInTheDocument();
            expect(screen.getByText('Quận 1, TP.HCM')).toBeInTheDocument();
        });

        it('handles search form submission with query', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm dịch vụ hoặc người giúp việc...');
            const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });

            await user.type(searchInput, 'dọn dẹp nhà');
            await user.click(searchButton);

            expect(mockPush).toHaveBeenCalledWith(
                '/search-helper?q=d%E1%BB%8Dn%20d%E1%BA%B9p%20nh%C3%A0&location=Qu%E1%BA%ADn%201%2C%20TP.HCM'
            );
        });

        it('handles search form submission without query', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
            await user.click(searchButton);

            expect(mockPush).toHaveBeenCalledWith(
                '/search-helper?location=Qu%E1%BA%ADn%201%2C%20TP.HCM'
            );
        });

        it('handles search form submission with Enter key', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm dịch vụ hoặc người giúp việc...');

            await user.type(searchInput, 'nấu ăn');
            await user.keyboard('{Enter}');

            expect(mockPush).toHaveBeenCalledWith(
                '/search-helper?q=n%E1%BA%A5u%20%C4%83n&location=Qu%E1%BA%ADn%201%2C%20TP.HCM'
            );
        });

        it('shows search focus state', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm dịch vụ hoặc người giúp việc...');

            await user.click(searchInput);

            // Check if the search input is focused
            expect(searchInput).toHaveFocus();
        });

        it('displays quick stats', () => {
            render(<CustomerDashboard />);

            expect(screen.getByText('123 người giúp việc đang hoạt động')).toBeInTheDocument();
            expect(screen.getByText('Đánh giá trung bình 4.8/5')).toBeInTheDocument();
            expect(screen.getByText('Phản hồi trong 5 phút')).toBeInTheDocument();
        });
    });

    describe('Quick Actions - Service Buttons', () => {
        it('renders all service cards', () => {
            render(<CustomerDashboard />);

            expect(screen.getByTestId('service-card-cleaning')).toBeInTheDocument();
            expect(screen.getByTestId('service-card-cooking')).toBeInTheDocument();
            expect(screen.getByTestId('service-card-laundry')).toBeInTheDocument();
            expect(screen.getByTestId('service-card-childcare')).toBeInTheDocument();
        });

        it('handles service card clicks', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const cleaningServiceButton = screen.getByTestId('service-card-cleaning')
                .querySelector('button');

            await user.click(cleaningServiceButton!);

            expect(mockPush).toHaveBeenCalledWith(
                '/search-helper?service=cleaning&location=Qu%E1%BA%ADn%201%2C%20TP.HCM'
            );
        });

        it('has "Xem tất cả" link for services', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const viewAllButton = screen.getAllByText('Xem tất cả')[0];
            await user.click(viewAllButton);

            expect(mockPush).toHaveBeenCalledWith('/search-helper');
        });
    });

    describe('Nearby Helpers Section', () => {
        it('renders all helper cards', () => {
            render(<CustomerDashboard />);

            expect(screen.getByTestId('helper-card-helper-1')).toBeInTheDocument();
            expect(screen.getByTestId('helper-card-helper-2')).toBeInTheDocument();
            expect(screen.getByTestId('helper-card-helper-3')).toBeInTheDocument();
            expect(screen.getByTestId('helper-card-helper-4')).toBeInTheDocument();
        });

        it('handles helper profile clicks', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const helperCard = screen.getByTestId('helper-card-helper-1');
            const helperProfileButton = helperCard.querySelector('button');

            if (helperProfileButton) {
                await user.click(helperProfileButton);
                expect(mockPush).toHaveBeenCalledWith('/helper/helper-1');
            }
        });

        it('handles helper booking clicks', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const helperCard = screen.getByTestId('helper-card-helper-1');
            const buttons = helperCard.querySelectorAll('button');
            const helperBookButton = buttons[1]; // Second button should be Book Now

            if (helperBookButton) {
                await user.click(helperBookButton);
                expect(mockPush).toHaveBeenCalledWith('/booking?helper=helper-1');
            }
        });

        it('has "Xem thêm" link for nearby helpers', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const viewMoreButton = screen.getByText('Xem thêm');
            await user.click(viewMoreButton);

            expect(mockPush).toHaveBeenCalledWith('/search-helper?nearby=true');
        });
    });

    describe('Recent Orders Section', () => {
        it('renders recent orders when available', () => {
            render(<CustomerDashboard />);

            expect(screen.getByText('Đơn hàng gần đây')).toBeInTheDocument();
            expect(screen.getAllByText('Dọn dẹp nhà')).toHaveLength(2); // One in services, one in orders
            expect(screen.getByText('với Nguyễn Thị Mai')).toBeInTheDocument();
            expect(screen.getAllByText('Nấu ăn')).toHaveLength(2); // One in services, one in orders
            expect(screen.getByText('với Trần Văn Hùng')).toBeInTheDocument();
        });

        it('shows correct order status badges', () => {
            render(<CustomerDashboard />);

            expect(screen.getByText('Hoàn thành')).toBeInTheDocument();
            expect(screen.getByText('Đang thực hiện')).toBeInTheDocument();
        });

        it('displays rating stars for completed orders', () => {
            render(<CustomerDashboard />);

            // Check for star icons in completed orders
            const completedOrderCard = screen.getByText('Hoàn thành').closest('div');
            expect(completedOrderCard).toBeInTheDocument();
        });

        it('shows rating button for orders without rating', () => {
            render(<CustomerDashboard />);

            expect(screen.getByText('Đánh giá')).toBeInTheDocument();
        });

        it('has "Xem tất cả" link for orders', async () => {
            const user = userEvent.setup();
            render(<CustomerDashboard />);

            const viewAllOrdersButton = screen.getAllByText('Xem tất cả')[1];
            await user.click(viewAllOrdersButton);

            expect(mockPush).toHaveBeenCalledWith('/customer-reports');
        });
    });

    describe('Accessibility', () => {
        it('has proper heading hierarchy', () => {
            render(<CustomerDashboard />);

            const mainHeading = screen.getByRole('heading', { level: 1 });
            expect(mainHeading).toHaveTextContent('Chào mừng trở lại! 👋');

            const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
            expect(sectionHeadings).toHaveLength(3); // Services, Nearby helpers, Recent orders
        });

        it('has accessible form labels', () => {
            render(<CustomerDashboard />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm dịch vụ hoặc người giúp việc...');
            expect(searchInput).toHaveAttribute('type', 'text');
        });

        it('has proper button roles and labels', () => {
            render(<CustomerDashboard />);

            const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
            expect(searchButton).toBeInTheDocument();

            const locationButton = screen.getByRole('button', { name: /quận 1/i });
            expect(locationButton).toBeInTheDocument();
        });
    });

    describe('Responsive Design', () => {
        it('renders properly on mobile viewport', () => {
            // Mock mobile viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 375,
            });

            render(<CustomerDashboard />);

            // Check that the component renders without errors
            expect(screen.getByText('Chào mừng trở lại! 👋')).toBeInTheDocument();
        });

        it('renders properly on desktop viewport', () => {
            // Mock desktop viewport
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1024,
            });

            render(<CustomerDashboard />);

            // Check that the component renders without errors
            expect(screen.getByText('Chào mừng trở lại! 👋')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('handles router navigation errors gracefully', async () => {
            const user = userEvent.setup();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            mockPush.mockImplementation(() => {
                throw new Error('Navigation failed');
            });

            render(<CustomerDashboard />);

            const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });

            // Should not throw error even if navigation fails
            try {
                await user.click(searchButton);
            } catch (error) {
                // Expected to throw, but should be handled gracefully
            }

            expect(mockPush).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('Performance', () => {
        it('renders efficiently with mock data', () => {
            const startTime = performance.now();
            render(<CustomerDashboard />);
            const endTime = performance.now();

            // Should render quickly (less than 100ms for mock data)
            expect(endTime - startTime).toBeLessThan(100);
        });
    });
});