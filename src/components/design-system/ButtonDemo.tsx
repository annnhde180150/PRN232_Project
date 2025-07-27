import React, { useState } from 'react';
import { Button } from './Button';

/**
 * Demo component showcasing all Button variants, sizes, and states
 */
export const ButtonDemo: React.FC = () => {
    const [loading, setLoading] = useState<string | null>(null);

    const handleLoadingDemo = (buttonId: string) => {
        setLoading(buttonId);
        setTimeout(() => setLoading(null), 2000);
    };

    return (
        <div className="space-y-8 p-6">
            <div>
                <h2 className="text-h2 mb-4">Button Component Demo</h2>
                <p className="text-body text-text-secondary mb-6">
                    Comprehensive showcase of the Button component with all variants, sizes, and states.
                </p>
            </div>

            {/* Variants */}
            <section>
                <h3 className="text-h3 mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="danger">Danger Button</Button>
                </div>
            </section>

            {/* Sizes */}
            <section>
                <h3 className="text-h3 mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                    <Button size="small">Small Button</Button>
                    <Button size="medium">Medium Button</Button>
                    <Button size="large">Large Button</Button>
                </div>
            </section>

            {/* Loading States */}
            <section>
                <h3 className="text-h3 mb-4">Loading States</h3>
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant="primary"
                        loading={loading === 'primary'}
                        onClick={() => handleLoadingDemo('primary')}
                    >
                        {loading === 'primary' ? 'Loading...' : 'Click for Loading'}
                    </Button>
                    <Button
                        variant="secondary"
                        loading={loading === 'secondary'}
                        onClick={() => handleLoadingDemo('secondary')}
                    >
                        {loading === 'secondary' ? 'Loading...' : 'Secondary Loading'}
                    </Button>
                    <Button
                        variant="danger"
                        loading={loading === 'danger'}
                        onClick={() => handleLoadingDemo('danger')}
                    >
                        {loading === 'danger' ? 'Processing...' : 'Danger Loading'}
                    </Button>
                </div>
            </section>

            {/* Disabled States */}
            <section>
                <h3 className="text-h3 mb-4">Disabled States</h3>
                <div className="flex flex-wrap gap-4">
                    <Button variant="primary" disabled>Disabled Primary</Button>
                    <Button variant="secondary" disabled>Disabled Secondary</Button>
                    <Button variant="ghost" disabled>Disabled Ghost</Button>
                    <Button variant="danger" disabled>Disabled Danger</Button>
                </div>
            </section>

            {/* With Icons */}
            <section>
                <h3 className="text-h3 mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant="primary"
                        leftIcon={
                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    >
                        Add Item
                    </Button>
                    <Button
                        variant="secondary"
                        rightIcon={
                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        }
                    >
                        Continue
                    </Button>
                    <Button
                        variant="ghost"
                        leftIcon={
                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        }
                    >
                        Back
                    </Button>
                    <Button
                        variant="danger"
                        leftIcon={
                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        }
                    >
                        Delete
                    </Button>
                </div>
            </section>

            {/* Full Width */}
            <section>
                <h3 className="text-h3 mb-4">Full Width</h3>
                <div className="space-y-3 max-w-md">
                    <Button variant="primary" fullWidth>Full Width Primary</Button>
                    <Button variant="secondary" fullWidth>Full Width Secondary</Button>
                </div>
            </section>

            {/* Size and Variant Combinations */}
            <section>
                <h3 className="text-h3 mb-4">Size and Variant Combinations</h3>
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-body-small text-text-secondary w-16">Small:</span>
                        <Button variant="primary" size="small">Primary</Button>
                        <Button variant="secondary" size="small">Secondary</Button>
                        <Button variant="ghost" size="small">Ghost</Button>
                        <Button variant="danger" size="small">Danger</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-body-small text-text-secondary w-16">Medium:</span>
                        <Button variant="primary" size="medium">Primary</Button>
                        <Button variant="secondary" size="medium">Secondary</Button>
                        <Button variant="ghost" size="medium">Ghost</Button>
                        <Button variant="danger" size="medium">Danger</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-body-small text-text-secondary w-16">Large:</span>
                        <Button variant="primary" size="large">Primary</Button>
                        <Button variant="secondary" size="large">Secondary</Button>
                        <Button variant="ghost" size="large">Ghost</Button>
                        <Button variant="danger" size="large">Danger</Button>
                    </div>
                </div>
            </section>

            {/* Interactive Examples */}
            <section>
                <h3 className="text-h3 mb-4">Interactive Examples</h3>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <Button
                            variant="primary"
                            onClick={() => alert('Primary button clicked!')}
                        >
                            Click Me
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => console.log('Secondary button clicked')}
                        >
                            Log to Console
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => window.open('https://example.com', '_blank')}
                        >
                            Open Link
                        </Button>
                    </div>
                </div>
            </section>

            {/* Accessibility Examples */}
            <section>
                <h3 className="text-h3 mb-4">Accessibility Examples</h3>
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant="primary"
                        aria-label="Save document with keyboard shortcut Ctrl+S"
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        aria-describedby="help-text"
                    >
                        Help
                    </Button>
                    <p id="help-text" className="text-body-small text-text-secondary mt-2">
                        This button opens the help documentation
                    </p>
                </div>
            </section>
        </div>
    );
};