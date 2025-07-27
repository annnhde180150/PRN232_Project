import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../Card';
import { HelperCard } from '../HelperCard';
import { ServiceCard } from '../ServiceCard';
import { OrderCard } from '../OrderCard';

// Mock data for tests
const mockHelper = {
    id: 'helper-1',
    name: 'Nguyễn Thị Mai',
    rating: 4.8,
    reviewCount: 127,
    services: ['Dọn dẹp nhà', 'Nấu ăn', 'Giặt ủi'],
    priceRange: {
        min: 80000,
        max: 120000,
        currency: '₫',
    },
    distance: '1.2km',
    isAvailable: true,
    isVerified: true,
};

const mockService = {
    id: 'service-1',
    name: 'Dọn dẹp nhà cửa',
    description: 'Dịch vụ dọn dẹp nhà cửa chuyên nghiệp',
    icon: '🏠',
    priceRange: {
        min: 80000,
        max: 150000,
        currency: '₫',
    },
    duration: 'giờ',
    isPopular: true,
    availableHelpers: 23,
    category: 'Dọn dẹp',
};

const mockOrder = {
    id: 'order-123456789',
    serviceType: 'cleaning',
    serviceName: 'Dọn dẹp nhà cửa',
    status: 'in_progress' as const,
    scheduledDate: '15/01/2024',
    scheduledTime: '14:00',
    address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    helper: {
        id: 'helper-1',
        name: 'Nguyễn Thị Mai',
        phone: '0901234567',
    },
    pricing: {
        amount: 120000,
        currency: '₫',
    },
    duration: '2 giờ',
    notes: 'Cần tập trung dọn dẹp phòng khách và bếp.',
    createdAt: '2024-01-10T10:00:00Z',
};

describe('Base Card Component', () => {
    it('renders with default props', () => {
        render(
            <Card>
                <CardContent>Test content</CardContent>
            </Card>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('applies correct variant classes', () => {
        const { rerender } = render(
            <Card variant="default" data-testid="card">
                <CardContent>Content</CardContent>
            </Card>
        );

        expect(screen.getByTestId('card')).toHaveClass('shadow-md');

        rerender(
            <Card variant="elevated" data-testid="card">
                <CardContent>Content</CardContent>
            </Card>
        );

        expect(screen.getByTestId('card')).toHaveClass('shadow-lg');

        rerender(
            <Card variant="interactive" data-testid="card">
                <CardContent>Content</CardContent>
            </Card>
        );

        expect(screen.getByTestId('card')).toHaveClass('cursor-pointer');
    });

    it('handles click events when interactive', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(
            <Card variant="interactive" onClick={handleClick}>
                <CardContent>Clickable content</CardContent>
            </Card>
        );

        await user.click(screen.getByText('Clickable content'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
        render(
            <Card className="custom-class" data-testid="card">
                <CardContent>Content</CardContent>
            </Card>
        );

        expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
});

describe('Card Sub-components', () => {
    it('renders CardHeader with title and description', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Test Title</CardTitle>
                    <CardDescription>Test Description</CardDescription>
                </CardHeader>
            </Card>
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('renders CardFooter with actions', () => {
        render(
            <Card>
                <CardFooter>
                    <button>Action Button</button>
                </CardFooter>
            </Card>
        );

        expect(screen.getByText('Action Button')).toBeInTheDocument();
    });
});

describe('HelperCard Component', () => {
    it('renders helper information correctly', () => {
        render(<HelperCard helper={mockHelper} />);

        expect(screen.getByText('Nguyễn Thị Mai')).toBeInTheDocument();
        expect(screen.getByText('(4.8)')).toBeInTheDocument();
        expect(screen.getByText('1.2km')).toBeInTheDocument();
        expect(screen.getByText(/80\.000/)).toBeInTheDocument();
        expect(screen.getByText(/120\.000/)).toBeInTheDocument();
        expect(screen.getByText('Đặt ngay')).toBeInTheDocument();
    });

    it('shows verification badge when helper is verified', () => {
        const { container } = render(<HelperCard helper={mockHelper} />);

        // Check for verification badge (checkmark icon)
        const verificationBadge = container.querySelector('.bg-success-500');
        expect(verificationBadge).toBeInTheDocument();
    });

    it('handles unavailable helper correctly', () => {
        const unavailableHelper = { ...mockHelper, isAvailable: false };
        render(<HelperCard helper={unavailableHelper} />);

        expect(screen.getByText('Không có sẵn')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Không có sẵn/ })).toBeDisabled();
    });

    it('calls onClick when card is clicked', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<HelperCard helper={mockHelper} onClick={handleClick} />);

        await user.click(screen.getByRole('button', { name: /View.*profile/ }));
        expect(handleClick).toHaveBeenCalledWith('helper-1');
    });

    it('calls onBook when book button is clicked', async () => {
        const user = userEvent.setup();
        const handleBook = jest.fn();

        render(<HelperCard helper={mockHelper} onBook={handleBook} />);

        await user.click(screen.getByText('Đặt ngay'));
        expect(handleBook).toHaveBeenCalledWith('helper-1');
    });

    it('displays service tags correctly', () => {
        render(<HelperCard helper={mockHelper} />);

        expect(screen.getByText('Dọn dẹp nhà')).toBeInTheDocument();
        expect(screen.getByText('Nấu ăn')).toBeInTheDocument();
        expect(screen.getByText('Giặt ủi')).toBeInTheDocument();
    });

    it('truncates service tags when there are many', () => {
        const helperWithManyServices = {
            ...mockHelper,
            services: ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'],
        };

        render(<HelperCard helper={helperWithManyServices} />);

        expect(screen.getByText('+2')).toBeInTheDocument();
    });
});

describe('ServiceCard Component', () => {
    it('renders service information correctly', () => {
        render(<ServiceCard service={mockService} />);

        expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
        expect(screen.getByText('Dịch vụ dọn dẹp nhà cửa chuyên nghiệp')).toBeInTheDocument();
        expect(screen.getByText(/80\.000/)).toBeInTheDocument();
        expect(screen.getByText(/150\.000/)).toBeInTheDocument();
        expect(screen.getByText('23 người giúp việc có sẵn')).toBeInTheDocument();
    });

    it('shows popular badge when service is popular', () => {
        render(<ServiceCard service={mockService} />);

        expect(screen.getByText('Phổ biến')).toBeInTheDocument();
    });

    it('handles service without description', () => {
        const serviceWithoutDescription = { ...mockService, description: undefined };
        render(<ServiceCard service={serviceWithoutDescription} />);

        expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
        expect(screen.queryByText('Dịch vụ dọn dẹp nhà cửa chuyên nghiệp')).not.toBeInTheDocument();
    });

    it('renders in compact mode', () => {
        render(<ServiceCard service={mockService} compact />);

        // Description should not be shown in compact mode
        expect(screen.queryByText('Dịch vụ dọn dẹp nhà cửa chuyên nghiệp')).not.toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<ServiceCard service={mockService} onClick={handleClick} />);

        await user.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledWith('service-1');
    });
});

describe('OrderCard Component', () => {
    it('renders order information correctly', () => {
        render(<OrderCard order={mockOrder} />);

        expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
        expect(screen.getByText(/23456789/)).toBeInTheDocument(); // Last 8 chars of ID
        expect(screen.getByText('15/01/2024 lúc 14:00')).toBeInTheDocument();
        expect(screen.getByText('123 Đường ABC, Phường XYZ, Quận 1, TP.HCM')).toBeInTheDocument();
        expect(screen.getByText(/120\.000/)).toBeInTheDocument();
    });

    it('shows correct status badge', () => {
        const { container } = render(<OrderCard order={mockOrder} />);

        // Look for status badge with specific styling
        const statusBadge = container.querySelector('.text-primary-700');
        expect(statusBadge).toBeInTheDocument();
    });

    it('renders helper information when available', () => {
        render(<OrderCard order={mockOrder} />);

        expect(screen.getByText('Nguyễn Thị Mai')).toBeInTheDocument();
        expect(screen.getByText('Người giúp việc')).toBeInTheDocument();
    });

    it('shows contact button for confirmed/in-progress orders with helper', () => {
        render(<OrderCard order={mockOrder} />);

        expect(screen.getByText('Liên hệ')).toBeInTheDocument();
    });

    it('shows cancel button for pending/confirmed orders', () => {
        const pendingOrder = { ...mockOrder, status: 'pending' as const };
        render(<OrderCard order={pendingOrder} />);

        expect(screen.getByText('Hủy')).toBeInTheDocument();
    });

    it('handles cancelled orders correctly', () => {
        const cancelledOrder = { ...mockOrder, status: 'cancelled' as const };
        render(<OrderCard order={cancelledOrder} showTimeline={true} />);

        expect(screen.getByText('Đã hủy')).toBeInTheDocument();
        expect(screen.getByText('Đơn hàng đã bị hủy')).toBeInTheDocument();
    });

    it('calls onClick when card is clicked', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<OrderCard order={mockOrder} onClick={handleClick} />);

        await user.click(screen.getByRole('button', { name: /View order.*details/ }));
        expect(handleClick).toHaveBeenCalledWith('order-123456789');
    });

    it('calls onContactHelper when contact button is clicked', async () => {
        const user = userEvent.setup();
        const handleContact = jest.fn();

        render(<OrderCard order={mockOrder} onContactHelper={handleContact} />);

        await user.click(screen.getByText('Liên hệ'));
        expect(handleContact).toHaveBeenCalledWith('helper-1');
    });

    it('calls onCancelOrder when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const handleCancel = jest.fn();
        const pendingOrder = { ...mockOrder, status: 'pending' as const };

        render(<OrderCard order={pendingOrder} onCancelOrder={handleCancel} />);

        await user.click(screen.getByText('Hủy'));
        expect(handleCancel).toHaveBeenCalledWith('order-123456789');
    });

    it('shows notes when available and not compact', () => {
        render(<OrderCard order={mockOrder} />);

        expect(screen.getByText('Ghi chú:')).toBeInTheDocument();
        expect(screen.getByText('Cần tập trung dọn dẹp phòng khách và bếp.')).toBeInTheDocument();
    });
});

describe('Accessibility', () => {
    it('cards have proper ARIA labels', () => {
        render(<HelperCard helper={mockHelper} />);

        expect(screen.getByRole('button', { name: /View.*profile/ })).toBeInTheDocument();
    });

    it('cards support keyboard navigation', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<ServiceCard service={mockService} onClick={handleClick} />);

        const card = screen.getByRole('button');

        // Tab to focus
        await user.tab();
        expect(card).toHaveFocus();

        // Enter to activate
        await user.keyboard('{Enter}');
        expect(handleClick).toHaveBeenCalled();
    });

    it('disabled buttons are not focusable', () => {
        const unavailableHelper = { ...mockHelper, isAvailable: false };
        render(<HelperCard helper={unavailableHelper} />);

        const bookButton = screen.getByRole('button', { name: /Không có sẵn/ });
        expect(bookButton).toBeDisabled();
    });
});