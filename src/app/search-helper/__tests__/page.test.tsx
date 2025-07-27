import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchHelperPage from '../page';
import { searchHelpers, getAllServices } from '../../../lib/api';

// Mock the API functions
jest.mock('../../../lib/api', () => ({
    searchHelpers: jest.fn(),
    getAllServices: jest.fn(),
}));

const mockSearchHelpers = searchHelpers as jest.MockedFunction<typeof searchHelpers>;
const mockGetAllServices = getAllServices as jest.MockedFunction<typeof getAllServices>;

const mockServices = [
    {
        serviceId: 1,
        serviceName: 'Dọn dẹp nhà cửa',
        description: 'Dọn dẹp, lau chùi nhà cửa sạch sẽ',
        iconUrl: null,
        basePrice: 150000,
        priceUnit: 'giờ',
        isActive: true,
        parentServiceId: null,
    },
    {
        serviceId: 2,
        serviceName: 'Nấu ăn',
        description: 'Nấu các món ăn gia đình',
        iconUrl: null,
        basePrice: 200000,
        priceUnit: 'giờ',
        isActive: true,
        parentServiceId: null,
    },
];

const mockHelpers = [
    {
        helperId: 1,
        helperName: 'Nguyễn Thị An',
        serviceName: 'Dọn dẹp nhà cửa',
        bio: 'Có 5 năm kinh nghiệm dọn dẹp nhà cửa',
        rating: 4.8,
        basePrice: 150000,
        availableStatus: 'Available',
        helperWorkAreas: [
            {
                workAreaId: 1,
                helperId: 1,
                city: 'Hồ Chí Minh',
                district: 'Quận 1',
                ward: 'Phường Bến Nghé',
                latitude: 10.7769,
                longitude: 106.7009,
                radiusKm: 5,
                helper: null,
            },
        ],
    },
];

describe('SearchHelperPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetAllServices.mockResolvedValue(mockServices);
        mockSearchHelpers.mockResolvedValue({ data: mockHelpers });
    });

    describe('Initial Load', () => {
        it('renders page title and description', async () => {
            render(<SearchHelperPage />);

            expect(screen.getByText('Tìm Người Giúp Việc')).toBeInTheDocument();
            expect(screen.getByText('Tìm kiếm và đặt dịch vụ giúp việc nhà phù hợp với nhu cầu của bạn')).toBeInTheDocument();
        });

        it('loads and displays services on mount', async () => {
            render(<SearchHelperPage />);

            await waitFor(() => {
                expect(mockGetAllServices).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
                expect(screen.getByText('Nấu ăn')).toBeInTheDocument();
            });
        });

        it('shows loading state while fetching services', () => {
            render(<SearchHelperPage />);

            // Should show loading spinner initially
            expect(document.querySelector('.animate-spin')).toBeInTheDocument();
        });

        it('handles service loading error', async () => {
            mockGetAllServices.mockRejectedValue(new Error('Network error'));

            render(<SearchHelperPage />);

            await waitFor(() => {
                expect(screen.getByText('Không thể tải danh sách dịch vụ.')).toBeInTheDocument();
            });
        });
    });

    describe('Service Selection', () => {
        it('searches for helpers when service is selected', async () => {
            const user = userEvent.setup();
            render(<SearchHelperPage />);

            // Wait for services to load
            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            // Click on a service
            const serviceButton = screen.getByText('Dọn dẹp nhà cửa');
            await user.click(serviceButton);

            await waitFor(() => {
                expect(mockSearchHelpers).toHaveBeenCalledWith(1);
            });
        });

        it('shows selected service in results header', async () => {
            const user = userEvent.setup();
            render(<SearchHelperPage />);

            // Wait for services to load
            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            // Click on a service
            const serviceButton = screen.getByText('Dọn dẹp nhà cửa');
            await user.click(serviceButton);

            await waitFor(() => {
                expect(screen.getByText('Kết quả tìm kiếm cho "Dọn dẹp nhà cửa"')).toBeInTheDocument();
            });
        });

        it('shows loading state while searching helpers', async () => {
            const user = userEvent.setup();

            // Make the search take longer
            mockSearchHelpers.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({ data: mockHelpers }), 100))
            );

            render(<SearchHelperPage />);

            // Wait for services to load
            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            // Click on a service
            const serviceButton = screen.getByText('Dọn dẹp nhà cửa');
            await user.click(serviceButton);

            // Should show loading state in ServiceDiscovery component
            await waitFor(() => {
                expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
            });
        });

        it('handles helper search error', async () => {
            const user = userEvent.setup();
            mockSearchHelpers.mockRejectedValue(new Error('Search failed'));

            render(<SearchHelperPage />);

            // Wait for services to load
            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            // Click on a service
            const serviceButton = screen.getByText('Dọn dẹp nhà cửa');
            await user.click(serviceButton);

            await waitFor(() => {
                expect(screen.getByText('Không thể tìm kiếm. Vui lòng thử lại.')).toBeInTheDocument();
            });
        });
    });

    describe('Search and Filter Integration', () => {
        beforeEach(async () => {
            const user = userEvent.setup();
            render(<SearchHelperPage />);

            // Wait for services to load and select one
            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            const serviceButton = screen.getByText('Dọn dẹp nhà cửa');
            await user.click(serviceButton);

            await waitFor(() => {
                expect(screen.getByText('Nguyễn Thị An')).toBeInTheDocument();
            });
        });

        it('filters helpers by search query', async () => {
            const user = userEvent.setup();

            const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, khu vực...');
            await user.type(searchInput, 'Nguyễn');

            // Should still show the helper since name matches
            expect(screen.getByText('Nguyễn Thị An')).toBeInTheDocument();
        });

        it('shows no results when search query does not match', async () => {
            const user = userEvent.setup();

            const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, khu vực...');
            await user.type(searchInput, 'Không tồn tại');

            await waitFor(() => {
                expect(screen.getByText('Không tìm thấy kết quả')).toBeInTheDocument();
            });
        });

        it('filters by work area', async () => {
            const user = userEvent.setup();

            const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, khu vực...');
            await user.type(searchInput, 'Quận 1');

            // Should show the helper since work area matches
            expect(screen.getByText('Nguyễn Thị An')).toBeInTheDocument();
        });
    });

    describe('Helper Actions', () => {
        beforeEach(async () => {
            const user = userEvent.setup();
            render(<SearchHelperPage />);

            // Wait for services to load and select one
            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            const serviceButton = screen.getByText('Dọn dẹp nhà cửa');
            await user.click(serviceButton);

            await waitFor(() => {
                expect(screen.getByText('Nguyễn Thị An')).toBeInTheDocument();
            });
        });

        it('handles booking a helper', async () => {
            const user = userEvent.setup();

            // Mock window.alert
            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

            const bookButton = screen.getByText('Đặt ngay');
            await user.click(bookButton);

            expect(alertSpy).toHaveBeenCalledWith('Đặt dịch vụ với helper 1');

            alertSpy.mockRestore();
        });

        it('handles adding helper to favorites', async () => {
            const user = userEvent.setup();

            // Mock window.alert
            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

            const favoriteButton = screen.getByText('Yêu thích');
            await user.click(favoriteButton);

            expect(alertSpy).toHaveBeenCalledWith('Đã thêm helper 1 vào danh sách yêu thích');

            alertSpy.mockRestore();
        });

        it('handles selecting a helper for details', async () => {
            const user = userEvent.setup();

            // Mock console.log
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

            const helperName = screen.getByText('Nguyễn Thị An');
            await user.click(helperName);

            expect(consoleSpy).toHaveBeenCalledWith('Selected helper:', mockHelpers[0]);

            consoleSpy.mockRestore();
        });
    });

    describe('Responsive Design', () => {
        it('renders service grid responsively', async () => {
            render(<SearchHelperPage />);

            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            // Check that responsive grid classes are present
            const serviceGrid = document.querySelector('.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4.xl\\:grid-cols-6');
            expect(serviceGrid).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('displays error message in error card', async () => {
            const user = userEvent.setup();
            mockSearchHelpers.mockRejectedValue(new Error('Network error'));

            render(<SearchHelperPage />);

            // Wait for services to load
            await waitFor(() => {
                expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            });

            // Click on a service to trigger error
            const serviceButton = screen.getByText('Dọn dẹp nhà cửa');
            await user.click(serviceButton);

            await waitFor(() => {
                const errorCard = document.querySelector('.border-red-200.bg-red-50');
                expect(errorCard).toBeInTheDocument();
                expect(screen.getByText('Không thể tìm kiếm. Vui lòng thử lại.')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('has proper heading hierarchy', async () => {
            render(<SearchHelperPage />);

            const mainHeading = screen.getByRole('heading', { level: 1 });
            expect(mainHeading).toHaveTextContent('Tìm Người Giúp Việc');
        });

        it('has accessible service selection buttons', async () => {
            render(<SearchHelperPage />);

            await waitFor(() => {
                const serviceButtons = screen.getAllByRole('button');
                expect(serviceButtons.length).toBeGreaterThan(0);

                serviceButtons.forEach(button => {
                    expect(button).toHaveAttribute('type', 'button');
                });
            });
        });
    });
});