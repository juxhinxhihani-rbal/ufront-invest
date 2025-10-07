import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/languageContext';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text, 
  size = 'large', 
  className = '',
  fullScreen = true 
}) => {
  const { t } = useLanguage();

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const containerSizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const content = (
    <div className={`text-center ${className}`}>
      <div className="mb-4 flex justify-center">
        <div className={`bg-yellow-100 ${containerSizeClasses[size]} rounded-full shadow-md`}>
          <RefreshCw className={`${sizeClasses[size]} text-yellow-500 animate-spin`} />
        </div>
      </div>
      <p className={`text-gray-600 ${textSizeClasses[size]} font-medium`}>
        {text || t('loading.default') || 'Loading...'}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default LoadingSpinner;