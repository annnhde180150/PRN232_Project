import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { RadioGroup } from './Radio';

// Select Stories
const selectMeta: Meta<typeof Select> = {
    title: 'Design System/Form/Select',
    component: Select,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Select component following the design system specifications.

## Features
- Multiple validation states: default, success, warning, error
- Three sizes: small, medium, large
- Touch-friendly (44px minimum height for medium size)
- Accessibility compliant with proper ARIA attributes
- Helper text and error messages
- Required field indicator
- Custom arrow styling

## Usage
\`\`\`tsx
import { Select } from '@/components/design-system/Select';

const options = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
];

<Select
    label="Country"
    placeholder="Select your country"
    options={options}
    required
/>
\`\`\`
                `,
            },
        },
    },
};

export default selectMeta;

const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany', disabled: true },
    { value: 'fr', label: 'France' },
];

export const SelectDefault: StoryObj<typeof Select> = {
    name: 'Default',
    args: {
        label: 'Country',
        placeholder: 'Select your country',
        options: countryOptions,
        helperText: 'Choose your country of residence',
    },
};

export const SelectRequired: StoryObj<typeof Select> = {
    name: 'Required',
    args: {
        label: 'Country',
        placeholder: 'Select your country',
        options: countryOptions,
        required: true,
        helperText: 'This field is required',
    },
};

export const SelectError: StoryObj<typeof Select> = {
    name: 'Error State',
    args: {
        label: 'Country',
        placeholder: 'Select your country',
        options: countryOptions,
        error: 'Please select a valid country',
    },
};

export const SelectSuccess: StoryObj<typeof Select> = {
    name: 'Success State',
    args: {
        label: 'Country',
        value: 'us',
        options: countryOptions,
        success: 'Great choice!',
    },
};

export const SelectSizes: StoryObj<typeof Select> = {
    name: 'Size Variations',
    render: () => (
        <div className="space-y-4">
            <Select
                label="Small Select"
                size="small"
                placeholder="Small size"
                options={countryOptions.slice(0, 3)}
            />
            <Select
                label="Medium Select"
                size="medium"
                placeholder="Medium size (default)"
                options={countryOptions.slice(0, 3)}
            />
            <Select
                label="Large Select"
                size="large"
                placeholder="Large size"
                options={countryOptions.slice(0, 3)}
            />
        </div>
    ),
};

// Checkbox Stories
const checkboxMeta: Meta<typeof Checkbox> = {
    title: 'Design System/Form/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Checkbox component following the design system specifications.

## Features
- Multiple validation states: default, error
- Three sizes: small, medium, large
- Touch-friendly (20px minimum size for medium)
- Accessibility compliant with proper ARIA attributes
- Helper text and error messages
- Indeterminate state support
- Custom styling with checkmark

## Usage
\`\`\`tsx
import { Checkbox } from '@/components/design-system/Checkbox';

<Checkbox
    label="Accept terms and conditions"
    helperText="Please read our terms before accepting"
    required
/>
\`\`\`
                `,
            },
        },
    },
};

export const CheckboxDefault: StoryObj<typeof Checkbox> = {
    name: 'Default',
    args: {
        label: 'Accept terms and conditions',
        helperText: 'Please read our terms and conditions before proceeding',
    },
    parameters: {
        docs: {
            storyDescription: 'Basic checkbox with label and helper text.',
        },
    },
};

export const CheckboxRequired: StoryObj<typeof Checkbox> = {
    name: 'Required',
    args: {
        label: 'I agree to the terms and conditions',
        required: true,
        helperText: 'This field is required to continue',
    },
};

export const CheckboxError: StoryObj<typeof Checkbox> = {
    name: 'Error State',
    args: {
        label: 'Accept terms and conditions',
        error: 'You must accept the terms to continue',
    },
};

export const CheckboxIndeterminate: StoryObj<typeof Checkbox> = {
    name: 'Indeterminate State',
    args: {
        label: 'Select all items',
        indeterminate: true,
        helperText: 'Some items are selected',
    },
};

export const CheckboxSizes: StoryObj<typeof Checkbox> = {
    name: 'Size Variations',
    render: () => (
        <div className="space-y-4">
            <Checkbox label="Small checkbox" size="small" />
            <Checkbox label="Medium checkbox" size="medium" />
            <Checkbox label="Large checkbox" size="large" />
        </div>
    ),
};

export const CheckboxStates: StoryObj<typeof Checkbox> = {
    name: 'All States',
    render: () => (
        <div className="space-y-4">
            <Checkbox label="Default state" />
            <Checkbox label="Checked state" defaultChecked />
            <Checkbox label="Indeterminate state" indeterminate />
            <Checkbox label="Disabled state" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
            <Checkbox label="Error state" error="This field has an error" />
        </div>
    ),
};

// RadioGroup Stories
const radioGroupMeta: Meta<typeof RadioGroup> = {
    title: 'Design System/Form/RadioGroup',
    component: RadioGroup,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
RadioGroup component for managing multiple radio buttons.

## Features
- Manages radio button state
- Keyboard navigation support
- Accessibility compliant
- Flexible layout options
- Multiple validation states
- Helper text and error messages

## Usage
\`\`\`tsx
import { RadioGroup } from '@/components/design-system/Radio';

const options = [
    { value: 'basic', label: 'Basic Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'enterprise', label: 'Enterprise Plan' },
];

<RadioGroup
    name="plan"
    label="Choose your plan"
    options={options}
    required
/>
\`\`\`
                `,
            },
        },
    },
};

const planOptions = [
    { value: 'basic', label: 'Basic Plan', helperText: '$9/month - Essential features' },
    { value: 'pro', label: 'Pro Plan', helperText: '$19/month - Advanced features' },
    { value: 'enterprise', label: 'Enterprise Plan', helperText: '$49/month - Full features' },
];

const experienceOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
];

export const RadioGroupDefault: StoryObj<typeof RadioGroup> = {
    name: 'Default',
    args: {
        name: 'plan',
        label: 'Choose your plan',
        options: planOptions,
        helperText: 'Select the plan that best fits your needs',
    },
};

export const RadioGroupRequired: StoryObj<typeof RadioGroup> = {
    name: 'Required',
    args: {
        name: 'plan-required',
        label: 'Choose your plan',
        options: planOptions,
        required: true,
        helperText: 'This field is required',
    },
};

export const RadioGroupError: StoryObj<typeof RadioGroup> = {
    name: 'Error State',
    args: {
        name: 'plan-error',
        label: 'Choose your plan',
        options: planOptions,
        error: 'Please select a plan to continue',
    },
};

export const RadioGroupHorizontal: StoryObj<typeof RadioGroup> = {
    name: 'Horizontal Layout',
    args: {
        name: 'experience',
        label: 'Experience Level',
        options: experienceOptions,
        direction: 'horizontal',
        helperText: 'This helps us customize your experience',
    },
};

export const RadioGroupSizes: StoryObj<typeof RadioGroup> = {
    name: 'Size Variations',
    render: () => (
        <div className="space-y-6">
            <RadioGroup
                name="size-small"
                label="Small Radio Buttons"
                options={experienceOptions.slice(0, 2)}
                size="small"
            />
            <RadioGroup
                name="size-medium"
                label="Medium Radio Buttons"
                options={experienceOptions.slice(0, 2)}
                size="medium"
            />
            <RadioGroup
                name="size-large"
                label="Large Radio Buttons"
                options={experienceOptions.slice(0, 2)}
                size="large"
            />
        </div>
    ),
};

export const RadioGroupWithDisabled: StoryObj<typeof RadioGroup> = {
    name: 'With Disabled Options',
    args: {
        name: 'plan-disabled',
        label: 'Choose your plan',
        options: [
            { value: 'basic', label: 'Basic Plan', helperText: '$9/month - Essential features' },
            { value: 'pro', label: 'Pro Plan', helperText: '$19/month - Advanced features' },
            { value: 'enterprise', label: 'Enterprise Plan', helperText: '$49/month - Coming soon', disabled: true },
        ],
        helperText: 'Some options may not be available',
    },
};