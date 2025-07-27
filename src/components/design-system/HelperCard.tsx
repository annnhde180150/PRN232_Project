import * as React from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { cn } from '@/lib/utils';

// Star rating component
const StarRating = ({ rating, maxRating = 5, className }: {
    rating: number;
    maxRating?: number;
    className?: string;
}) => {
    return (
        <div className={cn('flex items-center gap-1', className)} aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
            {Array.from({ length: maxRating }, (_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= rating;
                const isHalfFilled = starValue - 0.5 <= rating && starValue > rating;

                return (
                    <svg
                        key={index}
                        className={cn(
                            'size-4',
                            isFilled ? 'text-warning-500' : isHalfFilled ? 'text-warning-500' : 'text-gray-300'
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        {isHalfFilled ? (
                            <defs>
                                <linearGradient id={`half-${index}`}>
                                    <stop offset="50%" stopColor="currentColor" />
                                    <stop offset="50%" stopColor="#d1d5db" />
                                </linearGradient>
                            </defs>
                        ) : null}
                        <path
                            fillRule="evenodd"
                            d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
                            clipRule="evenodd"
                            fill={isHalfFilled ? `url(#half-${index})` : 'currentColor'}
                        />
                    </svg>
                );
            })}
            <span className="text-body-small text-text-secondary ml-1">
                ({rating.toFixed(1)})
            </span>
        </div>
    );
};

// Service tag component
const ServiceTag = ({ children, className }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <span
        className={cn(
            'inline-flex items-center px-2 py-1 rounded-md text-caption',
            'bg-primary-50 text-primary-700 border border-primary-200',
            className
        )}
    >
        {children}
    </span>
);

// Distance indicator component
const DistanceIndicator = ({ distance, className }: {
    distance: string;
    className?: string;
}) => (
    <div className={cn('flex items-center gap-1 text-body-small text-text-secondary', className)}>
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{distance}</span>
    </div>
);

export interface HelperCardProps {
    /**
     * Helper's profile information
     */
    helper: {
        id: string;
        name: string;
        avatar?: string;
        rating: number;
        reviewCount: number;
        services: string[];
        priceRange: {
            min: number;
            max: number;
            currency: string;
        };
        distance: string;
        isAvailable: boolean;
        isVerified?: boolean;
    };
    /**
     * Callback when the card is clicked
     */
    onClick?: (helperId: string) => void;
    /**
     * Callback when the book button is clicked
     */
    onBook?: (helperId: string) => void;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * If true, shows a compact version of the card
     */
    compact?: boolean;
}

/**
 * HelperCard component for displaying helper profile information
 * 
 * Features:
 * - Helper profile photo, name, and rating
 * - Service tags and pricing information
 * - Distance indicator and availability status
 * - Verification badge
 * - Interactive hover states
 * - Responsive design
 * - Accessibility compliant
 */
export const HelperCard = React.forwardRef<HTMLDivElement, HelperCardProps>(
    ({ helper, onClick, onBook, className, compact = false }, ref) => {
        const {
            id,
            name,
            avatar,
            rating,
            reviewCount,
            services,
            priceRange,
            distance,
            isAvailable,
            isVerified,
        } = helper;

        const handleCardClick = () => {
            onClick?.(id);
        };

        const handleBookClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            onBook?.(id);
        };

        return (
            <Card
                ref={ref}
                variant="interactive"
                padding="none"
                className={cn(
                    'group relative',
                    !isAvailable && 'opacity-75',
                    className
                )}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick();
                    }
                }}
                aria-label={`View ${name}'s profile`}
            >
                <CardContent className={cn('p-4', compact && 'p-3')}>
                    <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className={cn(
                                'rounded-full bg-gray-200 overflow-hidden',
                                compact ? 'size-12' : 'size-16'
                            )}>
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt={`${name}'s profile`}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="size-full flex items-center justify-center bg-primary-100 text-primary-600">
                                        <svg className="size-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Verification badge */}
                            {isVerified && (
                                <div className="absolute -bottom-1 -right-1 size-5 bg-success-500 rounded-full flex items-center justify-center">
                                    <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            {/* Availability indicator */}
                            <div className={cn(
                                'absolute top-0 right-0 size-3 rounded-full border-2 border-white',
                                isAvailable ? 'bg-success-500' : 'bg-gray-400'
                            )} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Name and rating */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <h3 className={cn(
                                        'font-semibold text-text-primary truncate',
                                        compact ? 'text-body-small' : 'text-body'
                                    )}>
                                        {name}
                                    </h3>
                                    <StarRating
                                        rating={rating}
                                        className={compact ? 'scale-90 origin-left' : ''}
                                    />
                                </div>
                                <DistanceIndicator
                                    distance={distance}
                                    className={compact ? 'text-caption' : ''}
                                />
                            </div>

                            {/* Services */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {services.slice(0, compact ? 2 : 3).map((service, index) => (
                                    <ServiceTag key={index} className={compact ? 'text-xs px-1.5 py-0.5' : ''}>
                                        {service}
                                    </ServiceTag>
                                ))}
                                {services.length > (compact ? 2 : 3) && (
                                    <ServiceTag className={cn('bg-gray-100 text-gray-600', compact ? 'text-xs px-1.5 py-0.5' : '')}>
                                        +{services.length - (compact ? 2 : 3)}
                                    </ServiceTag>
                                )}
                            </div>

                            {/* Price and book button */}
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    'font-semibold text-text-primary',
                                    compact ? 'text-body-small' : 'text-body'
                                )}>
                                    {priceRange.currency}{priceRange.min.toLocaleString()} - {priceRange.currency}{priceRange.max.toLocaleString()}
                                    <span className="text-text-secondary font-normal">/giờ</span>
                                </div>

                                <Button
                                    size={compact ? 'small' : 'medium'}
                                    variant={isAvailable ? 'primary' : 'secondary'}
                                    disabled={!isAvailable}
                                    onClick={handleBookClick}
                                    className="flex-shrink-0"
                                >
                                    {isAvailable ? 'Đặt ngay' : 'Không có sẵn'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
);

HelperCard.displayName = 'HelperCard';