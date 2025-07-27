import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('Button Component', () => {
    describe('Basic Rendering', () => {
        it('renders with default props', () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole('button', { name: /click me/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent('Click me');
        });

        it('renders with custom className', () => {
            render(<Button className="custom-class">Test</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
        });

        it('forwards ref correctly', () => {
            const ref = React.createRef<HTMLButtonElement>();
            render(<Button ref={ref}>Test</Button>);
            expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        });
    });

    describe('Variants', () => {
        it('renders primary variant by default', () => {
            render(<Button>Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-primary-500');
        });

        it('renders secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-white', 'text-primary-500', 'border-2', 'border-primary-500');
        });

        it('renders ghost variant', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-transparent', 'text-primary-500');
        });

        it('renders danger variant', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-error-500', 'text-white');
        });
    });

    describe('Sizes', () => {
        it('renders medium size by default', () => {
            render(<Button>Medium</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('h-11', 'px-4', 'text-body');
        });

        it('renders small size', () => {
            render(<Button size="small">Small</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('h-9', 'px-3', 'text-body-small');
        });

        it('renders large size', () => {
            render(<Button size="large">Large</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('h-13', 'px-6', 'text-body-large');
        });
    });

    describe('Loading State', () => {
        it('shows loading spinner when loading is true', () => {
            render(<Button loading>Loading</Button>);
            const button = screen.getByRole('button');
            const spinner = button.querySelector('svg');

            expect(spinner).toBeInTheDocument();
            expect(spinner).toHaveClass('animate-spin');
            expect(button).toHaveClass('cursor-wait');
        });

        it('is disabled when loading', () => {
            render(<Button loading>Loading</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('aria-disabled', 'true');
        });

        it('hides icons when loading', () => {
            render(
                <Button loading leftIcon={<span data-testid="left-icon">←</span>}>
                    Loading
                </Button>
            );

            expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
        });
    });

    describe('Disabled State', () => {
        it('is disabled when disabled prop is true', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('aria-disabled', 'true');
        });

        it('has disabled styling', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
        });

        it('does not trigger onClick when disabled', () => {
            const handleClick = jest.fn();
            render(<Button disabled onClick={handleClick}>Disabled</Button>);

            const button = screen.getByRole('button');
            fireEvent.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Icons', () => {
        it('renders left icon', () => {
            render(
                <Button leftIcon={<span data-testid="left-icon">←</span>}>
                    With Left Icon
                </Button>
            );

            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('renders right icon', () => {
            render(
                <Button rightIcon={<span data-testid="right-icon">→</span>}>
                    With Right Icon
                </Button>
            );

            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });

        it('renders both left and right icons', () => {
            render(
                <Button
                    leftIcon={<span data-testid="left-icon">←</span>}
                    rightIcon={<span data-testid="right-icon">→</span>}
                >
                    With Both Icons
                </Button>
            );

            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });
    });

    describe('Full Width', () => {
        it('takes full width when fullWidth is true', () => {
            render(<Button fullWidth>Full Width</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('w-full');
        });

        it('does not take full width by default', () => {
            render(<Button>Normal Width</Button>);
            const button = screen.getByRole('button');
            expect(button).not.toHaveClass('w-full');
        });
    });

    describe('Event Handling', () => {
        it('handles click events', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('handles keyboard events', () => {
            const handleKeyDown = jest.fn();
            render(<Button onKeyDown={handleKeyDown}>Press me</Button>);

            const button = screen.getByRole('button');
            fireEvent.keyDown(button, { key: 'Enter' });

            expect(handleKeyDown).toHaveBeenCalledTimes(1);
        });
    });

    describe('Accessibility', () => {
        it('has proper button role', () => {
            render(<Button>Accessible Button</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('supports aria-label', () => {
            render(<Button aria-label="Custom label">Button</Button>);
            const button = screen.getByRole('button', { name: /custom label/i });
            expect(button).toBeInTheDocument();
        });

        it('supports aria-describedby', () => {
            render(
                <>
                    <Button aria-describedby="description">Button</Button>
                    <div id="description">Button description</div>
                </>
            );
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-describedby', 'description');
        });

        it('has focus styles', () => {
            render(<Button>Focusable</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
        });

        it('is keyboard accessible', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Keyboard Accessible</Button>);

            const button = screen.getByRole('button');
            button.focus();
            fireEvent.keyDown(button, { key: 'Enter' });
            fireEvent.keyUp(button, { key: 'Enter' });

            expect(document.activeElement).toBe(button);
        });
    });

    describe('Touch Accessibility', () => {
        it('has minimum touch target size for medium buttons', () => {
            render(<Button size="medium">Touch Friendly</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('h-11'); // 44px minimum
        });

        it('has touch manipulation class', () => {
            render(<Button>Touch Button</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('touch-manipulation');
        });
    });

    describe('Variant Combinations', () => {
        it('combines variant and size classes correctly', () => {
            render(<Button variant="secondary" size="large">Large Secondary</Button>);
            const button = screen.getByRole('button');

            // Should have both secondary variant and large size classes
            expect(button).toHaveClass('bg-white', 'text-primary-500', 'border-2');
            expect(button).toHaveClass('h-13', 'px-6', 'text-body-large');
        });

        it('combines loading with variant correctly', () => {
            render(<Button variant="danger" loading>Loading Danger</Button>);
            const button = screen.getByRole('button');

            expect(button).toHaveClass('bg-error-500', 'cursor-wait');
            expect(button).toBeDisabled();
        });
    });

    describe('HTML Attributes', () => {
        it('passes through HTML button attributes', () => {
            render(
                <Button
                    type="submit"
                    form="test-form"
                    data-testid="custom-button"
                >
                    Submit
                </Button>
            );

            const button = screen.getByTestId('custom-button');
            expect(button).toHaveAttribute('type', 'submit');
            expect(button).toHaveAttribute('form', 'test-form');
        });

        it('supports custom data attributes', () => {
            render(<Button data-analytics="button-click">Analytics Button</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('data-analytics', 'button-click');
        });
    });
});