'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './Card';
import { HelperCard } from './HelperCard';
import { ServiceCard } from './ServiceCard';
import { OrderCard } from './OrderCard';
import { Button } from './Button';

// Sample data for demonstrations
const sampleHelper = {
    id: 'helper-1',
    name: 'Nguyễn Thị Mai',
    avatar: undefined,
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

const sampleService = {
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
};

const sampleOrder = {
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
        avatar: undefined,
        phone: '0901234567',
    },
    pricing: {
        amount: 120000,
        currency: '₫',
    },
    duration: '2 giờ',
    notes: 'Cần tập trung dọn dẹp phòng khách và bếp. Có thú cưng trong nhà.',
    createdAt: '2024-01-10T10:00:00Z',
};

/**
 * CardsDemo component showcasing all card variants and specialized cards
 */
export const CardsDemo: React.FC = () => {
    const [selectedCard, setSelectedCard] = React.useState<string | null>(null);

    const handleCardClick = (id: string) => {
        setSelectedCard(id);
        console.log('Card clicked:', id);
    };

    const handleBookHelper = (helperId: string) => {
        console.log('Book helper:', helperId);
    };

    const handleContactHelper = (helperId: string) => {
        console.log('Contact helper:', helperId);
    };

    const handleCancelOrder = (orderId: string) => {
        console.log('Cancel order:', orderId);
    };

    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
            <div className="text-center">
                <h1 className="text-h1 text-text-primary mb-2">Card Components Demo</h1>
                <p className="text-body text-text-secondary">
                    Showcase of all card variants and specialized card components
                </p>
            </div>

            {/* Base Card Variants */}
            <section>
                <h2 className="text-h2 text-text-primary mb-4">Base Card Variants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card variant="default">
                        <CardHeader>
                            <CardTitle>Default Card</CardTitle>
                            <CardDescription>Basic card with default styling</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-body-small text-text-secondary">
                                This is a default card with standard shadow and padding.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="small" fullWidth>Action</Button>
                        </CardFooter>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Elevated Card</CardTitle>
                            <CardDescription>Card with enhanced shadow</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-body-small text-text-secondary">
                                This card has a more prominent shadow for emphasis.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="small" fullWidth>Action</Button>
                        </CardFooter>
                    </Card>

                    <Card
                        variant="interactive"
                        onClick={() => handleCardClick('interactive-card')}
                        className="cursor-pointer"
                    >
                        <CardHeader>
                            <CardTitle>Interactive Card</CardTitle>
                            <CardDescription>Clickable card with hover effects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-body-small text-text-secondary">
                                Click me! This card has hover and focus states.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <div className="text-caption text-primary-600">Click to interact</div>
                        </CardFooter>
                    </Card>

                    <Card variant="outlined">
                        <CardHeader>
                            <CardTitle>Outlined Card</CardTitle>
                            <CardDescription>Card with border emphasis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-body-small text-text-secondary">
                                This card emphasizes the border styling.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="small" fullWidth>Action</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Helper Cards */}
            <section>
                <h2 className="text-h2 text-text-primary mb-4">Helper Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <HelperCard
                        helper={sampleHelper}
                        onClick={handleCardClick}
                        onBook={handleBookHelper}
                    />
                    <HelperCard
                        helper={{
                            ...sampleHelper,
                            id: 'helper-2',
                            name: 'Trần Văn Nam',
                            rating: 4.5,
                            reviewCount: 89,
                            services: ['Nấu ăn', 'Chăm sóc trẻ'],
                            isAvailable: false,
                            isVerified: false,
                        }}
                        onClick={handleCardClick}
                        onBook={handleBookHelper}
                    />
                    <HelperCard
                        helper={{
                            ...sampleHelper,
                            id: 'helper-3',
                            name: 'Lê Thị Hoa',
                            rating: 4.9,
                            reviewCount: 203,
                            services: ['Giặt ủi', 'Dọn dẹp nhà', 'Nấu ăn', 'Chăm sóc người già'],
                            priceRange: { min: 100000, max: 180000, currency: '₫' },
                        }}
                        onClick={handleCardClick}
                        onBook={handleBookHelper}
                        compact
                    />
                </div>
            </section>

            {/* Service Cards */}
            <section>
                <h2 className="text-h2 text-text-primary mb-4">Service Cards</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ServiceCard
                            service={sampleService}
                            onClick={handleCardClick}
                        />
                        <ServiceCard
                            service={{
                                ...sampleService,
                                id: 'service-2',
                                name: 'Nấu ăn',
                                description: 'Dịch vụ nấu ăn tại nhà với thực đơn đa dạng.',
                                icon: '👨‍🍳',
                                isPopular: false,
                                availableHelpers: 15,
                                category: 'Ẩm thực',
                            }}
                            onClick={handleCardClick}
                        />
                        <ServiceCard
                            service={{
                                ...sampleService,
                                id: 'service-3',
                                name: 'Giặt ủi',
                                description: 'Giặt ủi quần áo chuyên nghiệp.',
                                icon: '👔',
                                priceRange: { min: 50000, max: 80000, currency: '₫' },
                                isPopular: false,
                                availableHelpers: 31,
                                category: 'Giặt ủi',
                            }}
                            onClick={handleCardClick}
                            compact
                        />
                        <ServiceCard
                            service={{
                                ...sampleService,
                                id: 'service-4',
                                name: 'Chăm sóc trẻ',
                                description: 'Dịch vụ chăm sóc trẻ em an toàn và chuyên nghiệp.',
                                icon: '👶',
                                priceRange: { min: 120000, max: 200000, currency: '₫' },
                                isPopular: true,
                                availableHelpers: 8,
                                category: 'Chăm sóc',
                            }}
                            onClick={handleCardClick}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-h3 text-text-primary">Horizontal Layout</h3>
                        <div className="space-y-3">
                            <ServiceCard
                                service={sampleService}
                                onClick={handleCardClick}
                                layout="horizontal"
                            />
                            <ServiceCard
                                service={{
                                    ...sampleService,
                                    id: 'service-5',
                                    name: 'Chăm sóc người già',
                                    description: 'Dịch vụ chăm sóc người cao tuổi tận tâm và chu đáo.',
                                    icon: '👵',
                                    priceRange: { min: 150000, max: 250000, currency: '₫' },
                                    isPopular: false,
                                    availableHelpers: 12,
                                    category: 'Chăm sóc',
                                }}
                                onClick={handleCardClick}
                                layout="horizontal"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Order Cards */}
            <section>
                <h2 className="text-h2 text-text-primary mb-4">Order Cards</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <OrderCard
                        order={sampleOrder}
                        onClick={handleCardClick}
                        onContactHelper={handleContactHelper}
                        onCancelOrder={handleCancelOrder}
                    />
                    <OrderCard
                        order={{
                            ...sampleOrder,
                            id: 'order-987654321',
                            status: 'pending',
                            helper: undefined,
                            notes: undefined,
                        }}
                        onClick={handleCardClick}
                        onContactHelper={handleContactHelper}
                        onCancelOrder={handleCancelOrder}
                    />
                    <OrderCard
                        order={{
                            ...sampleOrder,
                            id: 'order-456789123',
                            status: 'completed',
                            serviceName: 'Nấu ăn',
                            scheduledDate: '10/01/2024',
                            scheduledTime: '18:00',
                        }}
                        onClick={handleCardClick}
                        onContactHelper={handleContactHelper}
                        onCancelOrder={handleCancelOrder}
                        compact
                    />
                    <OrderCard
                        order={{
                            ...sampleOrder,
                            id: 'order-789123456',
                            status: 'cancelled',
                            serviceName: 'Giặt ủi',
                            helper: undefined,
                        }}
                        onClick={handleCardClick}
                        onContactHelper={handleContactHelper}
                        onCancelOrder={handleCancelOrder}
                        showTimeline={false}
                    />
                </div>
            </section>

            {/* Selected Card Info */}
            {selectedCard && (
                <section className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <h3 className="text-h4 text-primary-700 mb-2">Selected Card</h3>
                    <p className="text-body text-primary-600">
                        You clicked on card: <strong>{selectedCard}</strong>
                    </p>
                    <Button
                        size="small"
                        variant="ghost"
                        onClick={() => setSelectedCard(null)}
                        className="mt-2"
                    >
                        Clear Selection
                    </Button>
                </section>
            )}
        </div>
    );
};