'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '@/lib/design-tokens';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    colors: typeof colors;
    typography: typeof typography;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface DesignSystemProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
}

export function DesignSystemProvider({ children, defaultTheme = 'light' }: DesignSystemProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);

    useEffect(() => {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme') as Theme;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        const initialTheme = savedTheme || systemTheme;
        setThemeState(initialTheme);

        // Apply theme to document
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const value: ThemeContextType = {
        theme,
        toggleTheme,
        setTheme,
        colors,
        typography,
        spacing,
        borderRadius,
        shadows,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a DesignSystemProvider');
    }
    return context;
}

// Hook for accessing design tokens
export function useDesignTokens() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useDesignTokens must be used within a DesignSystemProvider');
    }

    return {
        colors: context.colors,
        typography: context.typography,
        spacing: context.spacing,
        borderRadius: context.borderRadius,
        shadows: context.shadows,
    };
}