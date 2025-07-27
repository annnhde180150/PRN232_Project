/**
 * Design Tokens for Home Service App
 * Based on the design document specifications
 */

// Color Palette - Using OKLCH color space for better perceptual uniformity
export const colors = {
    // Primary Colors
    primary: {
        50: 'oklch(0.95 0.05 241.966)',
        100: 'oklch(0.9 0.08 241.966)',
        200: 'oklch(0.8 0.12 241.966)',
        300: 'oklch(0.7 0.14 241.966)',
        400: 'oklch(0.6 0.16 241.966)',
        500: 'oklch(0.588 0.158 241.966)', // Primary Blue #2563eb
        600: 'oklch(0.5 0.134 242.749)',   // Primary Blue Dark #1d4ed8
        700: 'oklch(0.45 0.12 242.749)',
        800: 'oklch(0.4 0.1 242.749)',
        900: 'oklch(0.35 0.08 242.749)',
    },

    // Secondary Colors
    success: {
        50: 'oklch(0.95 0.05 149.214)',
        100: 'oklch(0.9 0.08 149.214)',
        200: 'oklch(0.8 0.12 149.214)',
        300: 'oklch(0.7 0.15 149.214)',
        400: 'oklch(0.65 0.17 149.214)',
        500: 'oklch(0.627 0.194 149.214)', // Success Green #16a34a
        600: 'oklch(0.55 0.18 149.214)',
        700: 'oklch(0.5 0.16 149.214)',
        800: 'oklch(0.45 0.14 149.214)',
        900: 'oklch(0.4 0.12 149.214)',
    },

    warning: {
        50: 'oklch(0.95 0.05 70.08)',
        100: 'oklch(0.9 0.08 70.08)',
        200: 'oklch(0.85 0.12 70.08)',
        300: 'oklch(0.8 0.15 70.08)',
        400: 'oklch(0.775 0.17 70.08)',
        500: 'oklch(0.769 0.188 70.08)', // Warning Amber #f59e0b
        600: 'oklch(0.7 0.18 70.08)',
        700: 'oklch(0.65 0.16 70.08)',
        800: 'oklch(0.6 0.14 70.08)',
        900: 'oklch(0.55 0.12 70.08)',
    },

    error: {
        50: 'oklch(0.95 0.05 25.331)',
        100: 'oklch(0.9 0.08 25.331)',
        200: 'oklch(0.8 0.12 25.331)',
        300: 'oklch(0.7 0.16 25.331)',
        400: 'oklch(0.65 0.2 25.331)',
        500: 'oklch(0.637 0.237 25.331)', // Error Red #dc2626
        600: 'oklch(0.55 0.22 25.331)',
        700: 'oklch(0.5 0.2 25.331)',
        800: 'oklch(0.45 0.18 25.331)',
        900: 'oklch(0.4 0.16 25.331)',
    },

    info: {
        50: 'oklch(0.95 0.05 215.221)',
        100: 'oklch(0.9 0.08 215.221)',
        200: 'oklch(0.8 0.11 215.221)',
        300: 'oklch(0.75 0.13 215.221)',
        400: 'oklch(0.72 0.14 215.221)',
        500: 'oklch(0.715 0.143 215.221)', // Info Cyan #06b6d4
        600: 'oklch(0.65 0.13 215.221)',
        700: 'oklch(0.6 0.12 215.221)',
        800: 'oklch(0.55 0.11 215.221)',
        900: 'oklch(0.5 0.1 215.221)',
    },

    // Neutral Colors
    gray: {
        50: 'oklch(0.985 0.002 247.839)',  // #f8fafc
        100: 'oklch(0.967 0.003 264.542)', // #f1f5f9
        200: 'oklch(0.928 0.006 264.531)', // #e2e8f0
        300: 'oklch(0.87 0.015 264.531)',
        400: 'oklch(0.75 0.02 264.364)',
        500: 'oklch(0.551 0.027 264.364)', // #64748b
        600: 'oklch(0.45 0.03 264.364)',
        700: 'oklch(0.35 0.032 264.665)',
        800: 'oklch(0.25 0.033 264.665)',
        900: 'oklch(0.21 0.034 264.665)',  // #0f172a
    },

    // Semantic Colors
    background: {
        primary: 'oklch(1 0 0)',           // White
        secondary: 'oklch(0.985 0.002 247.839)', // Gray 50
        tertiary: 'oklch(0.967 0.003 264.542)',  // Gray 100
    },

    text: {
        primary: 'oklch(0.21 0.034 264.665)',    // Gray 900
        secondary: 'oklch(0.551 0.027 264.364)', // Gray 500
        tertiary: 'oklch(0.75 0.02 264.364)',    // Gray 400
        inverse: 'oklch(1 0 0)',                 // White
    },
} as const;

// Typography Scale
export const typography = {
    fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
    },

    fontSize: {
        // Display
        display: {
            size: '48px',
            lineHeight: '52px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
        },

        // Headings
        h1: {
            size: '36px',
            lineHeight: '40px',
            fontWeight: '600',
            letterSpacing: '-0.01em',
        },
        h2: {
            size: '30px',
            lineHeight: '36px',
            fontWeight: '600',
            letterSpacing: '-0.01em',
        },
        h3: {
            size: '24px',
            lineHeight: '32px',
            fontWeight: '600',
            letterSpacing: '0',
        },
        h4: {
            size: '20px',
            lineHeight: '28px',
            fontWeight: '600',
            letterSpacing: '0',
        },
        h5: {
            size: '18px',
            lineHeight: '24px',
            fontWeight: '600',
            letterSpacing: '0',
        },
        h6: {
            size: '16px',
            lineHeight: '20px',
            fontWeight: '600',
            letterSpacing: '0',
        },

        // Body Text
        'body-large': {
            size: '18px',
            lineHeight: '28px',
            fontWeight: '400',
            letterSpacing: '0',
        },
        body: {
            size: '16px',
            lineHeight: '24px',
            fontWeight: '400',
            letterSpacing: '0',
        },
        'body-small': {
            size: '14px',
            lineHeight: '20px',
            fontWeight: '400',
            letterSpacing: '0',
        },
        caption: {
            size: '12px',
            lineHeight: '16px',
            fontWeight: '500',
            letterSpacing: '0.025em',
        },
    },
} as const;

// Spacing System - 8px base with 1.5 ratio
export const spacing = {
    xs: '4px',    // 0.25rem
    sm: '8px',    // 0.5rem
    md: '16px',   // 1rem
    lg: '24px',   // 1.5rem
    xl: '32px',   // 2rem
    '2xl': '48px', // 3rem
    '3xl': '64px', // 4rem
    '4xl': '96px', // 6rem
    '5xl': '128px', // 8rem
} as const;

// Border Radius
export const borderRadius = {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
} as const;

// Shadows
export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    lg: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    xl: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '2xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Z-Index Scale
export const zIndex = {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
} as const;

// Breakpoints for responsive design
export const breakpoints = {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
} as const;

// Animation durations
export const duration = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
} as const;

// Easing functions
export const easing = {
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;