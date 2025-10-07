import { ensureInitialized } from "@/lib/init";

// Dynamic handler that loads secrets before creating auth config
const createHandler = async () => {
  try {
    console.log('[NEXTAUTH ROUTE] Starting NextAuth configuration...');
    
    // Ensure secrets are loaded first
    await ensureInitialized();
    console.log('[NEXTAUTH ROUTE] Secrets initialization completed');
    
    // Import NextAuth only after secrets are loaded
    const { default: NextAuth } = await import("next-auth");
    
    // Import the dynamic auth options function
    const { getAuthOptions } = await import("@/lib/auth");
    
    // This will load secrets and create the auth config
    const authOptions = await getAuthOptions();
    
    console.log('[NEXTAUTH ROUTE] Auth configuration created successfully');
    return NextAuth(authOptions);
    
  } catch (error) {
    console.error('[NEXTAUTH ROUTE] Failed to create NextAuth configuration:', error);
    
    // Return a basic error handler instead of throwing
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      async GET() {
        return new Response(
          JSON.stringify({ 
            error: 'Authentication system not ready',
            message: errorMessage,
            timestamp: new Date().toISOString()
          }), 
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      },
      async POST() {
        return new Response(
          JSON.stringify({ 
            error: 'Authentication system not ready',
            message: errorMessage,
            timestamp: new Date().toISOString()
          }), 
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    };
  }
};

// Create the handler
const handlerPromise = createHandler();

// Export GET and POST handlers
export async function GET(request: Request, context: any) {
  try {
    const handler = await handlerPromise;
    
    // Check if it's an error handler
    if (typeof handler.GET === 'function') {
      return handler.GET();
    }
    
    return handler(request, context);
  } catch (error) {
    console.error('[NEXTAUTH GET] Handler failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Authentication system error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: Request, context: any) {
  try {
    const handler = await handlerPromise;
    
    // Check if it's an error handler
    if (typeof handler.POST === 'function') {
      return handler.POST();
    }
    
    return handler(request, context);
  } catch (error) {
    console.error('[NEXTAUTH POST] Handler failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Authentication system error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
