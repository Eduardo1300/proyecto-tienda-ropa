import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`transition-all duration-500 ease-in-out transform ${className}`}
      style={{
        animation: 'fadeInUp 0.5s ease-in-out'
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
