import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Check environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      AWS_REGION: process.env.AWS_REGION || 'not-set',
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? 'set' : 'not-set',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? 'set' : 'not-set',
      AWS_PROFILE: process.env.AWS_PROFILE || 'not-set',
      AWS_ROLE_ARN: process.env.AWS_ROLE_ARN || 'not-set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'not-set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not-set',
      KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID ? 'set' : 'not-set',
      KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET ? 'set' : 'not-set',
      KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER || 'not-set',
    };
    
    let secretsStatus = 'not-applicable';
    let secretsError = null;
    
    if (isProduction) {
      try {
        const { getConfig } = await import('@/utils/secrets');
        await getConfig();
        secretsStatus = 'loaded-successfully';
      } catch (error) {
        secretsStatus = 'failed-to-load';
        secretsError = error instanceof Error ? error.message : String(error);
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envVars,
      secretsStatus,
      secretsError,
      isProduction,
      readyForAuth: isProduction ? 
        (secretsStatus === 'loaded-successfully') : 
        !!(envVars.NEXTAUTH_SECRET !== 'not-set' && envVars.KEYCLOAK_CLIENT_ID !== 'not-set')
    });
    
  } catch (error) {
    console.error('Debug endpoint failed:', error);
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
