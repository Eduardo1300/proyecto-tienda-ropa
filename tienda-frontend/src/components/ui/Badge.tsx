import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  pulse = false
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-primary-light/20 text-primary dark:bg-primary-dark/30 dark:text-primary-light',
    secondary: 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-700/20 dark:text-green-300',
    warning: 'bg-accent-light/20 text-accent dark:bg-accent-dark/30 dark:text-accent-light',
    danger: 'bg-red-100 text-red-800 dark:bg-red-700/20 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-700/20 dark:text-blue-300'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const pulseClass = pulse ? 'animate-pulse' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${pulseClass} ${className}`;
  
  return (
    <span className={classes}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
