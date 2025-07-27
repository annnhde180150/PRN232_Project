/**
 * Design System Utilities
 * Helper functions and utilities for working with the design system
 */

import { colors, typography, spacing, borderRadius, shadows, zIndex, duration, easing } from './design-tokens';
import { cn } from './utils';

// Type definitions for design system
export type ColorScale = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type SpacingScale = keyof typeof spacing;
export type RadiusScale = keyof typeof borderRadius;
export type ShadowScale = keyof typeof shadows;
export type TypographyScale = keyof typeof typography.fontSize;

// Color utilities
export const getColor = (color: keyof typeof colors, scale: ColorScale = '500') => {
    const colorPalette = colors[color];
    if (colorPalette && typeof colorPalette === 'object' && scale in colorPalette) {
        return (colorPalette as any)[scale];
    }
    return colors.primary[500]; // fallback
};

// Spacing utilities
export const getSpacing = (scale: SpacingScale) => {
    return spacing[scale];
};

// Typography utilities
export const getTypography = (scale: TypographyScale) => {
    return typography.fontSize[scale];
};

// Component variant utilities
export const buttonVariants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
} as const;

export const cardVariants = {
    default: 'card',
    hover: 'card-hover',
} as const;

export const statusVariants = {
    success: 'status-success',
    warning: 'status-warning',
    error: 'status-error',
    info: 'status-info',
} as const;

// Responsive utilities
export const breakpoints = {
    mobile: '(min-width: 320px)',
    tablet: '(min-width: 768px)',
    desktop: '(min-width: 1024px)',
    wide: '(min-width: 1280px)',
} as const;

// Animation utilities
export const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    bounceIn: 'animate-bounce-in',
} as const;

// Form utilities
export const form = {
    input: 'input',
    label: 'form-label',
    error: 'form-error',
    helper: 'form-helper',
} as const;

// Layout utilities
export const containerPadding = 'container-padding';
export const sectionSpacing = 'section-spacing';

// Export design tokens for direct use
export {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    zIndex,
    duration,
    easing,
};

// Export commonly used combinations
export const designSystem = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    zIndex,
    duration,
    easing,
    buttonVariants,
    cardVariants,
    statusVariants,
    animations,
    form,
    breakpoints,
    containerPadding,
    sectionSpacing,
} as const;