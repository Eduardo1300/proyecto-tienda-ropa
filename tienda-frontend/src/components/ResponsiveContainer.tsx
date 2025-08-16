import React from 'react';
import type { ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md'
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-7xl';
    }
  };

  const getPaddingClass = () => {
    if (padding === 'none') return '';
    
    const basePadding = {
      sm: 'px-2 py-1',
      md: 'px-4 py-2',
      lg: 'px-6 py-4',
      xl: 'px-8 py-6'
    };

    const mobilePadding = {
      sm: 'px-2 py-1',
      md: 'px-3 py-2',
      lg: 'px-4 py-3',
      xl: 'px-4 py-4'
    };

    return isMobile ? mobilePadding[padding] : basePadding[padding];
  };

  const getResponsiveClasses = () => {
    let classes = 'mx-auto w-full';
    
    if (isMobile) {
      classes += ' container-mobile';
    } else if (isTablet) {
      classes += ' container-tablet';
    } else {
      classes += ' container-desktop';
    }

    return classes;
  };

  return (
    <div className={`${getResponsiveClasses()} ${getMaxWidthClass()} ${getPaddingClass()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
