import * as React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '@/lib/utils';

// Service icon component
const ServiceIcon = ({ icon, className }: {
    icon: React.ReactNode | string;
    className?: string;
}) => {
    if (typeof icon === 'string') {
        return (
            <div className={cn(
                'size-12 rounded-lg bg-primary-100 flex items-center justify-center text-2xl',
                className
            )}>
                {icon}
            </div>
        );
    }

    return (
        <div className={cn(
            'size-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600',
            className
        )}>
            {icon}
        </div>
    );
};

// Popular badge component
const PopularBadge = ({ className }: { className?: string }) => (
    <div className={cn(
        'absolute top-2 right-2 px-2 py-1 rounded-md text-caption font-medium',
        'bg-warning-100 text-warning-700 border border-warning-200',
        className
    )}>
        Phổ biến
    </div>
);

export interface ServiceCardProps {
    /**
     * Service information
     */
    service: {
        id: string;
        name: string;
        description?: string;
        icon: React.ReactNode | string;
        priceRange: {
            min: number;
            max: number;
            currency: string;
        };
        duration?: string;
        isPopular?: boolean;
        availableHelpers?: number;
        category?: string;
    };
    /**
     * Callback when the card is clicked
     */
    onClick?: (serviceId: string) => void;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * If true, shows a compact version of the card
     */
    compact?: boolean;
    /**
     * Layout variant
     */
    layout?: 'vertical' | 'horizontal';
}

/**
 * ServiceCard component for displaying service information
 * 
 * Features:
 * - Service icon, name, and description
 * - Price range and duration information
 * - Popular badge for trending services
 * - Available helpers count
 * - Multiple layout options (vertical/horizontal)
 * - Interactive hover states
 * - Responsive design
 * - Accessibility compliant
 */
export const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
    ({
        service,
        onClick,
        className,
        compact = false,
        layout = 'vertical'
    }, ref) => {
        const {
            id,
            name,
            description,
            icon,
            priceRange,
            duration,
            isPopular,
            availableHelpers,
            category,
        } = service;

        const handleClick = () => {
            onClick?.(id);
        };

        const isHorizontal = layout === 'horizontal';

        return (
            <Card
                ref={ref}
                variant="interactive"
                padding="none"
                className={cn(
                    'group relative',
                    isHorizontal && 'flex-row',
                    className
                )}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
                aria-label={`Select ${name} service`}
            >
                {/* Popular badge */}
                {isPopular && <PopularBadge />}

                <CardContent className={cn(
                    'p-4',
                    compact && 'p-3',
                    isHorizontal && 'flex items-center gap-4'
                )}>
                    <div className={cn(
                        'flex flex-col',
                        isHorizontal ? 'flex-row items-center gap-4' : 'items-center text-center gap-3'
                    )}>
                        {/* Icon */}
                        <ServiceIcon
                            icon={icon}
                            className={cn(
                                'group-hover:scale-105 transition-transform duration-normal',
                                compact && 'size-10',
                                isHorizontal && 'flex-shrink-0'
                            )}
                        />

                        {/* Content */}
                        <div className={cn(
                            'flex-1',
                            isHorizontal ? 'text-left' : 'text-center'
                        )}>
                            {/* Category */}
                            {category && (
                                <div className={cn(
                                    'text-caption text-text-secondary uppercase tracking-wide mb-1',
                                    compact && 'text-xs'
                                )}>
                                    {category}
                                </div>
                            )}

                            {/* Name */}
                            <h3 className={cn(
                                'font-semibold text-text-primary mb-1',
                                compact ? 'text-body-small' : 'text-body',
                                isHorizontal && 'mb-2'
                            )}>
                                {name}
                            </h3>

                            {/* Description */}
                            {description && !compact && (
                                <p className={cn(
                                    'text-body-small text-text-secondary mb-3 line-clamp-2',
                                    isHorizontal && 'mb-2'
                                )}>
                                    {description}
                                </p>
                            )}

                            {/* Price and duration */}
                            <div className={cn(
                                'space-y-1',
                                isHorizontal && 'flex items-center gap-4 space-y-0'
                            )}>
                                <div className={cn(
                                    'font-semibold text-text-primary',
                                    compact ? 'text-body-small' : 'text-body'
                                )}>
                                    {priceRange.currency}{priceRange.min.toLocaleString()}
                                    {priceRange.min !== priceRange.max && (
                                        <> - {priceRange.currency}{priceRange.max.toLocaleString()}</>
                                    )}
                                    <span className="text-text-secondary font-normal">
                                        {duration ? `/${duration}` : '/giờ'}
                                    </span>
                                </div>

                                {/* Available helpers */}
                                {availableHelpers !== undefined && (
                                    <div className={cn(
                                        'flex items-center gap-1 text-body-small text-text-secondary',
                                        compact && 'text-caption'
                                    )}>
                                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        <span>
                                            {availableHelpers} người giúp việc có sẵn
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Arrow indicator for horizontal layout */}
                        {isHorizontal && (
                            <div className="flex-shrink-0 text-text-tertiary group-hover:text-primary-500 transition-colors duration-normal">
                                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }
);

ServiceCard.displayName = 'ServiceCard';