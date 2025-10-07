import { NextAuthOptions, SessionStrategy } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export async function getAuthOptions(): Promise<NextAuthOptions> {
  // In production, ensure secrets are loaded before creating auth config
  if (process.env.NODE_ENV === 'production') {
    try {
      const { getConfig } = await import('@/utils/secrets');
      await getConfig(); // This will set the environment variables
      
      // Wait a bit to ensure environment variables are properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to load secrets for NextAuth:', error);
      throw new Error('Authentication configuration failed to load');
    }
  }

  // Validate that required environment variables are now set
  const requiredVars = {
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('Missing environment variables after secrets loading:', missing);
    console.error('Current environment state:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID ? 'SET' : 'MISSING'
    });
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. This might be a pod restart issue.`);
  }

  return {
    debug: false,
    providers: [
      KeycloakProvider({
        clientId: process.env.KEYCLOAK_CLIENT_ID!,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
        issuer: process.env.KEYCLOAK_ISSUER!,
        authorization: {
          params: {
            prompt: "login",
            scope: "openid email profile",
          }
        },
      }),
    ],
    pages: {
      signIn: "/auth/signin",
      error: "/auth/signin",
    },
    session: {
      strategy: "jwt" as SessionStrategy,
    },
    callbacks: {
      async jwt({ token, account }: { token: any; account: any | null }) {
        if (account && account.access_token) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token }: { session: any; token: any }) {
        session.accessToken = token.accessToken;
        return session;
      },
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        const actualBaseUrl = process.env.NEXTAUTH_URL || baseUrl;
        
        if (url.startsWith("/")) return `${actualBaseUrl}${url}`;
        else if (new URL(url).origin === actualBaseUrl) return url;
        return actualBaseUrl;
      },
    },
  };
}

// Note: The legacy authOptions export has been removed to prevent NO_SECRET errors.
// All code should now use getAuthOptions() which properly waits for secrets to load.