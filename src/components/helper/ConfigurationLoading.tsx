"use client";

import { useEffect, useState } from 'react';

interface ConfigurationLoadingProps {
  children: React.ReactNode;
}

// Simple loading spinner without language context dependencies
function SimpleLoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function ConfigurationLoading({ children }: ConfigurationLoadingProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Always check initialization in production, skip only in development
        if (process.env.NODE_ENV === 'production') {
          // Multiple checks with shorter intervals to catch initialization faster
          let attempts = 0;
          const maxAttempts = 10;
          
          while (attempts < maxAttempts) {
            try {
              const response = await fetch('/api/config/ready');
              
              if (response.ok) {
                console.log('[CONFIG-LOADING] Production configuration verified as ready');
                setIsInitialized(true);
                return;
              }
              
              // If not ready, wait a bit and try again
              attempts++;
              if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
              
            } catch (fetchError) {
              attempts++;
              if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          
          // If we get here, all attempts failed
          throw new Error('Configuration verification failed after multiple attempts');
          
        } else {
          console.log('[CONFIG-LOADING] Development mode, skipping configuration check');
          setIsInitialized(true);
        }
        
      } catch (error) {
        console.error('Configuration loading failed:', error);
        setError('Configuration loading failed. Please try refreshing the page.');
        
        // Retry after 3 seconds for production issues (like pod restart)
        setTimeout(() => {
          setError(null);
          initializeApp();
        }, 3000);
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8">
          <div className="text-red-600 text-xl mb-4">Configuration Error</div>
          <div className="text-gray-700 mb-4">{error}</div>
          <div className="text-sm text-gray-500">Retrying automatically...</div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8">
          <SimpleLoadingSpinner />
          <div className="mt-4 text-lg text-gray-700">Loading Configuration...</div>
          <div className="text-sm text-gray-500 mt-2">
            Please wait while we load the application settings.
          </div>
          <div className="text-xs text-gray-400 mt-4">
            This may take a few moments during pod restart...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
