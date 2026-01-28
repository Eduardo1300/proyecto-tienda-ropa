import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'lg',
  rounded = 'xl',
  hover = false,
  gradient = false
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 transition-all duration-200';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg', // Removed hover for consistency with global card-hover
    xl: 'shadow-xl'  // Removed hover for consistency with global card-hover
  };
  
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };
  
  const hoverClass = hover ? 'cursor-pointer card-hover' : ''; // Use global card-hover
  const gradientClass = gradient ? 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-900' : '';
  
  const classes = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${hoverClass}
    ${gradientClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return <div className={classes}>{children}</div>;
};

export default Card;
