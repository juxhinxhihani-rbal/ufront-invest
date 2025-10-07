// This file ensures NextAuth configuration is properly initialized
// by loading secrets early in production environments

let isInitialized = false;

export async function initializeAuth() {
  if (isInitialized) return;
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    console.log('[INIT-AUTH] Initializing authentication for production...');
    
    try {
      // Load secrets and set environment variables
      const { getConfig } = await import('@/utils/secrets');
      await getConfig(); // This will set the environment variables
      
      console.log('[INIT-AUTH] Production authentication initialized successfully');
    } catch (error) {
      console.error('[INIT-AUTH] Failed to initialize production authentication:', error);
      throw error;
    }
  } else {
    console.log('[INIT-AUTH] Development authentication uses .env.local');
  }
  
  isInitialized = true;
}

// Auto-initialize for production
if (process.env.NODE_ENV === 'production') {
  initializeAuth().catch(console.error);
}