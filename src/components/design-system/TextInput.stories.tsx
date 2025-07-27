import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

// Demo icons
const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const meta: Meta<typeof TextInput> = {
    title: 'Design System/Form/TextInput',
    component: TextInput,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
TextInput component following the design system specifications.

## Features
- Multiple validation states: default, success, warning, error
- Three sizes: small, medium, large
- Touch-friendly (44px minimum height for medium size)
- Accessibility compliant with proper ARIA attributes
- Icon support
- Helper text and error messages
- Required field indicator

## Usage
\`\`\`tsx
import { TextInput } from '@/components/design-system/TextInput';

<TextInput
    label="Email"
    placeholder="Enter your email"
    helperText="We'll never share your email"
    required
/>
\`\`\`
                `,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'error'],
            description: 'Visual variant of the input',
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Size of the input',
        },
        label: {
            control: 'text',
            description: 'Label text for the input',
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text',
        },
        helperText: {
            control: 'text',
            description: 'Helper text to display below the input',
        },
        error: {
            control: 'text',
            description: 'Error message (overrides helperText and sets error variant)',
        },
        success: {
            control: 'text',
            description: 'Success message (overrides helperText and sets success variant)',
        },
        warning: {
            control: 'text',
            description: 'Warning message (overrides helperText and sets warning variant)',
        },
        required: {
            control: 'boolean',
            description: 'Whether the field is required',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the input is disabled',
        },
    },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

// Basic stories
export const Default: Story = {
    args: {
        label: 'Email Address',
        placeholder: 'Enter your email',
        helperText: 'We\'ll never share your email with anyone else.',
    },
};

export const Required: Story = {
    args: {
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        helperText: 'This field is required',
    },
};

export const WithIcons: Story = {
    args: {
        label: 'Search',
        placeholder: 'Search for something...',
        startIcon: <SearchIcon />,
    },
};

export const WithEndIcon: Story = {
    args: {
        label: 'Email',
        placeholder: 'Enter your email',
        endIcon: <EmailIcon />,
        helperText: 'Enter a valid email address',
    },
};

// Size variations
export const Small: Story = {
    args: {
        label: 'Small Input',
        placeholder: 'Small size',
        size: 'small',
        helperText: 'This is a small input',
    },
};

export const Medium: Story = {
    args: {
        label: 'Medium Input',
        placeholder: 'Medium size (default)',
        size: 'medium',
        helperText: 'This is a medium input (default)',
    },
};

export const Large: Story = {
    args: {
        label: 'Large Input',
        placeholder: 'Large size',
        size: 'large',
        helperText: 'This is a large input',
    },
};

// Validation states
export const Success: Story = {
    args: {
        label: 'Email Address',
        value: 'user@example.com',
        success: 'Email address is valid!',
        startIcon: <EmailIcon />,
    },
};

export const Warning: Story = {
    args: {
        label: 'Password',
        type: 'password',
        value: 'weak',
        warning: 'Password is too weak. Consider adding numbers and symbols.',
    },
};

export const Error: Story = {
    args: {
        label: 'Email Address',
        value: 'invalid-email',
        error: 'Please enter a valid email address.',
        startIcon: <EmailIcon />,
    },
};

// States
export const Disabled: Story = {
    args: {
        label: 'Disabled Input',
        placeholder: 'This input is disabled',
        disabled: true,
        helperText: 'This field is currently disabled',
    },
};

export const ReadOnly: Story = {
    args: {
        label: 'Read Only',
        value: 'This value cannot be changed',
        readOnly: true,
        helperText: 'This field is read-only',
    },
};

// Input types
export const Password: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        helperText: 'Password must be at least 8 characters long',
        required: true,
    },
};

export const Email: Story = {
    args: {
        label: 'Email',
        type: 'email',
        placeholder: 'user@example.com',
        startIcon: <EmailIcon />,
        required: true,
    },
};

export const Number: Story = {
    args: {
        label: 'Age',
        type: 'number',
        placeholder: '25',
        min: 0,
        max: 120,
        helperText: 'Enter your age in years',
    },
};

export const Tel: Story = {
    args: {
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        helperText: 'Include country code',
    },
};

// Complex example
export const ComplexExample: Story = {
    args: {
        label: 'Search Products',
        placeholder: 'Search for products, brands, or categories...',
        startIcon: <SearchIcon />,
        helperText: 'Use keywords to find what you\'re looking for',
        size: 'large',
    },
    parameters: {
        docs: {
            description: {
                story: 'A complex example showing a search input with icon, helper text, and large size.',
            },
        },
    },
};