'use client';

import React, { useState } from 'react';
import { TextInput } from './TextInput';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Radio, RadioGroup } from './Radio';

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

const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

/**
 * Demo component showcasing all form input components
 * This demonstrates the usage and features of TextInput, Select, Checkbox, Radio, and RadioGroup
 */
export const FormInputsDemo: React.FC = () => {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        newsletter: false,
        notifications: false,
        plan: '',
        experience: '',
        terms: false,
    });

    // Select options
    const countryOptions = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'au', label: 'Australia' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
    ];

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

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.country) {
            newErrors.country = 'Please select a country';
        }

        if (!formData.plan) {
            newErrors.plan = 'Please select a plan';
        }

        if (!formData.terms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            alert('Form submitted successfully! Check console for data.');
        }
    };

    const handleInputChange = (field: string) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleRadioChange = (field: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user selects
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-h1 text-text-primary mb-4">Form Input Components Demo</h1>
                <p className="text-body text-text-secondary">
                    Comprehensive showcase of all form input components with validation states and accessibility features
                </p>
            </div>

            {/* Basic Examples */}
            <section className="space-y-6">
                <h2 className="text-h2 text-text-primary">Basic Examples</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-h3 text-text-primary">TextInput Variants</h3>

                        <TextInput
                            label="Default Input"
                            placeholder="Enter text here"
                            helperText="This is a helper text"
                        />

                        <TextInput
                            label="With Icons"
                            placeholder="Search..."
                            startIcon={<SearchIcon />}
                            endIcon={<CheckIcon />}
                        />

                        <TextInput
                            label="Success State"
                            value="valid@email.com"
                            success="Email is valid"
                            startIcon={<EmailIcon />}
                        />

                        <TextInput
                            label="Warning State"
                            value="weak"
                            warning="Password is too weak"
                        />

                        <TextInput
                            label="Error State"
                            value="invalid-email"
                            error="Please enter a valid email address"
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-h3 text-text-primary">Select Component</h3>

                        <Select
                            label="Basic Select"
                            placeholder="Choose an option"
                            options={countryOptions.slice(0, 3)}
                            helperText="Select your country"
                        />

                        <Select
                            label="With Error"
                            placeholder="Choose an option"
                            options={countryOptions.slice(0, 3)}
                            error="This field is required"
                        />
                    </div>
                </div>
            </section>

            {/* Size Variations */}
            <section className="space-y-6">
                <h2 className="text-h2 text-text-primary">Size Variations</h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextInput
                            label="Small"
                            size="small"
                            placeholder="Small input"
                        />
                        <TextInput
                            label="Medium (Default)"
                            size="medium"
                            placeholder="Medium input"
                        />
                        <TextInput
                            label="Large"
                            size="large"
                            placeholder="Large input"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Checkbox label="Small checkbox" size="small" />
                        <Checkbox label="Medium checkbox" size="medium" />
                        <Checkbox label="Large checkbox" size="large" />
                    </div>
                </div>
            </section>

            {/* Interactive Form */}
            <section className="space-y-6">
                <h2 className="text-h2 text-text-primary">Interactive Form Example</h2>

                <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-bg-secondary rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            error={errors.name}
                            required
                        />

                        <TextInput
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            error={errors.email}
                            startIcon={<EmailIcon />}
                            required
                        />
                    </div>

                    <Select
                        label="Country"
                        placeholder="Select your country"
                        options={countryOptions}
                        value={formData.country}
                        onChange={handleInputChange('country')}
                        error={errors.country}
                        required
                    />

                    <div className="space-y-4">
                        <Checkbox
                            label="Subscribe to newsletter"
                            helperText="Get updates about new features and promotions"
                            checked={formData.newsletter}
                            onChange={handleInputChange('newsletter')}
                        />

                        <Checkbox
                            label="Enable push notifications"
                            checked={formData.notifications}
                            onChange={handleInputChange('notifications')}
                        />
                    </div>

                    <RadioGroup
                        name="plan"
                        label="Choose your plan"
                        options={planOptions}
                        value={formData.plan}
                        onChange={handleRadioChange('plan')}
                        error={errors.plan}
                        required
                    />

                    <RadioGroup
                        name="experience"
                        label="Experience Level"
                        options={experienceOptions}
                        value={formData.experience}
                        onChange={handleRadioChange('experience')}
                        direction="horizontal"
                        helperText="This helps us customize your experience"
                    />

                    <Checkbox
                        label="I agree to the terms and conditions"
                        checked={formData.terms}
                        onChange={handleInputChange('terms')}
                        error={errors.terms}
                        required
                    />

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                        >
                            Submit Form
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    name: '',
                                    email: '',
                                    country: '',
                                    newsletter: false,
                                    notifications: false,
                                    plan: '',
                                    experience: '',
                                    terms: false,
                                });
                                setErrors({});
                            }}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Reset Form
                        </button>
                    </div>
                </form>
            </section>

            {/* Accessibility Features */}
            <section className="space-y-6">
                <h2 className="text-h2 text-text-primary">Accessibility Features</h2>

                <div className="p-6 bg-bg-secondary rounded-lg space-y-4">
                    <h3 className="text-h3 text-text-primary">Key Accessibility Features:</h3>

                    <ul className="space-y-2 text-body text-text-secondary">
                        <li>• <strong>Keyboard Navigation:</strong> All components are fully keyboard accessible</li>
                        <li>• <strong>Screen Reader Support:</strong> Proper ARIA labels and semantic HTML</li>
                        <li>• <strong>Focus Management:</strong> Clear focus indicators and logical tab order</li>
                        <li>• <strong>Error Announcements:</strong> Error messages are announced to screen readers</li>
                        <li>• <strong>Touch-Friendly:</strong> Minimum 44px touch targets for mobile devices</li>
                        <li>• <strong>High Contrast:</strong> Colors meet WCAG 2.1 AA contrast requirements</li>
                        <li>• <strong>Required Fields:</strong> Clear visual and programmatic indication</li>
                        <li>• <strong>Helper Text:</strong> Associated with form controls via aria-describedby</li>
                    </ul>

                    <div className="mt-4 p-4 bg-info-50 border border-info-200 rounded-lg">
                        <p className="text-body-small text-info-700">
                            <strong>Try it:</strong> Use Tab, Shift+Tab, Enter, Space, and Arrow keys to navigate through the form components above.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};