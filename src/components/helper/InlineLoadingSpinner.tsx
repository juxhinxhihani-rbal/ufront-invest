import React from 'react';
import { RefreshCw } from 'lucide-react';

interface InlineLoadingSpinnerProps {
  text?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const InlineLoadingSpinner: React.FC<InlineLoadingSpinnerProps> = ({ 
  text, 
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base'
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <RefreshCw className={`${sizeClasses[size]} text-gray-500 animate-spin`} />
      {text && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default InlineLoadingSpinner;