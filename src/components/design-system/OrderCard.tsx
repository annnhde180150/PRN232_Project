import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { cn } from '@/lib/utils';

// Order status type
export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

// Status configuration
const statusConfig: Record<OrderStatus, {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
}> = {
    pending: {
        label: 'Đang chờ',
        color: 'text-warning-700',
        bgColor: 'bg-warning-50',
        borderColor: 'border-warning-200',
        icon: (
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    confirmed: {
        label: 'Đã xác nhận',
        color: 'text-info-700',
        bgColor: 'bg-info-50',
        borderColor: 'border-info-200',
        icon: (
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    in_progress: {
        label: 'Đang thực hiện',
        color: 'text-primary-700',
        bgColor: 'bg-primary-50',
        borderColor: 'border-primary-200',
        icon: (
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    completed: {
        label: 'Hoàn thành',
        color: 'text-success-700',
        bgColor: 'bg-success-50',
        borderColor: 'border-success-200',
        icon: (
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    cancelled: {
        label: 'Đã hủy',
        color: 'text-error-700',
        bgColor: 'bg-error-50',
        borderColor: 'border-error-200',
        icon: (
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    },
};

// Status badge component
const StatusBadge = ({ status, className }: {
    status: OrderStatus;
    className?: string;
}) => {
    const config = statusConfig[status];

    return (
        <div className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-medium border',
            config.color,
            config.bgColor,
            config.borderColor,
            className
        )}>
            {config.icon}
            <span>{config.label}</span>
        </div>
    );
};

// Timeline component for order progress
const OrderTimeline = ({ status, className }: {
    status: OrderStatus;
    className?: string;
}) => {
    const steps: { key: OrderStatus; label: string }[] = [
        { key: 'pending', label: 'Đã đặt' },
        { key: 'confirmed', label: 'Đã xác nhận' },
        { key: 'in_progress', label: 'Đang thực hiện' },
        { key: 'completed', label: 'Hoàn thành' },
    ];

    const currentStepIndex = steps.findIndex(step => step.key === status);
    const isCancelled = status === 'cancelled';

    if (isCancelled) {
        return (
            <div className={cn('flex items-center gap-2 text-error-600', className)}>
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-body-small">Đơn hàng đã bị hủy</span>
            </div>
        );
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <React.Fragment key={step.key}>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                'size-3 rounded-full border-2 transition-colors duration-normal',
                                isCompleted
                                    ? 'bg-primary-500 border-primary-500'
                                    : 'bg-white border-gray-300'
                            )} />
                            <span className={cn(
                                'text-caption transition-colors duration-normal',
                                isCompleted ? 'text-text-primary font-medium' : 'text-text-secondary'
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                'h-px w-4 transition-colors duration-normal',
                                index < currentStepIndex ? 'bg-primary-500' : 'bg-gray-300'
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export interface OrderCardProps {
    /**
     * Order information
     */
    order: {
        id: string;
        serviceType: string;
        serviceName: string;
        status: OrderStatus;
        scheduledDate: string;
        scheduledTime: string;
        address: string;
        helper?: {
            id: string;
            name: string;
            avatar?: string;
            phone?: string;
        };
        pricing: {
            amount: number;
            currency: string;
        };
        duration?: string;
        notes?: string;
        createdAt: string;
    };
    /**
     * Callback when the card is clicked
     */
    onClick?: (orderId: string) => void;
    /**
     * Callback when contact helper is clicked
     */
    onContactHelper?: (helperId: string) => void;
    /**
     * Callback when cancel order is clicked
     */
    onCancelOrder?: (orderId: string) => void;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * If true, shows a compact version of the card
     */
    compact?: boolean;
    /**
     * If true, shows the timeline progress
     */
    showTimeline?: boolean;
}

/**
 * OrderCard component for displaying order information
 * 
 * Features:
 * - Order status with color-coded badges
 * - Service information and scheduling details
 * - Helper information with contact options
 * - Progress timeline for order status
 * - Action buttons (contact, cancel, etc.)
 * - Interactive hover states
 * - Responsive design
 * - Accessibility compliant
 */
export const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(
    ({
        order,
        onClick,
        onContactHelper,
        onCancelOrder,
        className,
        compact = false,
        showTimeline = true
    }, ref) => {
        const {
            id,
            serviceType,
            serviceName,
            status,
            scheduledDate,
            scheduledTime,
            address,
            helper,
            pricing,
            duration,
            notes,
        } = order;

        const handleCardClick = () => {
            onClick?.(id);
        };

        const handleContactHelper = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (helper) {
                onContactHelper?.(helper.id);
            }
        };

        const handleCancelOrder = (e: React.MouseEvent) => {
            e.stopPropagation();
            onCancelOrder?.(id);
        };

        const canCancel = status === 'pending' || status === 'confirmed';
        const canContact = helper && (status === 'confirmed' || status === 'in_progress');

        return (
            <Card
                ref={ref}
                variant="interactive"
                padding="none"
                className={cn('group', className)}
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick();
                    }
                }}
                aria-label={`View order ${id} details`}
            >
                <CardHeader className={cn('pb-3', compact && 'p-4 pb-2')}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <CardTitle className={cn(
                                'truncate',
                                compact ? 'text-body-small' : 'text-body'
                            )}>
                                {serviceName}
                            </CardTitle>
                            <div className={cn(
                                'text-text-secondary mt-1',
                                compact ? 'text-caption' : 'text-body-small'
                            )}>
                                Mã đơn: #{id.slice(-8).toUpperCase()}
                            </div>
                        </div>
                        <StatusBadge status={status} />
                    </div>
                </CardHeader>

                <CardContent className={cn('pt-0', compact && 'p-4 pt-0')}>
                    {/* Timeline */}
                    {showTimeline && !compact && (
                        <OrderTimeline status={status} className="mb-4" />
                    )}

                    {/* Schedule and location */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-body-small">
                            <svg className="size-4 text-text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-text-primary">
                                {scheduledDate} lúc {scheduledTime}
                                {duration && <span className="text-text-secondary"> ({duration})</span>}
                            </span>
                        </div>

                        <div className="flex items-start gap-2 text-body-small">
                            <svg className="size-4 text-text-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-text-primary line-clamp-2">{address}</span>
                        </div>
                    </div>

                    {/* Helper information */}
                    {helper && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                            <div className="size-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                {helper.avatar ? (
                                    <img
                                        src={helper.avatar}
                                        alt={`${helper.name}'s profile`}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="size-full flex items-center justify-center bg-primary-100 text-primary-600">
                                        <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-text-primary text-body-small">
                                    {helper.name}
                                </div>
                                <div className="text-caption text-text-secondary">
                                    Người giúp việc
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {notes && !compact && (
                        <div className="p-3 bg-gray-50 rounded-lg mb-4">
                            <div className="text-caption text-text-secondary mb-1">Ghi chú:</div>
                            <div className="text-body-small text-text-primary">{notes}</div>
                        </div>
                    )}

                    {/* Price and actions */}
                    <div className="flex items-center justify-between gap-3">
                        <div className={cn(
                            'font-semibold text-text-primary',
                            compact ? 'text-body-small' : 'text-body'
                        )}>
                            {pricing.currency}{pricing.amount.toLocaleString()}
                        </div>

                        <div className="flex items-center gap-2">
                            {canContact && (
                                <Button
                                    size="small"
                                    variant="ghost"
                                    onClick={handleContactHelper}
                                    leftIcon={
                                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    }
                                >
                                    Liên hệ
                                </Button>
                            )}

                            {canCancel && (
                                <Button
                                    size="small"
                                    variant="ghost"
                                    onClick={handleCancelOrder}
                                    className="text-error-600 hover:text-error-700 hover:bg-error-50"
                                >
                                    Hủy
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
);

OrderCard.displayName = 'OrderCard';