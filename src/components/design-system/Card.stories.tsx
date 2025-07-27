import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './Card';
import { HelperCard } from './HelperCard';
import { ServiceCard } from './ServiceCard';
import { OrderCard } from './OrderCard';
import { Button } from './Button';

// Base Card Stories
const meta: Meta<typeof Card> = {
    title: 'Design System/Cards/Base Card',
    component: Card,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Base Card component with multiple variants and configurations.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'elevated', 'interactive', 'outlined'],
            description: 'Visual variant of the card',
        },
        padding: {
            control: 'select',
            options: ['none', 'small', 'medium', 'large'],
            description: 'Internal padding of the card',
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large', 'full'],
            description: 'Maximum width of the card',
        },
        asButton: {
            control: 'boolean',
            description: 'Render card as a button element',
        },
        animated: {
            control: 'boolean',
            description: 'Enable fade-in animation',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Card Stories
export const Default: Story = {
    args: {
        variant: 'default',
        padding: 'medium',
        size: 'medium',
    },
    render: (args) => (
        <Card {...args}>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>This is a card description that provides context.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-body-small text-text-secondary">
                    This is the main content area of the card. You can put any content here.
                </p>
            </CardContent>
            <CardFooter>
                <Button size="small">Action</Button>
            </CardFooter>
        </Card>
    ),
};

export const Elevated: Story = {
    args: {
        variant: 'elevated',
        padding: 'medium',
        size: 'medium',
    },
    render: (args) => (
        <Card {...args}>
            <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>This card has enhanced shadow for emphasis.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-body-small text-text-secondary">
                    Elevated cards are great for highlighting important content.
                </p>
            </CardContent>
        </Card>
    ),
};

export const Interactive: Story = {
    args: {
        variant: 'interactive',
        padding: 'medium',
        size: 'medium',
    },
    render: (args) => (
        <Card {...args} onClick={() => alert('Card clicked!')}>
            <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Click me! This card has hover and focus states.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-body-small text-text-secondary">
                    Interactive cards respond to user interactions with visual feedback.
                </p>
            </CardContent>
        </Card>
    ),
};

export const Outlined: Story = {
    args: {
        variant: 'outlined',
        padding: 'medium',
        size: 'medium',
    },
    render: (args) => (
        <Card {...args}>
            <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>This card emphasizes the border styling.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-body-small text-text-secondary">
                    Outlined cards work well for secondary content or forms.
                </p>
            </CardContent>
        </Card>
    ),
};

export const WithoutPadding: Story = {
    args: {
        variant: 'default',
        padding: 'none',
        size: 'medium',
    },
    render: (args) => (
        <Card {...args}>
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-h5 font-semibold">Custom Layout</h3>
            </div>
            <div className="p-4">
                <p className="text-body-small text-text-secondary">
                    This card has no default padding, allowing for custom layouts.
                </p>
            </div>
        </Card>
    ),
};

// Helper Card Stories
const helperCardMeta: Meta<typeof HelperCard> = {
    title: 'Design System/Cards/Helper Card',
    component: HelperCard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Specialized card for displaying helper profile information.',
            },
        },
    },
    tags: ['autodocs'],
};

export const HelperCardDefault: StoryObj<typeof HelperCard> = {
    ...helperCardMeta,
    args: {
        helper: {
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
        },
    },
};

export const HelperCardUnavailable: StoryObj<typeof HelperCard> = {
    ...helperCardMeta,
    args: {
        helper: {
            id: 'helper-2',
            name: 'Trần Văn Nam',
            rating: 4.5,
            reviewCount: 89,
            services: ['Nấu ăn', 'Chăm sóc trẻ'],
            priceRange: {
                min: 100000,
                max: 150000,
                currency: '₫',
            },
            distance: '2.5km',
            isAvailable: false,
            isVerified: false,
        },
    },
};

export const HelperCardCompact: StoryObj<typeof HelperCard> = {
    ...helperCardMeta,
    args: {
        helper: {
            id: 'helper-3',
            name: 'Lê Thị Hoa',
            rating: 4.9,
            reviewCount: 203,
            services: ['Giặt ủi', 'Dọn dẹp nhà', 'Nấu ăn', 'Chăm sóc người già'],
            priceRange: {
                min: 100000,
                max: 180000,
                currency: '₫',
            },
            distance: '0.8km',
            isAvailable: true,
            isVerified: true,
        },
        compact: true,
    },
};

// Service Card Stories
const serviceCardMeta: Meta<typeof ServiceCard> = {
    title: 'Design System/Cards/Service Card',
    component: ServiceCard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Specialized card for displaying service information.',
            },
        },
    },
    tags: ['autodocs'],
};

export const ServiceCardDefault: StoryObj<typeof ServiceCard> = {
    ...serviceCardMeta,
    args: {
        service: {
            id: 'service-1',
            name: 'Dọn dẹp nhà cửa',
            description: 'Dịch vụ dọn dẹp nhà cửa chuyên nghiệp, bao gồm lau chùi, hút bụi, sắp xếp đồ đạc.',
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
        },
    },
};

export const ServiceCardHorizontal: StoryObj<typeof ServiceCard> = {
    ...serviceCardMeta,
    args: {
        service: {
            id: 'service-2',
            name: 'Nấu ăn',
            description: 'Dịch vụ nấu ăn tại nhà với thực đơn đa dạng và nguyên liệu tươi ngon.',
            icon: '👨‍🍳',
            priceRange: {
                min: 120000,
                max: 200000,
                currency: '₫',
            },
            duration: 'bữa',
            isPopular: false,
            availableHelpers: 15,
            category: 'Ẩm thực',
        },
        layout: 'horizontal',
    },
};

export const ServiceCardCompact: StoryObj<typeof ServiceCard> = {
    ...serviceCardMeta,
    args: {
        service: {
            id: 'service-3',
            name: 'Giặt ủi',
            icon: '👔',
            priceRange: {
                min: 50000,
                max: 80000,
                currency: '₫',
            },
            availableHelpers: 31,
            category: 'Giặt ủi',
        },
        compact: true,
    },
};

// Order Card Stories
const orderCardMeta: Meta<typeof OrderCard> = {
    title: 'Design System/Cards/Order Card',
    component: OrderCard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Specialized card for displaying order information and status.',
            },
        },
    },
    tags: ['autodocs'],
};

export const OrderCardInProgress: StoryObj<typeof OrderCard> = {
    ...orderCardMeta,
    args: {
        order: {
            id: 'order-123456789',
            serviceType: 'cleaning',
            serviceName: 'Dọn dẹp nhà cửa',
            status: 'in_progress',
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
            notes: 'Cần tập trung dọn dẹp phòng khách và bếp. Có thú cưng trong nhà.',
            createdAt: '2024-01-10T10:00:00Z',
        },
    },
};

export const OrderCardPending: StoryObj<typeof OrderCard> = {
    ...orderCardMeta,
    args: {
        order: {
            id: 'order-987654321',
            serviceType: 'cooking',
            serviceName: 'Nấu ăn',
            status: 'pending',
            scheduledDate: '16/01/2024',
            scheduledTime: '18:00',
            address: '456 Đường DEF, Phường UVW, Quận 3, TP.HCM',
            pricing: {
                amount: 180000,
                currency: '₫',
            },
            duration: '1 bữa',
            createdAt: '2024-01-15T08:00:00Z',
        },
    },
};

export const OrderCardCompleted: StoryObj<typeof OrderCard> = {
    ...orderCardMeta,
    args: {
        order: {
            id: 'order-456789123',
            serviceType: 'laundry',
            serviceName: 'Giặt ủi',
            status: 'completed',
            scheduledDate: '10/01/2024',
            scheduledTime: '09:00',
            address: '789 Đường GHI, Phường RST, Quận 7, TP.HCM',
            helper: {
                id: 'helper-2',
                name: 'Trần Văn Nam',
                phone: '0907654321',
            },
            pricing: {
                amount: 60000,
                currency: '₫',
            },
            duration: '3 giờ',
            createdAt: '2024-01-08T15:00:00Z',
        },
    },
};

export const OrderCardCancelled: StoryObj<typeof OrderCard> = {
    ...orderCardMeta,
    args: {
        order: {
            id: 'order-789123456',
            serviceType: 'childcare',
            serviceName: 'Chăm sóc trẻ',
            status: 'cancelled',
            scheduledDate: '20/01/2024',
            scheduledTime: '08:00',
            address: '321 Đường JKL, Phường MNO, Quận 5, TP.HCM',
            pricing: {
                amount: 200000,
                currency: '₫',
            },
            duration: '4 giờ',
            createdAt: '2024-01-18T12:00:00Z',
        },
        showTimeline: false,
    },
};