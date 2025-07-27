import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// TextInput variants based on design system specifications
const textInputVariants = cva(
    // Base styles - common to all text inputs
    [
        'w-full rounded-md border transition-all duration-normal',
        'text-body placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        'touch-manipulation', // Better touch experience
    ],
    {
        variants: {
            variant: {
                // Default state
                default: [
                    'border-gray-200 bg-white',
                    'hover:border-gray-300',
                    'focus:border-primary-500 focus:ring-primary-500/20',
                ],
                // Success state
                success: [
                    'border-success-500 bg-white',
                    'hover:border-success-600',
                    'focus:border-success-500 focus:ring-success-500/20',
                ],
                // Warning state
                warning: [
                    'border-warning-500 bg-white',
                    'hover:border-warning-600',
                    'focus:border-warning-500 focus:ring-warning-500/20',
                ],
                // Error state
                error: [
                    'border-error-500 bg-white',
                    'hover:border-error-600',
                    'focus:border-error-500 focus:ring-error-500/20',
                ],
            },
            size: {
                // Small - 36px height
                small: 'h-9 px-3 text-body-small',
                // Medium - 44px height (touch-friendly)
                medium: 'h-11 px-4 text-body',
                // Large - 52px height
                large: 'h-13 px-6 text-body-large',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'medium',
        },
    }
);

// Label component
const labelVariants = cva(
    [
        'block font-medium text-text-primary mb-1',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    ],
    {
        variants: {
            size: {
                small: 'text-body-small',
                medium: 'text-body-small',
                large: 'text-body',
            },
            required: {
                true: "after:content-['*'] after:ml-1 after:text-error-500",
                false: '',
            },
        },
        defaultVariants: {
            size: 'medium',
            required: false,
        },
    }
);

// Helper text component
const helperTextVariants = cva(
    [
        'mt-1 text-body-small',
    ],
    {
        variants: {
            variant: {
                default: 'text-text-secondary',
                success: 'text-success-600',
                warning: 'text-warning-600',
                error: 'text-error-600',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface TextInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof textInputVariants> {
    /**
     * Label text for the input
     */
    label?: string;
    /**
     * Helper text to display below the input
     */
    helperText?: string;
    /**
     * Error message to display (overrides helperText and sets error variant)
     */
    error?: string;
    /**
     * Success message to display (overrides helperText and sets success variant)
     */
    success?: string;
    /**
     * Warning message to display (overrides helperText and sets warning variant)
     */
    warning?: string;
    /**
     * Icon to display at the start of the input
     */
    startIcon?: React.ReactNode;
    /**
     * Icon to display at the end of the input
     */
    endIcon?: React.ReactNode;
    /**
     * Container class name
     */
    containerClassName?: string;
    /**
     * Label class name
     */
    labelClassName?: string;
}

/**
 * TextInput component following the design system specifications
 * 
 * Features:
 * - Multiple validation states: default, success, warning, error
 * - Three sizes: small, medium, large
 * - Touch-friendly (44px minimum height for medium size)
 * - Accessibility compliant with proper ARIA attributes
 * - Icon support
 * - Helper text and error messages
 * - Required field indicator
 */
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            className,
            containerClassName,
            labelClassName,
            variant,
            size,
            label,
            helperText,
            error,
            success,
            warning,
            startIcon,
            endIcon,
            required,
            id,
            ...props
        },
        ref
    ) => {
        // Generate unique ID if not provided
        const inputId = id || React.useId();

        // Determine the actual variant based on validation states
        const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;

        // Determine the message to display
        const message = error || success || warning || helperText;
        const messageVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';

        // ARIA attributes for accessibility
        const ariaDescribedBy = message ? `${inputId}-message` : undefined;
        const ariaInvalid = error ? true : undefined;

        return (
            <div className={cn('w-full', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            labelVariants({ size, required }),
                            labelClassName
                        )}
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {startIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {startIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            textInputVariants({ variant: actualVariant, size }),
                            startIcon && 'pl-10',
                            endIcon && 'pr-10',
                            className
                        )}
                        required={required}
                        aria-describedby={ariaDescribedBy}
                        aria-invalid={ariaInvalid}
                        {...props}
                    />

                    {endIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {endIcon}
                        </div>
                    )}
                </div>

                {message && (
                    <p
                        id={`${inputId}-message`}
                        className={helperTextVariants({ variant: messageVariant })}
                        role={error ? 'alert' : undefined}
                        aria-live={error ? 'polite' : undefined}
                    >
                        {message}
                    </p>
                )}
            </div>
        );
    }
);

TextInput.displayName = 'TextInput';

export { TextInput, textInputVariants, labelVariants, helperTextVariants };