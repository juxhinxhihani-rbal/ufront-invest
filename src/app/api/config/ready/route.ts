import { NextRequest, NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/init';

export async function GET(request: NextRequest) {
  try {
    // Ensure secrets are loaded
    await ensureInitialized();
    
    // Check if required environment variables are set
    const requiredVars = [
      'KEYCLOAK_CLIENT_ID',
      'KEYCLOAK_CLIENT_SECRET', 
      'KEYCLOAK_ISSUER',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      return NextResponse.json(
        { 
          ready: false, 
          error: `Missing configuration: ${missing.join(', ')}` 
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json({ ready: true });
    
  } catch (error) {
    console.error('Configuration check failed:', error);
    return NextResponse.json(
      { 
        ready: false, 
        error: 'Configuration loading failed' 
      },
      { status: 503 }
    );
  }
}
