# Form Input Components

This document describes the form input components implemented as part of the design system for the home service application.

## Overview

The form input components provide a comprehensive set of accessible, touch-friendly, and validation-ready input controls that follow the design system specifications.

## Components

### TextInput

A versatile text input component with validation states, icons, and accessibility features.

#### Features

- Multiple validation states: default, success, warning, error
- Three sizes: small (36px), medium (44px), large (52px)
- Touch-friendly design with minimum 44px height for medium size
- Icon support (start and end icons)
- Helper text and error messages
- Required field indicator
- Full accessibility compliance with ARIA attributes

#### Usage

```tsx
import { TextInput } from "@/components/design-system";

<TextInput
  label="Email Address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
  startIcon={<EmailIcon />}
  required
/>;
```

#### Props

- `label?: string` - Label text for the input
- `helperText?: string` - Helper text to display below the input
- `error?: string` - Error message (overrides helperText and sets error variant)
- `success?: string` - Success message (overrides helperText and sets success variant)
- `warning?: string` - Warning message (overrides helperText and sets warning variant)
- `startIcon?: React.ReactNode` - Icon to display at the start of the input
- `endIcon?: React.ReactNode` - Icon to display at the end of the input
- `size?: 'small' | 'medium' | 'large'` - Size of the input
- `variant?: 'default' | 'success' | 'warning' | 'error'` - Visual variant

### Select

A dropdown select component with custom styling and accessibility features.

#### Features

- Multiple validation states: default, success, warning, error
- Three sizes: small, medium, large
- Touch-friendly design
- Custom arrow styling
- Helper text and error messages
- Required field indicator
- Disabled option support

#### Usage

```tsx
import { Select } from "@/components/design-system";

const options = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom", disabled: true },
];

<Select
  label="Country"
  placeholder="Select your country"
  options={options}
  required
/>;
```

#### Props

- `label?: string` - Label text for the select
- `options?: SelectOption[]` - Options for the select
- `placeholder?: string` - Placeholder text
- `helperText?: string` - Helper text to display below the select
- `error?: string` - Error message
- `success?: string` - Success message
- `warning?: string` - Warning message
- `size?: 'small' | 'medium' | 'large'` - Size of the select

### Checkbox

A checkbox component with custom styling and indeterminate state support.

#### Features

- Multiple validation states: default, error
- Three sizes: small (16px), medium (20px), large (24px)
- Touch-friendly design
- Indeterminate state support
- Custom checkmark styling
- Helper text and error messages
- Required field indicator

#### Usage

```tsx
import { Checkbox } from "@/components/design-system";

<Checkbox
  label="Accept terms and conditions"
  helperText="Please read our terms before accepting"
  required
/>;
```

#### Props

- `label?: string` - Label text for the checkbox
- `helperText?: string` - Helper text to display below the checkbox
- `error?: string` - Error message
- `indeterminate?: boolean` - Indeterminate state
- `size?: 'small' | 'medium' | 'large'` - Size of the checkbox

### Radio & RadioGroup

Radio button components for single selection from multiple options.

#### Features

- Multiple validation states: default, error
- Three sizes: small (16px), medium (20px), large (24px)
- Touch-friendly design
- Custom dot styling
- Keyboard navigation support
- Flexible layout options (vertical/horizontal)
- Helper text and error messages

#### Usage

```tsx
import { RadioGroup } from "@/components/design-system";

const options = [
  { value: "basic", label: "Basic Plan", helperText: "$9/month" },
  { value: "pro", label: "Pro Plan", helperText: "$19/month" },
  { value: "enterprise", label: "Enterprise Plan", helperText: "$49/month" },
];

<RadioGroup
  name="plan"
  label="Choose your plan"
  options={options}
  value={selectedPlan}
  onChange={setSelectedPlan}
  required
/>;
```

#### RadioGroup Props

- `name: string` - Name attribute for the radio group
- `label?: string` - Label for the radio group
- `options: RadioOption[]` - Options for the radio group
- `value?: string` - Current selected value
- `onChange?: (value: string) => void` - Callback when value changes
- `direction?: 'vertical' | 'horizontal'` - Layout direction
- `size?: 'small' | 'medium' | 'large'` - Size of radio buttons
- `required?: boolean` - Required field
- `error?: string` - Error message
- `helperText?: string` - Helper text

## Accessibility Features

All form input components are designed with accessibility as a priority:

### WCAG 2.1 AA Compliance

- Color contrast ratios meet 4.5:1 minimum requirement
- Touch targets are minimum 44px for medium size components
- Text can be scaled up to 200% without loss of functionality

### Keyboard Navigation

- All components are fully keyboard accessible
- Proper tab order and focus management
- Clear focus indicators
- Arrow key navigation for radio groups

### Screen Reader Support

- Proper semantic HTML structure
- ARIA labels and descriptions
- Error announcements with `role="alert"`
- Required field indicators

### Focus Management

- Logical tab order
- Focus trapping where appropriate
- Clear focus indicators
- Keyboard shortcuts for common actions

## Validation and Error Handling

### Validation States

Each component supports multiple validation states:

- **Default**: Normal state with standard styling
- **Success**: Green styling with success message
- **Warning**: Amber styling with warning message
- **Error**: Red styling with error message

### Error Messages

- Error messages are announced to screen readers
- Proper ARIA attributes (`aria-invalid`, `aria-describedby`)
- Visual and programmatic association with form controls

### Helper Text

- Associated with form controls via `aria-describedby`
- Provides additional context and guidance
- Overridden by validation messages when present

## Responsive Design

### Mobile-First Approach

- Components are designed mobile-first
- Touch-friendly interactions with minimum 44px touch targets
- Optimized for one-handed use

### Breakpoint Support

- Responsive sizing and spacing
- Adaptive layouts for different screen sizes
- High-DPI display support

## Testing

### Unit Tests

- Comprehensive test coverage for all components
- Accessibility testing with jest-axe
- User interaction testing with React Testing Library
- Keyboard navigation testing

### Integration Tests

- Form submission workflows
- Component interaction testing
- Cross-browser compatibility

### Accessibility Testing

- Automated accessibility auditing
- Screen reader testing
- Keyboard navigation testing
- Color contrast validation

## Performance

### Optimization Features

- Lazy loading where appropriate
- Minimal bundle size impact
- Efficient re-rendering
- Touch gesture optimization

### Loading States

- Smooth transitions between states
- Progressive enhancement
- Graceful degradation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Accessibility tools compatibility
- Progressive enhancement for older browsers

## Examples

See the `FormInputsDemo` component for comprehensive examples of all form input components in action, including:

- Basic usage examples
- Size variations
- Validation states
- Interactive form example
- Accessibility demonstrations

## Migration Guide

When migrating from existing form components:

1. Replace existing input components with design system equivalents
2. Update prop names to match new API
3. Add proper labels and helper text
4. Implement validation states
5. Test accessibility compliance
6. Update styling to use design tokens

## Best Practices

1. Always provide labels for form inputs
2. Use helper text to provide additional context
3. Implement proper validation with clear error messages
4. Group related inputs logically
5. Use appropriate input types (email, tel, etc.)
6. Test with keyboard navigation and screen readers
7. Provide clear visual feedback for all states
8. Use consistent sizing throughout your application
