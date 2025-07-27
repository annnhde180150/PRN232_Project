'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationState {
    currentPath: string;
    previousPath: string | null;
    isBottomNavVisible: boolean;
    isSidebarCollapsed: boolean;
    searchQuery: string;
    searchHistory: string[];
}

interface NavigationContextType {
    state: NavigationState;
    setBottomNavVisible: (visible: boolean) => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setSearchQuery: (query: string) => void;
    addToSearchHistory: (query: string) => void;
    clearSearchHistory: () => void;
    navigateBack: () => void;
    canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
    children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const pathname = usePathname();

    const [state, setState] = useState<NavigationState>({
        currentPath: pathname,
        previousPath: null,
        isBottomNavVisible: true,
        isSidebarCollapsed: false,
        searchQuery: '',
        searchHistory: []
    });

    // Update current path and track previous path
    useEffect(() => {
        setState(prev => ({
            ...prev,
            previousPath: prev.currentPath !== pathname ? prev.currentPath : prev.previousPath,
            currentPath: pathname
        }));
    }, [pathname]);

    // Auto-hide bottom navigation on certain pages
    useEffect(() => {
        const hideBottomNavPaths = [
            '/login',
            '/register',
            '/onboarding',
            '/chat/', // Hide on individual chat pages
            '/booking/payment',
            '/booking/confirmation'
        ];

        const shouldHide = hideBottomNavPaths.some(path =>
            pathname === path || pathname.startsWith(path)
        );

        setState(prev => ({
            ...prev,
            isBottomNavVisible: !shouldHide
        }));
    }, [pathname]);

    // Load search history from localStorage
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('searchHistory');
            if (savedHistory) {
                const history = JSON.parse(savedHistory);
                setState(prev => ({
                    ...prev,
                    searchHistory: Array.isArray(history) ? history.slice(0, 10) : []
                }));
            }
        } catch (error) {
            console.error('Error loading search history:', error);
        }
    }, []);

    const setBottomNavVisible = useCallback((visible: boolean) => {
        setState(prev => ({
            ...prev,
            isBottomNavVisible: visible
        }));
    }, []);

    const setSidebarCollapsed = useCallback((collapsed: boolean) => {
        setState(prev => ({
            ...prev,
            isSidebarCollapsed: collapsed
        }));

        // Save to localStorage
        try {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
        } catch (error) {
            console.error('Error saving sidebar state:', error);
        }
    }, []);

    const setSearchQuery = useCallback((query: string) => {
        setState(prev => ({
            ...prev,
            searchQuery: query
        }));
    }, []);

    const addToSearchHistory = useCallback((query: string) => {
        if (!query.trim()) return;

        setState(prev => {
            const newHistory = [
                query.trim(),
                ...prev.searchHistory.filter(item => item !== query.trim())
            ].slice(0, 10);

            // Save to localStorage
            try {
                localStorage.setItem('searchHistory', JSON.stringify(newHistory));
            } catch (error) {
                console.error('Error saving search history:', error);
            }

            return {
                ...prev,
                searchHistory: newHistory
            };
        });
    }, []);

    const clearSearchHistory = useCallback(() => {
        setState(prev => ({
            ...prev,
            searchHistory: []
        }));

        try {
            localStorage.removeItem('searchHistory');
        } catch (error) {
            console.error('Error clearing search history:', error);
        }
    }, []);

    const navigateBack = useCallback(() => {
        if (state.previousPath && typeof window !== 'undefined') {
            window.history.back();
        }
    }, [state.previousPath]);

    const canGoBack = Boolean(state.previousPath);

    // Load sidebar collapsed state from localStorage
    useEffect(() => {
        try {
            const savedCollapsed = localStorage.getItem('sidebarCollapsed');
            if (savedCollapsed) {
                const collapsed = JSON.parse(savedCollapsed);
                setState(prev => ({
                    ...prev,
                    isSidebarCollapsed: Boolean(collapsed)
                }));
            }
        } catch (error) {
            console.error('Error loading sidebar state:', error);
        }
    }, []);

    const contextValue: NavigationContextType = {
        state,
        setBottomNavVisible,
        setSidebarCollapsed,
        setSearchQuery,
        addToSearchHistory,
        clearSearchHistory,
        navigateBack,
        canGoBack
    };

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};