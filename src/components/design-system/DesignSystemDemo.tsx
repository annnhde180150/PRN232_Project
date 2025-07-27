'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { designSystem } from '@/lib/design-system';
import { cn } from '@/lib/utils';
import { ButtonDemo } from './ButtonDemo';

export function DesignSystemDemo() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="max-w-7xl mx-auto container-padding section-spacing">
            <div className="space-y-12">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-h1 text-gray-900 mb-4">
                        Design System Demo
                    </h1>
                    <p className="text-body-large text-gray-600 mb-6">
                        Hệ thống thiết kế cho ứng dụng dịch vụ giúp việc nhà
                    </p>
                    <button
                        onClick={toggleTheme}
                        className={designSystem.buttonVariants.secondary}
                    >
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                </div>

                {/* Colors */}
                <section className="space-y-6">
                    <h2 className="text-h2 text-gray-900">Colors</h2>

                    <div className="space-y-4">
                        <h3 className="text-h3 text-gray-900">Primary Colors</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {[100, 300, 500, 700, 900].map((shade) => (
                                <div key={shade} className="text-center">
                                    <div
                                        className={`h-16 w-full rounded-lg mb-2`}
                                        style={{ backgroundColor: `var(--color-primary-${shade})` }}
                                    />
                                    <span className="text-caption text-gray-600">{shade}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-h3 text-gray-900">Semantic Colors</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <div
                                    className="h-16 w-full rounded-lg mb-2"
                                    style={{ backgroundColor: 'var(--color-success-500)' }}
                                />
                                <span className="text-caption text-gray-600">Success</span>
                            </div>
                            <div className="text-center">
                                <div
                                    className="h-16 w-full rounded-lg mb-2"
                                    style={{ backgroundColor: 'var(--color-warning-500)' }}
                                />
                                <span className="text-caption text-gray-600">Warning</span>
                            </div>
                            <div className="text-center">
                                <div
                                    className="h-16 w-full rounded-lg mb-2"
                                    style={{ backgroundColor: 'var(--color-error-500)' }}
                                />
                                <span className="text-caption text-gray-600">Error</span>
                            </div>
                            <div className="text-center">
                                <div
                                    className="h-16 w-full rounded-lg mb-2"
                                    style={{ backgroundColor: 'var(--color-info-500)' }}
                                />
                                <span className="text-caption text-gray-600">Info</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography */}
                <section className="space-y-6">
                    <h2 className="text-h2 text-gray-900">Typography</h2>
                    <div className="space-y-4">
                        <div className="text-display text-gray-900">Display Text</div>
                        <div className="text-h1 text-gray-900">Heading 1</div>
                        <div className="text-h2 text-gray-900">Heading 2</div>
                        <div className="text-h3 text-gray-900">Heading 3</div>
                        <div className="text-body-large text-gray-900">Body Large Text</div>
                        <div className="text-body text-gray-900">Body Text</div>
                        <div className="text-body-small text-gray-600">Body Small Text</div>
                        <div className="text-caption text-gray-500">Caption Text</div>
                    </div>
                </section>

                {/* Buttons */}
                <section className="space-y-6">
                    <ButtonDemo />
                </section>

                {/* Cards */}
                <section className="space-y-6">
                    <h2 className="text-h2 text-gray-900">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={designSystem.cardVariants.default}>
                            <h3 className="text-h4 text-gray-900 mb-2">Default Card</h3>
                            <p className="text-body text-gray-600">
                                This is a default card with standard styling.
                            </p>
                        </div>
                        <div className={designSystem.cardVariants.hover}>
                            <h3 className="text-h4 text-gray-900 mb-2">Hover Card</h3>
                            <p className="text-body text-gray-600">
                                This card has hover effects for interactive elements.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Status Indicators */}
                <section className="space-y-6">
                    <h2 className="text-h2 text-gray-900">Status Indicators</h2>
                    <div className="flex flex-wrap gap-4">
                        <span className={designSystem.statusVariants.success}>Success</span>
                        <span className={designSystem.statusVariants.warning}>Warning</span>
                        <span className={designSystem.statusVariants.error}>Error</span>
                        <span className={designSystem.statusVariants.info}>Info</span>
                    </div>
                </section>

                {/* Form Elements */}
                <section className="space-y-6">
                    <h2 className="text-h2 text-gray-900">Form Elements</h2>
                    <div className="max-w-md space-y-4">
                        <div>
                            <label className={designSystem.form.label}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={designSystem.form.input}
                            />
                            <p className={designSystem.form.helper}>
                                We'll never share your email with anyone else.
                            </p>
                        </div>
                        <div>
                            <label className={designSystem.form.label}>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className={designSystem.form.input}
                            />
                            <p className={designSystem.form.error}>
                                Password must be at least 8 characters long.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Spacing */}
                <section className="space-y-6">
                    <h2 className="text-h2 text-gray-900">Spacing</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <div
                                className="bg-primary-500 rounded"
                                style={{ width: '4px', height: '4px' }}
                            ></div>
                            <span className="text-body-small">xs (4px)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className="bg-primary-500 rounded"
                                style={{ width: '8px', height: '8px' }}
                            ></div>
                            <span className="text-body-small">sm (8px)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className="bg-primary-500 rounded"
                                style={{ width: '16px', height: '16px' }}
                            ></div>
                            <span className="text-body-small">md (16px)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div
                                className="bg-primary-500 rounded"
                                style={{ width: '24px', height: '24px' }}
                            ></div>
                            <span className="text-body-small">lg (24px)</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}