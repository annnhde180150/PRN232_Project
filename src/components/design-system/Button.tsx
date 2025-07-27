import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button variants based on design system specifications
const buttonVariants = cva(
    // Base styles - common to all buttons
    [
        'inline-flex items-center justify-center gap-2',
        'font-medium rounded-lg transition-all duration-normal',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'touch-manipulation', // Better touch experience
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    ],
    {
        variants: {
            variant: {
                // Primary Button - Blue background, white text
                primary: [
                    'bg-primary-500 text-white shadow-md',
                    'hover:bg-primary-600 hover:shadow-lg',
                    'active:bg-primary-700 active:shadow-sm',
                    'focus:ring-primary-500/50',
                    'disabled:bg-gray-300 disabled:text-gray-500',
                ],
                // Secondary Button - White background, blue border and text
                secondary: [
                    'bg-white text-primary-500 border-2 border-primary-500 shadow-sm',
                    'hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600',
                    'active:bg-primary-100 active:border-primary-700 active:text-primary-700',
                    'focus:ring-primary-500/50',
                    'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-300',
                ],
                // Ghost Button - Transparent background, blue text
                ghost: [
                    'bg-transparent text-primary-500',
                    'hover:bg-primary-50 hover:text-primary-600',
                    'active:bg-primary-100 active:text-primary-700',
                    'focus:ring-primary-500/50',
                    'disabled:text-gray-400',
                ],
                // Danger Button - Red background, white text
                danger: [
                    'bg-error-500 text-white shadow-md',
                    'hover:bg-error-600 hover:shadow-lg',
                    'active:bg-error-700 active:shadow-sm',
                    'focus:ring-error-500/50',
                    'disabled:bg-gray-300 disabled:text-gray-500',
                ],
            },
            size: {
                // Small - 36px height
                small: [
                    'h-9 px-3 text-body-small',
                    '[&_svg]:size-4',
                ],
                // Medium - 44px height (touch-friendly)
                medium: [
                    'h-11 px-4 text-body',
                    '[&_svg]:size-5',
                ],
                // Large - 52px height
                large: [
                    'h-13 px-6 text-body-large',
                    '[&_svg]:size-6',
                ],
            },
            loading: {
                true: 'cursor-wait',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'medium',
            loading: false,
        },
    }
);

// Loading spinner component
const LoadingSpinner = ({ className }: { className?: string }) => (
    <svg
        className={cn('animate-spin', className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    /**
     * If true, the button will show a loading spinner and be disabled
     */
    loading?: boolean;
    /**
     * Icon to display before the button text
     */
    leftIcon?: React.ReactNode;
    /**
     * Icon to display after the button text
     */
    rightIcon?: React.ReactNode;
    /**
     * If true, the button will take the full width of its container
     */
    fullWidth?: boolean;
}

/**
 * Button component following the design system specifications
 * 
 * Features:
 * - Four variants: primary, secondary, ghost, danger
 * - Three sizes: small, medium, large
 * - Loading states with spinner
 * - Disabled states
 * - Touch-friendly (44px minimum height for medium size)
 * - Accessibility compliant
 * - Icon support
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            loading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                className={cn(
                    buttonVariants({ variant, size, loading }),
                    fullWidth && 'w-full',
                    className
                )}
                ref={ref}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                {...props}
            >
                {loading && <LoadingSpinner className="size-4" />}
                {!loading && leftIcon && leftIcon}
                {children}
                {!loading && rightIcon && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { VariantProps };