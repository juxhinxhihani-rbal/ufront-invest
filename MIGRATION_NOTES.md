# React + Vite Migration - Investment Platform

This document outlines the changes made to convert the project from Next.js to React + Vite, with Keycloak authentication removed.

## Changes Made

### 1. Configuration Files

#### package.json
- Removed Next.js and NextAuth dependencies
- Removed Keycloak-related packages
- Added Vite and React Router dependencies
- Updated scripts to use Vite instead of Next.js
- Added `"type": "module"` for ES modules

#### tsconfig.json
- Updated for Vite compatibility
- Changed target to ES2020
- Set jsx to "react-jsx"
- Configured for Vite bundler

#### vite.config.ts (NEW)
- Created Vite configuration
- Set up path aliases (@/)
- Configured dev server on port 3000

#### tsconfig.node.json (NEW)
- Created for Vite configuration file

### 2. Entry Points

#### index.html
- Updated to point to `/src/main.tsx`
- Set title to "Investment Platform"

#### src/main.tsx (NEW)
- Created React entry point
- Renders App component with React Router

#### src/App.tsx (NEW)
- Created main App component
- Set up React Router with all routes
- Wrapped in LanguageProvider
- Routes: /, /exchangeRate, /uploadFile, /reportsTable, /questionnaire, /fundConfiguration

### 3. Component Updates

#### src/components/DashboardScreen.tsx
- Removed `"use client"` directive
- Changed from `next/link` to `react-router-dom`
- Removed authentication/role checks
- Set all permissions to `true` (no auth required)
- Removed `useHasNoRoles` hook

#### src/components/layout/MainLayout.tsx
- Removed `"use client"` directive
- Changed from `usePathname` (Next.js) to `useLocation` (React Router)
- Removed all authentication checks
- Removed AccessDenied component
- Set all permissions to `true`

#### src/components/layout/Sidebar.tsx
- Removed `"use client"` directive
- Changed from `next/link` to `react-router-dom`
- Changed `href` props to `to` props
- Removed `useRouter` and `usePathname` (Next.js)
- Used `useLocation` from React Router

#### src/context/languageContext.tsx
- Removed `"use client"` directive
- No other changes needed (already compatible)

### 4. CSS

#### src/index.css
- Copied from src/app/globals.css
- Contains Tailwind imports and custom styles

## Removed Files/Dependencies

The following have been removed from the codebase:
- All Keycloak authentication logic
- NextAuth configuration
- Protected layout components
- Role-based access control hooks (useUserRoles)
- Access denied screens
- JWT token decoding utilities
- Authentication middleware

## What Still Needs To Be Done

### CRITICAL: Dependencies Installation Issue

The current node_modules installation is **corrupted/incomplete**. Many required dependencies are UNMET including:
- react and react-dom
- tailwindcss, postcss, autoprefixer
- Most chart and utility libraries

**You MUST perform a clean reinstall:**

1. **Clean Install (REQUIRED)**
   ```bash
   # Remove all old dependencies and caches
   rm -rf node_modules package-lock.json .next

   # Clean npm cache
   npm cache clean --force

   # Fresh install
   npm install
   ```

2. **Verify Installation**
   ```bash
   npm list --depth=0
   # Should show NO "UNMET DEPENDENCY" errors
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Update API Routes**
   - Next.js API routes in `/src/app/api/*` need to be replaced with a backend solution
   - Consider using Express.js, Fastify, or similar
   - Or deploy serverless functions separately

5. **Environment Variables**
   - Vite uses `VITE_` prefix for public environment variables
   - Update `.env` file if needed:
     ```
     VITE_API_URL=your_api_url
     ```

6. **Static Assets**
   - Ensure all static assets in `/public` are accessible
   - Vite serves files from `/public` directory automatically

## Key Differences: Next.js vs Vite + React Router

| Feature | Next.js | Vite + React Router |
|---------|---------|---------------------|
| Routing | File-based | Component-based (Routes) |
| Links | `<Link href="/path">` | `<Link to="/path">` |
| Navigation | `useRouter()`, `usePathname()` | `useNavigate()`, `useLocation()` |
| API Routes | Built-in `/pages/api` | Separate backend needed |
| Environment | `NEXT_PUBLIC_*` | `VITE_*` |
| Client Directive | `"use client"` | Not needed |
| SSR | Built-in | Not included (CSR only) |

## Notes

- All authentication has been removed - the app is now public
- All role-based permissions are set to `true` by default
- The sidebar and all features are accessible to everyone
- API routes will need to be implemented separately
- This is now a pure client-side application (SPA)

## Testing

After installation, test the following:
1. Navigate to http://localhost:3000
2. Check all navigation links work
3. Verify language switching works
4. Test all features are accessible
5. Ensure no console errors
