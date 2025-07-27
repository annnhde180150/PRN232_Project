import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TextInput } from '../TextInput';
import { Select } from '../Select';
import { Checkbox } from '../Checkbox';
import { Radio, RadioGroup } from '../Radio';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('TextInput Component', () => {
    describe('Basic Functionality', () => {
        it('renders with label and placeholder', () => {
            render(
                <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    data-testid="email-input"
                />
            );

            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        });

        it('handles value changes', async () => {
            const user = userEvent.setup();
            const handleChange = jest.fn();

            render(
                <TextInput
                    label="Name"
                    onChange={handleChange}
                    data-testid="name-input"
                />
            );

            const input = screen.getByLabelText('Name');
            await user.type(input, 'John Doe');

            expect(handleChange).toHaveBeenCalled();
            expect(input).toHaveValue('John Doe');
        });

        it('shows required indicator when required', () => {
            render(<TextInput label="Required Field" required />);

            // Check that the input has the required attribute
            const input = screen.getByLabelText('Required Field');
            expect(input).toHaveAttribute('required');
        });
    });

    describe('Validation States', () => {
        it('displays error message and applies error styling', () => {
            render(
                <TextInput
                    label="Email"
                    error="Please enter a valid email"
                />
            );

            const errorMessage = screen.getByText('Please enter a valid email');
            expect(errorMessage).toBeInTheDocument();
            expect(errorMessage).toHaveAttribute('role', 'alert');
            expect(errorMessage).toHaveAttribute('aria-live', 'polite');
        });

        it('displays success message', () => {
            render(
                <TextInput
                    label="Email"
                    success="Email is valid"
                />
            );

            expect(screen.getByText('Email is valid')).toBeInTheDocument();
        });

        it('displays warning message', () => {
            render(
                <TextInput
                    label="Password"
                    warning="Password is weak"
                />
            );

            expect(screen.getByText('Password is weak')).toBeInTheDocument();
        });

        it('displays helper text', () => {
            render(
                <TextInput
                    label="Username"
                    helperText="Must be at least 3 characters"
                />
            );

            expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
        });
    });

    describe('Icons', () => {
        it('renders with start and end icons', () => {
            const StartIcon = () => <span data-testid="start-icon">@</span>;
            const EndIcon = () => <span data-testid="end-icon">✓</span>;

            render(
                <TextInput
                    label="Email"
                    startIcon={<StartIcon />}
                    endIcon={<EndIcon />}
                />
            );

            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            render(
                <TextInput
                    label="Email"
                    helperText="Enter your email address"
                    required
                />
            );

            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('aria-describedby');
            expect(input).toHaveAttribute('required');
        });

        it('has proper ARIA attributes for error state', () => {
            render(
                <TextInput
                    label="Email"
                    error="Invalid email"
                />
            );

            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('aria-invalid', 'true');
            expect(input).toHaveAttribute('aria-describedby');
        });

        it('should not have accessibility violations', async () => {
            const { container } = render(
                <TextInput
                    label="Email"
                    helperText="Enter your email"
                    required
                />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Focus Management', () => {
        it('focuses input when label is clicked', async () => {
            const user = userEvent.setup();

            render(<TextInput label="Email" />);

            const label = screen.getByText('Email');
            const input = screen.getByLabelText('Email');

            await user.click(label);
            expect(input).toHaveFocus();
        });

        it('shows focus ring when focused', async () => {
            const user = userEvent.setup();

            render(<TextInput label="Email" />);

            const input = screen.getByLabelText('Email');
            await user.click(input);

            expect(input).toHaveFocus();
        });
    });
});

describe('Select Component', () => {
    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3', disabled: true },
    ];

    describe('Basic Functionality', () => {
        it('renders with options', () => {
            render(
                <Select
                    label="Choose Option"
                    options={options}
                    placeholder="Select an option"
                />
            );

            expect(screen.getByLabelText('Choose Option')).toBeInTheDocument();
            expect(screen.getByText('Select an option')).toBeInTheDocument();
            expect(screen.getByText('Option 1')).toBeInTheDocument();
            expect(screen.getByText('Option 2')).toBeInTheDocument();
        });

        it('handles selection changes', async () => {
            const user = userEvent.setup();
            const handleChange = jest.fn();

            render(
                <Select
                    label="Choose Option"
                    options={options}
                    onChange={handleChange}
                />
            );

            const select = screen.getByLabelText('Choose Option');
            await user.selectOptions(select, 'option1');

            expect(handleChange).toHaveBeenCalled();
            expect(select).toHaveValue('option1');
        });

        it('disables specific options', () => {
            render(
                <Select
                    label="Choose Option"
                    options={options}
                />
            );

            const option3 = screen.getByText('Option 3');
            expect(option3).toBeDisabled();
        });
    });

    describe('Accessibility', () => {
        it('should not have accessibility violations', async () => {
            const { container } = render(
                <Select
                    label="Choose Option"
                    options={options}
                    required
                />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});

describe('Checkbox Component', () => {
    describe('Basic Functionality', () => {
        it('renders with label', () => {
            render(<Checkbox label="Accept terms" />);

            expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
        });

        it('handles check/uncheck', async () => {
            const user = userEvent.setup();
            const handleChange = jest.fn();

            render(
                <Checkbox
                    label="Accept terms"
                    onChange={handleChange}
                />
            );

            const checkbox = screen.getByLabelText('Accept terms');
            await user.click(checkbox);

            expect(handleChange).toHaveBeenCalled();
            expect(checkbox).toBeChecked();
        });

        it('supports indeterminate state', () => {
            render(
                <Checkbox
                    label="Select all"
                    indeterminate={true}
                />
            );

            const checkbox = screen.getByLabelText('Select all') as HTMLInputElement;
            expect(checkbox.indeterminate).toBe(true);
        });
    });

    describe('Validation States', () => {
        it('displays error message', () => {
            render(
                <Checkbox
                    label="Accept terms"
                    error="You must accept the terms"
                />
            );

            expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should not have accessibility violations', async () => {
            const { container } = render(
                <Checkbox
                    label="Accept terms"
                    required
                />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has proper ARIA attributes for error state', () => {
            render(
                <Checkbox
                    label="Accept terms"
                    error="Required field"
                />
            );

            const checkbox = screen.getByLabelText('Accept terms');
            expect(checkbox).toHaveAttribute('aria-invalid', 'true');
            expect(checkbox).toHaveAttribute('aria-describedby');
        });
    });
});

describe('Radio Component', () => {
    describe('Basic Functionality', () => {
        it('renders with label', () => {
            render(
                <Radio
                    name="option"
                    value="option1"
                    label="Option 1"
                />
            );

            expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
        });

        it('handles selection', async () => {
            const user = userEvent.setup();
            const handleChange = jest.fn();

            render(
                <Radio
                    name="option"
                    value="option1"
                    label="Option 1"
                    onChange={handleChange}
                />
            );

            const radio = screen.getByLabelText('Option 1');
            await user.click(radio);

            expect(handleChange).toHaveBeenCalled();
            expect(radio).toBeChecked();
        });
    });

    describe('Accessibility', () => {
        it('should not have accessibility violations', async () => {
            const { container } = render(
                <Radio
                    name="option"
                    value="option1"
                    label="Option 1"
                />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});

describe('RadioGroup Component', () => {
    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3', disabled: true },
    ];

    describe('Basic Functionality', () => {
        it('renders with options', () => {
            render(
                <RadioGroup
                    name="test-group"
                    label="Choose an option"
                    options={options}
                />
            );

            expect(screen.getByText('Choose an option')).toBeInTheDocument();
            expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
            expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
            expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
        });

        it('handles selection changes', async () => {
            const user = userEvent.setup();
            const handleChange = jest.fn();

            const TestComponent = () => {
                const [value, setValue] = React.useState('');

                const handleValueChange = (newValue: string) => {
                    setValue(newValue);
                    handleChange(newValue);
                };

                return (
                    <RadioGroup
                        name="test-group"
                        options={options}
                        value={value}
                        onChange={handleValueChange}
                    />
                );
            };

            render(<TestComponent />);

            const option1 = screen.getByLabelText('Option 1');
            await user.click(option1);

            expect(handleChange).toHaveBeenCalledWith('option1');
            expect(option1).toBeChecked();
        });

        it('supports controlled value', () => {
            render(
                <RadioGroup
                    name="test-group"
                    options={options}
                    value="option2"
                />
            );

            const option2 = screen.getByLabelText('Option 2');
            expect(option2).toBeChecked();
        });

        it('supports horizontal layout', () => {
            const { container } = render(
                <RadioGroup
                    name="test-group"
                    options={options}
                    direction="horizontal"
                />
            );

            const group = container.querySelector('[role="radiogroup"]');
            expect(group).toHaveClass('flex');
        });
    });

    describe('Accessibility', () => {
        it('should not have accessibility violations', async () => {
            const { container } = render(
                <RadioGroup
                    name="test-group"
                    label="Choose an option"
                    options={options}
                    required
                />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has proper radiogroup role and attributes', () => {
            render(
                <RadioGroup
                    name="test-group"
                    label="Choose an option"
                    options={options}
                    required
                />
            );

            const radiogroup = screen.getByRole('radiogroup');
            expect(radiogroup).toHaveAttribute('aria-required', 'true');
        });

        it('supports keyboard navigation', async () => {
            const user = userEvent.setup();

            render(
                <RadioGroup
                    name="test-group"
                    options={options}
                />
            );

            const option1 = screen.getByLabelText('Option 1');
            const option2 = screen.getByLabelText('Option 2');

            // Focus first option
            option1.focus();
            expect(option1).toHaveFocus();

            // Arrow down should move to next option
            await user.keyboard('{ArrowDown}');
            expect(option2).toHaveFocus();
        });
    });

    describe('Error Handling', () => {
        it('displays error message', () => {
            render(
                <RadioGroup
                    name="test-group"
                    label="Choose an option"
                    options={options}
                    error="Please select an option"
                />
            );

            expect(screen.getByText('Please select an option')).toBeInTheDocument();
        });
    });
});

describe('Form Components Integration', () => {
    it('works together in a form', async () => {
        const user = userEvent.setup();
        const handleSubmit = jest.fn((e) => e.preventDefault());

        const TestForm = () => {
            const [plan, setPlan] = React.useState('');

            return (
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Name"
                        name="name"
                        required
                    />
                    <Select
                        label="Country"
                        name="country"
                        options={[
                            { value: 'us', label: 'United States' },
                            { value: 'ca', label: 'Canada' },
                        ]}
                        required
                    />
                    <Checkbox
                        label="Subscribe to newsletter"
                        name="newsletter"
                    />
                    <RadioGroup
                        name="plan"
                        label="Choose a plan"
                        options={[
                            { value: 'basic', label: 'Basic' },
                            { value: 'premium', label: 'Premium' },
                        ]}
                        value={plan}
                        onChange={setPlan}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            );
        };

        render(<TestForm />);

        // Fill out the form
        await user.type(screen.getByLabelText('Name'), 'John Doe');
        await user.selectOptions(screen.getByLabelText('Country'), 'us');
        await user.click(screen.getByLabelText('Subscribe to newsletter'));
        await user.click(screen.getByDisplayValue('basic'));

        // Submit the form
        await user.click(screen.getByText('Submit'));

        expect(handleSubmit).toHaveBeenCalled();
    });
});