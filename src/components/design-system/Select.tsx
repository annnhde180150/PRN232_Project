import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { labelVariants, helperTextVariants } from './TextInput';

// Select variants based on design system specifications
const selectVariants = cva(
    // Base styles - common to all selects
    [
        'w-full rounded-md border transition-all duration-normal',
        'text-body bg-white appearance-none cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        'touch-manipulation', // Better touch experience
        // Custom arrow styling
        'bg-no-repeat bg-right-3 bg-center',
        'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
    ],
    {
        variants: {
            variant: {
                // Default state
                default: [
                    'border-gray-200',
                    'hover:border-gray-300',
                    'focus:border-primary-500 focus:ring-primary-500/20',
                ],
                // Success state
                success: [
                    'border-success-500',
                    'hover:border-success-600',
                    'focus:border-success-500 focus:ring-success-500/20',
                ],
                // Warning state
                warning: [
                    'border-warning-500',
                    'hover:border-warning-600',
                    'focus:border-warning-500 focus:ring-warning-500/20',
                ],
                // Error state
                error: [
                    'border-error-500',
                    'hover:border-error-600',
                    'focus:border-error-500 focus:ring-error-500/20',
                ],
            },
            size: {
                // Small - 36px height
                small: 'h-9 px-3 pr-8 text-body-small',
                // Medium - 44px height (touch-friendly)
                medium: 'h-11 px-4 pr-10 text-body',
                // Large - 52px height
                large: 'h-13 px-6 pr-12 text-body-large',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'medium',
        },
    }
);

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
    /**
     * Label text for the select
     */
    label?: string;
    /**
     * Helper text to display below the select
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
     * Options for the select
     */
    options?: SelectOption[];
    /**
     * Placeholder text
     */
    placeholder?: string;
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
 * Select component following the design system specifications
 * 
 * Features:
 * - Multiple validation states: default, success, warning, error
 * - Three sizes: small, medium, large
 * - Touch-friendly (44px minimum height for medium size)
 * - Accessibility compliant with proper ARIA attributes
 * - Helper text and error messages
 * - Required field indicator
 * - Custom arrow styling
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
            options = [],
            placeholder,
            required,
            id,
            children,
            ...props
        },
        ref
    ) => {
        // Generate unique ID if not provided
        const selectId = id || React.useId();

        // Determine the actual variant based on validation states
        const actualVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;

        // Determine the message to display
        const message = error || success || warning || helperText;
        const messageVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';

        // ARIA attributes for accessibility
        const ariaDescribedBy = message ? `${selectId}-message` : undefined;
        const ariaInvalid = error ? true : undefined;

        return (
            <div className={cn('w-full', containerClassName)}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className={cn(
                            labelVariants({ size, required }),
                            labelClassName
                        )}
                    >
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        selectVariants({ variant: actualVariant, size }),
                        className
                    )}
                    required={required}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={ariaInvalid}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}

                    {children}
                </select>

                {message && (
                    <p
                        id={`${selectId}-message`}
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

Select.displayName = 'Select';

export { Select, selectVariants };