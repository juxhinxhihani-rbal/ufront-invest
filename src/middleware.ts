import { NextRequest, NextResponse } from 'next/server';

// Simplified middleware - temporarily disable auth checks to prevent redirect loops
export async function middleware(request: NextRequest) {
  // For now, just pass through all requests to avoid redirect loops
  // Authentication will be handled client-side by ProtectedLayout
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/questionnaire/:path*",
    "/summary/:path*",
    "/exchangeRate/:path*",
    "/uploadFile/:path*",
    "/",
    // Exclude API routes, auth routes, and static files
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
};