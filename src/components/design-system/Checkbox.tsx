import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { helperTextVariants } from './TextInput';

// Checkbox variants based on design system specifications
const checkboxVariants = cva(
    // Base styles - common to all checkboxes
    [
        'rounded border-2 transition-all duration-normal cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'touch-manipulation', // Better touch experience
        // Hide default checkbox appearance
        'appearance-none',
        // Custom checkmark styling
        'bg-no-repeat bg-center bg-contain',
    ],
    {
        variants: {
            variant: {
                // Default state
                default: [
                    'border-gray-300 bg-white',
                    'hover:border-gray-400',
                    'focus:border-primary-500 focus:ring-primary-500/20',
                    'checked:bg-primary-500 checked:border-primary-500',
                    'checked:hover:bg-primary-600 checked:hover:border-primary-600',
                    'checked:bg-[url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")]',
                ],
                // Error state
                error: [
                    'border-error-500 bg-white',
                    'hover:border-error-600',
                    'focus:border-error-500 focus:ring-error-500/20',
                    'checked:bg-error-500 checked:border-error-500',
                    'checked:hover:bg-error-600 checked:hover:border-error-600',
                    'checked:bg-[url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")]',
                ],
            },
            size: {
                // Small - 16px
                small: 'h-4 w-4',
                // Medium - 20px (touch-friendly)
                medium: 'h-5 w-5',
                // Large - 24px
                large: 'h-6 w-6',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'medium',
        },
    }
);

// Label variants for checkbox labels
const checkboxLabelVariants = cva(
    [
        'font-medium text-text-primary cursor-pointer select-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    ],
    {
        variants: {
            size: {
                small: 'text-body-small',
                medium: 'text-body-small',
                large: 'text-body',
            },
        },
        defaultVariants: {
            size: 'medium',
        },
    }
);

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof checkboxVariants> {
    /**
     * Label text for the checkbox
     */
    label?: string;
    /**
     * Helper text to display below the checkbox
     */
    helperText?: string;
    /**
     * Error message to display (overrides helperText and sets error variant)
     */
    error?: string;
    /**
     * Container class name
     */
    containerClassName?: string;
    /**
     * Label class name
     */
    labelClassName?: string;
    /**
     * Indeterminate state
     */
    indeterminate?: boolean;
}

/**
 * Checkbox component following the design system specifications
 * 
 * Features:
 * - Multiple validation states: default, error
 * - Three sizes: small, medium, large
 * - Touch-friendly (20px minimum size for medium)
 * - Accessibility compliant with proper ARIA attributes
 * - Helper text and error messages
 * - Indeterminate state support
 * - Custom styling with checkmark
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
            indeterminate = false,
            required,
            id,
            ...props
        },
        ref
    ) => {
        // Generate unique ID if not provided
        const checkboxId = id || React.useId();

        // Determine the actual variant based on validation states
        const actualVariant = error ? 'error' : variant;

        // Determine the message to display
        const message = error || helperText;
        const messageVariant = error ? 'error' : 'default';

        // ARIA attributes for accessibility
        const ariaDescribedBy = message ? `${checkboxId}-message` : undefined;
        const ariaInvalid = error ? true : undefined;

        // Handle indeterminate state
        const inputRef = React.useRef<HTMLInputElement>(null);

        React.useImperativeHandle(ref, () => inputRef.current!);

        React.useEffect(() => {
            if (inputRef.current) {
                inputRef.current.indeterminate = indeterminate;
            }
        }, [indeterminate]);

        return (
            <div className={cn('w-full', containerClassName)}>
                <div className="flex items-start gap-3">
                    <input
                        ref={inputRef}
                        type="checkbox"
                        id={checkboxId}
                        className={cn(
                            checkboxVariants({ variant: actualVariant, size }),
                            'peer',
                            className
                        )}
                        required={required}
                        aria-describedby={ariaDescribedBy}
                        aria-invalid={ariaInvalid}
                        {...props}
                    />

                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                checkboxLabelVariants({ size }),
                                labelClassName
                            )}
                        >
                            {label}
                            {required && (
                                <span className="ml-1 text-error-500" aria-label="required">
                                    *
                                </span>
                            )}
                        </label>
                    )}
                </div>

                {message && (
                    <p
                        id={`${checkboxId}-message`}
                        className={cn(
                            helperTextVariants({ variant: messageVariant }),
                            'ml-8' // Align with label text
                        )}
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

Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants, checkboxLabelVariants };