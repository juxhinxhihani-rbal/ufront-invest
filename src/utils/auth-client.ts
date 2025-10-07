// Utility to re-export NextAuth client functions
// This can be used as an alternative if there are still TypeScript issues with direct imports

export { 
  signIn, 
  signOut, 
  getSession, 
  getProviders, 
  getCsrfToken, 
  useSession, 
  SessionProvider 
} from "next-auth/react";

export type { Session } from "next-auth";