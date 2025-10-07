
// This file is no longer needed since we're using Next.js API routes
// The axios instance is replaced with fetch calls to internal API routes

// Legacy function kept for backward compatibility
export function initApi(baseUrl: string): any {
  console.warn('initApi is deprecated. Use Next.js API routes instead.');
  return null;
}

export function getApi(): any {
  console.warn('getApi is deprecated. Use Next.js API routes instead.');
  return null;
}