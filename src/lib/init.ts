// Global initialization to ensure secrets are loaded before the app starts
import { initializeSecrets } from '../utils/secrets';

let initializationPromise: Promise<void> | null = null;
let isInitialized = false;

export async function ensureInitialized(): Promise<void> {
  // If already initialized, return immediately
  if (isInitialized) {
    console.log('[INIT] Already initialized, returning cached result');
    return;
  }
  
  // If initialization is already in progress, wait for it
  if (initializationPromise) {
    console.log('[INIT] Initialization already in progress, waiting...');
    return initializationPromise;
  }
  
  console.log('[INIT] Starting configuration initialization...');
  
  // Create the initialization promise
  initializationPromise = (async () => {
    try {
      await initializeSecrets();
      isInitialized = true;
      console.log('[INIT] Configuration initialization completed successfully');
    } catch (error) {
      console.error('[INIT] Configuration initialization failed:', error);
      // Reset promise to allow retries on failure
      initializationPromise = null;
      throw error;
    }
  })();
  
  return initializationPromise;
}
