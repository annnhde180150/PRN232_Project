import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Design System/Button',
    component: Button,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
Button component following the design system specifications.

## Features
- Four variants: primary, secondary, ghost, danger
- Three sizes: small, medium, large  
- Loading states with spinner
- Disabled states
- Touch-friendly (44px minimum height for medium size)
- Accessibility compliant
- Icon support
- Full width option

## Usage
\`\`\`tsx
import { Button } from '@/components/design-system';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="secondary" size="large">Large Secondary</Button>

// With loading state
<Button loading>Loading...</Button>

// With icons
<Button leftIcon={<Icon />}>With Icon</Button>
\`\`\`
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'ghost', 'danger'],
            description: 'Button visual style variant',
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            description: 'Button size',
        },
        loading: {
            control: { type: 'boolean' },
            description: 'Show loading spinner and disable button',
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Disable the button',
        },
        fullWidth: {
            control: { type: 'boolean' },
            description: 'Make button take full width of container',
        },
        children: {
            control: { type: 'text' },
            description: 'Button content',
        },
    },
    args: {
        children: 'Button',
        variant: 'primary',
        size: 'medium',
        loading: false,
        disabled: false,
        fullWidth: false,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Stories
export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost Button',
    },
};

export const Danger: Story = {
    args: {
        variant: 'danger',
        children: 'Danger Button',
    },
};

// Size Stories
export const Small: Story = {
    args: {
        size: 'small',
        children: 'Small Button',
    },
};

export const Medium: Story = {
    args: {
        size: 'medium',
        children: 'Medium Button',
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        children: 'Large Button',
    },
};

// State Stories
export const Loading: Story = {
    args: {
        loading: true,
        children: 'Loading...',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Disabled Button',
    },
};

// Icon Stories
export const WithLeftIcon: Story = {
    args: {
        children: 'Add Item',
        leftIcon: (
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        ),
    },
};

export const WithRightIcon: Story = {
    args: {
        children: 'Continue',
        rightIcon: (
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        ),
    },
};

export const WithBothIcons: Story = {
    args: {
        children: 'Download',
        leftIcon: (
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        rightIcon: (
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        ),
    },
};

// Layout Stories
export const FullWidth: Story = {
    args: {
        fullWidth: true,
        children: 'Full Width Button',
    },
    parameters: {
        layout: 'padded',
    },
};

// Combination Stories
export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All button variants displayed together for comparison.',
            },
        },
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-4">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All button sizes displayed together for comparison.',
            },
        },
    },
};

export const LoadingStates: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Button variant="primary" loading>Loading Primary</Button>
            <Button variant="secondary" loading>Loading Secondary</Button>
            <Button variant="ghost" loading>Loading Ghost</Button>
            <Button variant="danger" loading>Loading Danger</Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All button variants in loading state.',
            },
        },
    },
};

export const DisabledStates: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Button variant="primary" disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
            <Button variant="ghost" disabled>Disabled Ghost</Button>
            <Button variant="danger" disabled>Disabled Danger</Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All button variants in disabled state.',
            },
        },
    },
};