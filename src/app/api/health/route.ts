import { NextRequest, NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/init';

export async function GET(request: NextRequest) {
  try {
    // Ensure secrets are loaded
    await ensureInitialized();
    
    // In production, verify all required configurations are present
    if (process.env.NODE_ENV === 'production') {
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
            status: 'unhealthy',
            message: `Missing configuration: ${missing.join(', ')}`,
            timestamp: new Date().toISOString()
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json({ 
      status: 'healthy',
      message: 'Application is ready',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        message: 'Configuration loading failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
