import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  containerClassName = '',
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Header sẽ được render từ RootLayout */}
      
      {/* Main content */}
      <main className={`flex-1 ${containerClassName}`}>
        {children}
      </main>
      
      {/* Footer sẽ được render từ RootLayout */}
    </div>
  );
};

// Component PageContainer để wrap nội dung trang
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth = '7xl',
  padding = true,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8 py-6' : '';

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

// Component Section để tách biệt các phần nội dung
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'blue' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'transparent',
  padding = 'md',
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-blue-50',
    transparent: 'bg-transparent',
  };

  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
  };

  return (
    <section className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </section>
  );
}; 