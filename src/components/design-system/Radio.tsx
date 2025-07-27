import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { helperTextVariants } from './TextInput';

// Radio variants based on design system specifications
const radioVariants = cva(
    // Base styles - common to all radio buttons
    [
        'rounded-full border-2 transition-all duration-normal cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'touch-manipulation', // Better touch experience
        // Hide default radio appearance
        'appearance-none',
        // Custom dot styling
        'bg-no-repeat bg-center',
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
                    'checked:bg-[radial-gradient(circle,white_40%,transparent_40%)]',
                ],
                // Error state
                error: [
                    'border-error-500 bg-white',
                    'hover:border-error-600',
                    'focus:border-error-500 focus:ring-error-500/20',
                    'checked:bg-error-500 checked:border-error-500',
                    'checked:hover:bg-error-600 checked:hover:border-error-600',
                    'checked:bg-[radial-gradient(circle,white_40%,transparent_40%)]',
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

// Label variants for radio labels
const radioLabelVariants = cva(
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

export interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
    helperText?: string;
}

export interface RadioProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof radioVariants> {
    /**
     * Label text for the radio button
     */
    label?: string;
    /**
     * Helper text to display below the radio button
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
}

/**
 * Radio component following the design system specifications
 * 
 * Features:
 * - Multiple validation states: default, error
 * - Three sizes: small, medium, large
 * - Touch-friendly (20px minimum size for medium)
 * - Accessibility compliant with proper ARIA attributes
 * - Helper text and error messages
 * - Custom styling with dot
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
            required,
            id,
            ...props
        },
        ref
    ) => {
        // Generate unique ID if not provided
        const radioId = id || React.useId();

        // Determine the actual variant based on validation states
        const actualVariant = error ? 'error' : variant;

        // Determine the message to display
        const message = error || helperText;
        const messageVariant = error ? 'error' : 'default';

        // ARIA attributes for accessibility
        const ariaDescribedBy = message ? `${radioId}-message` : undefined;
        const ariaInvalid = error ? true : undefined;

        return (
            <div className={cn('w-full', containerClassName)}>
                <div className="flex items-start gap-3">
                    <input
                        ref={ref}
                        type="radio"
                        id={radioId}
                        className={cn(
                            radioVariants({ variant: actualVariant, size }),
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
                            htmlFor={radioId}
                            className={cn(
                                radioLabelVariants({ size }),
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
                        id={`${radioId}-message`}
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

Radio.displayName = 'Radio';

// RadioGroup component for managing multiple radio buttons
export interface RadioGroupProps {
    /**
     * Name attribute for the radio group
     */
    name: string;
    /**
     * Current selected value
     */
    value?: string;
    /**
     * Callback when value changes
     */
    onChange?: (value: string) => void;
    /**
     * Options for the radio group
     */
    options: RadioOption[];
    /**
     * Label for the radio group
     */
    label?: string;
    /**
     * Helper text for the radio group
     */
    helperText?: string;
    /**
     * Error message for the radio group
     */
    error?: string;
    /**
     * Size of radio buttons
     */
    size?: VariantProps<typeof radioVariants>['size'];
    /**
     * Layout direction
     */
    direction?: 'vertical' | 'horizontal';
    /**
     * Required field
     */
    required?: boolean;
    /**
     * Container class name
     */
    containerClassName?: string;
    /**
     * Group class name
     */
    groupClassName?: string;
}

/**
 * RadioGroup component for managing multiple radio buttons
 * 
 * Features:
 * - Manages radio button state
 * - Keyboard navigation support
 * - Accessibility compliant
 * - Flexible layout options
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    value,
    onChange,
    options,
    label,
    helperText,
    error,
    size = 'medium',
    direction = 'vertical',
    required = false,
    containerClassName,
    groupClassName,
}) => {
    const groupId = React.useId();
    const actualVariant = error ? 'error' : 'default';
    const message = error || helperText;
    const messageVariant = error ? 'error' : 'default';
    const ariaDescribedBy = message ? `${groupId}-message` : undefined;

    const handleChange = (optionValue: string) => {
        onChange?.(optionValue);
    };

    return (
        <div className={cn('w-full', containerClassName)}>
            {label && (
                <fieldset>
                    <legend className={cn(
                        'block font-medium text-text-primary mb-3 text-body-small',
                        required && "after:content-['*'] after:ml-1 after:text-error-500"
                    )}>
                        {label}
                    </legend>

                    <div
                        className={cn(
                            'space-y-3',
                            direction === 'horizontal' && 'flex flex-wrap gap-6 space-y-0',
                            groupClassName
                        )}
                        role="radiogroup"
                        aria-describedby={ariaDescribedBy}
                        aria-invalid={error ? true : undefined}
                        aria-required={required}
                    >
                        {options.map((option) => (
                            <Radio
                                key={option.value}
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={() => handleChange(option.value)}
                                label={option.label}
                                helperText={option.helperText}
                                disabled={option.disabled}
                                variant={actualVariant}
                                size={size}
                                required={required}
                            />
                        ))}
                    </div>
                </fieldset>
            )}

            {!label && (
                <div
                    className={cn(
                        'space-y-3',
                        direction === 'horizontal' && 'flex flex-wrap gap-6 space-y-0',
                        groupClassName
                    )}
                    role="radiogroup"
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={error ? true : undefined}
                    aria-required={required}
                >
                    {options.map((option) => (
                        <Radio
                            key={option.value}
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => handleChange(option.value)}
                            label={option.label}
                            helperText={option.helperText}
                            disabled={option.disabled}
                            variant={actualVariant}
                            size={size}
                            required={required}
                        />
                    ))}
                </div>
            )}

            {message && (
                <p
                    id={`${groupId}-message`}
                    className={cn(
                        helperTextVariants({ variant: messageVariant }),
                        'mt-3'
                    )}
                    role={error ? 'alert' : undefined}
                    aria-live={error ? 'polite' : undefined}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export { Radio, RadioGroup, radioVariants, radioLabelVariants };