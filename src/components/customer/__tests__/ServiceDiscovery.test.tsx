import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceDiscovery, ServiceDiscoveryFilters } from '../ServiceDiscovery';
import { HelperSearchResult } from '@/types/reports';

// Mock the lucide-react icons to avoid issues in tests
jest.mock('lucide-react', () => ({
    Search: () => <div data-testid="search-icon" />,
    Filter: () => <div data-testid="filter-icon" />,
    MapPin: () => <div data-testid="mappin-icon" />,
    Star: () => <div data-testid="star-icon" />,
    Clock: () => <div data-testid="clock-icon" />,
    DollarSign: () => <div data-testid="dollar-icon" />,
    Map: () => <div data-testid="map-icon" />,
    Grid3X3: () => <div data-testid="grid-icon" />,
    SlidersHorizontal: () => <div data-testid="sliders-icon" />,
}));

// Mock data
const mockHelpers: HelperSearchResult[] = [
    {
        helperId: 1,
        helperName: 'Nguyễn Thị An',
        serviceName: 'Dọn dẹp nhà cửa',
        bio: 'Có 5 năm kinh nghiệm dọn dẹp nhà cửa, tỉ mỉ và cẩn thận',
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
    {
        helperId: 2,
        helperName: 'Trần Văn Bình',
        serviceName: 'Nấu ăn',
        bio: 'Chuyên nấu các món ăn gia đình, có thể nấu theo yêu cầu',
        rating: 4.2,
        basePrice: 200000,
        availableStatus: 'Busy',
        helperWorkAreas: [
            {
                workAreaId: 2,
                helperId: 2,
                city: 'Hồ Chí Minh',
                district: 'Quận 3',
                ward: 'Phường 1',
                latitude: 10.7769,
                longitude: 106.7009,
                radiusKm: 3,
                helper: null,
            },
        ],
    },
];

const defaultProps = {
    results: mockHelpers,
    loading: false,
    onSearch: jest.fn(),
    onFilterChange: jest.fn(),
    onHelperSelect: jest.fn(),
    onBookHelper: jest.fn(),
    onAddToFavorites: jest.fn(),
};

describe('ServiceDiscovery', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('renders search input correctly', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, khu vực...');
            expect(searchInput).toBeInTheDocument();
        });

        it('displays results count', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            expect(screen.getByText('Tìm thấy 2 người giúp việc')).toBeInTheDocument();
        });

        it('displays helper cards', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            expect(screen.getByText('Nguyễn Thị An')).toBeInTheDocument();
            expect(screen.getByText('Trần Văn Bình')).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        it('calls onSearch when user types in search input', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, khu vực...');
            await user.type(searchInput, 'Nguyễn');

            expect(defaultProps.onSearch).toHaveBeenCalledWith('Nguyễn');
        });
    });

    describe('Filter Panel', () => {
        it('shows filter panel when filter button is clicked', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            const filterButton = screen.getByText('Bộ lọc');
            await user.click(filterButton);

            expect(screen.getByText('Bộ lọc tìm kiếm')).toBeInTheDocument();
        });

        it('filters by price range', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            // Open filters
            const filterButton = screen.getByText('Bộ lọc');
            await user.click(filterButton);

            // Set price range
            const minPriceInput = screen.getByPlaceholderText('Từ');
            const maxPriceInput = screen.getByPlaceholderText('Đến');

            await user.clear(minPriceInput);
            await user.type(minPriceInput, '120000');
            await user.clear(maxPriceInput);
            await user.type(maxPriceInput, '180000');

            expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    priceRange: [120000, 180000],
                })
            );
        });

        it('clears filters when clear button is clicked', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            // Open filters
            const filterButton = screen.getByText('Bộ lọc');
            await user.click(filterButton);

            // Click clear filters
            const clearButton = screen.getByText('Xóa bộ lọc');
            await user.click(clearButton);

            expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
                priceRange: [0, 1000000],
                rating: 0,
                distance: 50,
                availability: 'all',
                sortBy: 'relevance',
            });
        });
    });

    describe('Helper Profile Cards', () => {
        it('displays helper information correctly', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            // Check first helper
            expect(screen.getByText('Nguyễn Thị An')).toBeInTheDocument();
            expect(screen.getByText('Dọn dẹp nhà cửa')).toBeInTheDocument();
            expect(screen.getByText('4.8')).toBeInTheDocument();
            expect(screen.getByText(/150,000/)).toBeInTheDocument();
        });

        it('calls onHelperSelect when helper card is clicked', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            const helperName = screen.getByText('Nguyễn Thị An');
            await user.click(helperName);

            expect(defaultProps.onHelperSelect).toHaveBeenCalledWith(mockHelpers[0]);
        });

        it('calls onBookHelper when book button is clicked', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            const bookButtons = screen.getAllByText('Đặt ngay');
            await user.click(bookButtons[0]);

            expect(defaultProps.onBookHelper).toHaveBeenCalledWith(1);
        });

        it('calls onAddToFavorites when favorite button is clicked', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            const favoriteButtons = screen.getAllByText('Yêu thích');
            await user.click(favoriteButtons[0]);

            expect(defaultProps.onAddToFavorites).toHaveBeenCalledWith(1);
        });

        it('disables book button for busy helpers', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            const bookButtons = screen.getAllByText('Đặt ngay');

            // First helper is available - button should be enabled
            expect(bookButtons[0]).not.toBeDisabled();

            // Second helper is busy - button should be disabled
            expect(bookButtons[1]).toBeDisabled();
        });
    });

    describe('Loading States', () => {
        it('shows loading skeleton when loading is true', () => {
            render(<ServiceDiscovery {...defaultProps} loading={true} />);

            // Should show loading skeletons
            const skeletons = document.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('shows empty state when no results', () => {
            render(<ServiceDiscovery {...defaultProps} results={[]} />);

            expect(screen.getByText('Không tìm thấy kết quả')).toBeInTheDocument();
            expect(screen.getByText('Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm')).toBeInTheDocument();
        });
    });

    describe('View Mode Toggle', () => {
        it('renders grid view by default', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            // Should show helper cards in grid view
            expect(screen.getByText('Nguyễn Thị An')).toBeInTheDocument();
        });

        it('shows map view placeholder when map view is selected', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            // Find the map view button by looking for buttons with specific classes
            const buttons = screen.getAllByRole('button');
            const mapViewButton = buttons.find(button =>
                button.className.includes('rounded-l-none')
            );

            if (mapViewButton) {
                await user.click(mapViewButton);

                // Should show map view placeholder
                expect(screen.getByText('Chế độ xem bản đồ')).toBeInTheDocument();
                expect(screen.getByText('Tính năng bản đồ sẽ được triển khai trong phiên bản tiếp theo')).toBeInTheDocument();
            }
        });
    });

    describe('Accessibility', () => {
        it('has accessible search input', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, khu vực...');
            expect(searchInput).toBeInTheDocument();
        });

        it('has accessible filter button', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            const filterButton = screen.getByText('Bộ lọc');
            expect(filterButton).toHaveAttribute('type', 'button');
        });

        it('supports keyboard navigation', async () => {
            const user = userEvent.setup();
            render(<ServiceDiscovery {...defaultProps} />);

            const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên, khu vực...');

            // Tab to search input
            await user.tab();
            expect(searchInput).toHaveFocus();

            // Type in search
            await user.type(searchInput, 'test');
            expect(defaultProps.onSearch).toHaveBeenCalledWith('test');
        });
    });

    describe('Responsive Design', () => {
        it('renders correctly with responsive grid classes', () => {
            render(<ServiceDiscovery {...defaultProps} />);

            // Check that grid layout classes are present
            const gridContainer = document.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
            expect(gridContainer).toBeInTheDocument();
        });
    });
});