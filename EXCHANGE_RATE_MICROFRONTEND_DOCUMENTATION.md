# Exchange Rate Microfrontend - Technical Documentation

## Overview

This document provides comprehensive technical documentation for the Exchange Rate Microfrontend implementation within the RBAL Luka Portal ecosystem. The solution demonstrates modern microfrontend architecture patterns using single-spa framework integration.

## Table of Contents

1. [Solution Architecture](#solution-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Portal Integration](#portal-integration)
5. [API Integration](#api-integration)
6. [Development Setup](#development-setup)
7. [Build & Deployment](#build--deployment)
8. [Testing Strategy](#testing-strategy)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting](#troubleshooting)

---

## Solution Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RBAL Luka Portal (Shell)                    │
│                     https://localhost:5180/                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Customer      │  │   Exchange      │  │    Payment      │ │
│  │   Overview      │  │     Rate        │  │   Overview      │ │
│  │  Microfrontend  │  │  Microfrontend  │  │  Microfrontend  │ │
│  │                 │  │                 │  │                 │ │
│  │  Port: 15714    │  │  Port: 16727    │  │  Port: 17714    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │    External API         │
                    │  Investment Backend     │
                    │  Exchange Rate Service  │
                    └─────────────────────────┘
```

### Microfrontend Architecture Principles

1. **Independent Deployment**: Each microfrontend can be developed, tested, and deployed independently
2. **Technology Agnostic**: Different microfrontends can use different React versions, state management, or even different frameworks
3. **Shared Dependencies**: Common libraries (React, Emotion) are shared at runtime to reduce bundle size
4. **Portal Integration**: Centralized routing, authentication, and shared services through the portal shell

### Single-SPA Integration Pattern

```typescript
// Lifecycle Management
export const { bootstrap, mount, unmount, update } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    console.error('Microfrontend error:', err);
    return <div>Something went wrong in Exchange Rate microfrontend</div>;
  },
});
```

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI Library |
| **TypeScript** | ^4.9.4 | Type Safety |
| **Single-SPA** | ^5.9.4 | Microfrontend Orchestration |
| **Vite** | ^4.4.0 | Build Tool & Dev Server |
| **Emotion** | 11.14.0 | CSS-in-JS Styling |
| **React Query** | ^3.39.2 | Data Fetching & Caching |
| **React Router** | ^6.3.0 | Client-side Routing |
| **Lucide React** | ^0.263.1 | Icon Library |

### Development Tools

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (inherited from portal)
- **Vite Dev Server**: Hot module replacement during development
- **TypeScript Compiler**: Type checking and compilation

---

## Project Structure

```
rbal-exchange-rate-ufront/
├── public/
├── src/
│   ├── components/
│   │   ├── ExchangeRateScreen.tsx      # Legacy component
│   │   ├── ModernExchangeRateScreen.tsx # New modern UI component
│   │   └── LoadingIndicator.tsx        # Loading component
│   ├── services/
│   │   └── ExchangeRateService.ts      # API service layer
│   ├── mocks/
│   │   ├── portalShell.ts             # Portal context mocks
│   │   └── uiLibrary.ts               # UI library mocks
│   ├── Root.tsx                       # Root component with providers
│   ├── AppRoutes.tsx                  # Route definitions
│   ├── singleSpaEntry.ts             # Single-SPA lifecycle
│   └── vite-env.d.ts                 # Vite type definitions
├── .env                              # Environment configuration
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
└── README.md                         # Basic documentation
```

### Key Files Explanation

#### `singleSpaEntry.ts`
```typescript
// Entry point for single-spa integration
import { singleSpaReact } from 'single-spa-react';
import Root from './Root';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary: ErrorComponent,
});

export const { bootstrap, mount, unmount, update } = lifecycles;
```

#### `Root.tsx`
```typescript
// Root component with all necessary providers
export const Root: React.FC<RootProps> = ({ store }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PortalContext.Provider value={portalContext}>
        <I18nContext.Provider value={i18nContext}>
          <BrowserRouter future={{ v7_startTransition: true }}>
            <AppRoutes />
          </BrowserRouter>
        </I18nContext.Provider>
      </PortalContext.Provider>
    </QueryClientProvider>
  );
};
```

#### `ModernExchangeRateScreen.tsx`
Main business component implementing:
- Tab-based navigation (Individual/Corporate rates)
- Real-time data fetching with retry logic
- Modern Tailwind-inspired styling
- Error handling and offline support
- Loading states and data source indicators

---

## Portal Integration

### Module Registration

The microfrontend is registered in the portal's `appsettings.json`:

```json
{
  "modules": {
    "exchangeRateUfront": {
      "id": "exchange-rate-ufront",
      "requiresAuthentication": false,
      "onNavbar": true,
      "onHome": true,
      "allowSubModules": false,
      "status": true,
      "title": { "en": "Exchange Rates", "sq": "Kurset e Këmbimit" },
      "category": "apps",
      "path": "/exchange-rates",
      "icon": "trending-up",
      "description": {
        "en": "View current exchange rates",
        "sq": "Shiko kurset aktuale të këmbimit"
      }
    }
  }
}
```

### Proxy Configuration

Development proxy setup in `proxyConfigs.ts`:

```typescript
const proxyConfigs = {
  // Microfrontend proxy
  exchangeRateUfront: {
    pathPrefix: "/ufronts/exchange-rate-ufront",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:16727", // Microfrontend dev server
    },
  },
  
  // API proxy for CORS handling
  exchangeRateApi: {
    pathPrefix: "/api/Fx",
    test: {
      target: "https://rbal-digital-investment.ctinvest-cluster.rbal-products-invest-test.internal.rbigroup.cloud",
      secure: false,
      changeOrigin: true,
      rewrite: (path) => `/utility${path}`,
    },
  },
};
```

### Runtime Integration Flow

1. **Portal Load**: Portal shell loads and reads `appsettings.json`
2. **Route Matching**: When `/exchange-rates` is accessed, portal identifies the microfrontend
3. **Module Loading**: Portal dynamically imports the microfrontend bundle
4. **Lifecycle Execution**: Single-SPA executes bootstrap → mount lifecycle
5. **Context Sharing**: Portal provides shared context (authentication, i18n, etc.)

### Shared Dependencies

External dependencies defined in `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        '@emotion/react', 
        '@emotion/styled', 
        'react-router-dom'
      ],
    },
  },
});
```

---

## API Integration

### Service Architecture

```typescript
interface ExchangeRate {
  currencyType: string;    // "Monedha Evropiane"
  code: string;           // "EUR"
  buyInLeke: number;      // 94.1
  sellInLeke: number;     // 100.1
  average: number;        // 97.1
  trendBuy: 'UP' | 'DOWN' | 'SAME';
  trendSell: 'UP' | 'DOWN' | 'SAME';
  trendAvg: 'UP' | 'DOWN' | 'SAME';
}

interface ApiResponse {
  individualRates: ExchangeRate[];
  businessRates: ExchangeRate[];
  lastUpdate: string;
  _dataSource?: 'API' | 'Mock';
}
```

### API Integration Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Microfrontend  │    │  Portal Proxy   │    │  External API   │
│                 │    │                 │    │                 │
│  fetch('/api/   │───▶│  Intercepts     │───▶│  rbal-digital-  │
│  Fx/Daily       │    │  /api/Fx/*      │    │  investment...  │
│  Bulletin')     │    │                 │    │  /utility/api/  │
│                 │◀───│  Returns JSON   │◀───│  Fx/DailyBull.. │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### CORS Resolution

The CORS issue is resolved through the portal's proxy configuration:

1. **Problem**: Direct API calls from `https://localhost:5180` to external API blocked by CORS
2. **Solution**: Portal proxy intercepts `/api/Fx/*` requests
3. **Implementation**: Vite proxy forwards requests with proper headers and path rewriting

### Error Handling & Fallbacks

```typescript
class ExchangeRateServiceImpl {
  async fetchExchangeRates(): Promise<ApiResponse> {
    try {
      // 1. Try real API
      const response = await fetch('/api/Fx/DailyBulletin');
      if (response.ok) {
        const data = await response.json();
        return { ...data, _dataSource: 'API' };
      }
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
    }
    
    // 2. Fallback to mock data
    return { ...mockData, _dataSource: 'Mock' };
  }
}
```

---

## Development Setup

### Prerequisites

- Node.js 16+ 
- npm 7+
- Access to internal RBI network (for API calls)

### Local Development

1. **Clone and Install**:
   ```bash
   cd rbal-exchange-rate-ufront
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   # .env file
   VITE_USE_MOCK_DATA=false  # true for mock data, false for real API
   VITE_API_BASE_URL=https://rbal-digital-investment.ctinvest-cluster.rbal-products-invest-test.internal.rbigroup.cloud
   ```

3. **Start Development Servers**:
   ```bash
   # Terminal 1: Start microfrontend
   cd rbal-exchange-rate-ufront
   npm run dev  # Runs on http://localhost:16727

   # Terminal 2: Start portal
   cd rbal-luka-portal-main  
   npm install
   npm start    # Runs on https://localhost:5180
   ```

4. **Access Application**:
   - Portal: `https://localhost:5180`
   - Navigate to "Exchange Rates" in the portal

### Development Workflow

1. **Code Changes**: Edit files in `src/`
2. **Hot Reload**: Vite automatically reloads changes
3. **Portal Integration**: Portal automatically refetches updated microfrontend
4. **Testing**: Use browser dev tools to inspect network calls and component state

---

## Build & Deployment

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        singleSpaEntry: './src/singleSpaEntry.ts',
      },
      output: {
        entryFileNames: '[name].js',
        format: 'esm',
      },
      external: ['react', 'react-dom', '@emotion/react'],
    },
  },
  base: '/ufronts/exchange-rate-ufront/',
});
```

### Build Process

```bash
# Production build
npm run build

# Output structure:
dist/
├── singleSpaEntry.js     # Main bundle
├── assets/
│   ├── index.css        # Extracted CSS
│   └── vendor.[hash].js # Vendor chunks
└── index.html           # Not used in microfrontend
```

### Deployment Strategy

1. **Independent Deployment**: Microfrontend can be deployed without portal changes
2. **Version Management**: Use semantic versioning for compatibility
3. **Rollback Support**: Previous versions should remain accessible
4. **Health Checks**: Monitor bundle loading and API connectivity

### Production Considerations

- **Bundle Size**: Monitor bundle size to prevent performance issues
- **Shared Dependencies**: Ensure external dependencies are available in portal
- **Error Boundaries**: Implement proper error boundaries to prevent portal crashes
- **Performance Monitoring**: Track loading times and API response times

---

## Testing Strategy

### Unit Testing

```typescript
// Example test structure
describe('ExchangeRateService', () => {
  test('should fetch real API data when available', async () => {
    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })
    );

    const result = await ExchangeRateService.fetchExchangeRates();
    expect(result._dataSource).toBe('API');
  });

  test('should fallback to mock data on API failure', async () => {
    // Mock API failure
    global.fetch = jest.fn(() => Promise.reject('API Error'));

    const result = await ExchangeRateService.fetchExchangeRates();
    expect(result._dataSource).toBe('Mock');
  });
});
```

### Integration Testing

- Test microfrontend loading in portal context
- Verify shared dependency resolution  
- Test error boundary behavior
- Validate routing integration

### E2E Testing

- Full user journey from portal navigation to data display
- Cross-browser compatibility testing
- Mobile responsiveness testing
- Performance testing under load

---

## Performance Considerations

### Bundle Optimization

1. **Code Splitting**: Lazy load non-critical components
2. **Tree Shaking**: Remove unused code during build
3. **External Dependencies**: Leverage portal's shared dependencies
4. **Compression**: Enable gzip/brotli compression

### Runtime Performance

1. **React Query Caching**: Prevent unnecessary API calls
2. **Memoization**: Use React.memo for expensive components
3. **Virtual Scrolling**: For large datasets (if needed)
4. **Error Boundaries**: Graceful failure handling

### Monitoring

```typescript
// Performance monitoring example
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.name.includes('exchange-rate')) {
      console.log(`Load time: ${entry.duration}ms`);
    }
  });
});
performanceObserver.observe({ entryTypes: ['navigation', 'measure'] });
```

---

## Troubleshooting

### Common Issues

#### 1. Microfrontend Not Loading

**Symptoms**: Portal loads but Exchange Rate section shows error

**Diagnosis**:
```bash
# Check if microfrontend server is running
curl http://localhost:16727/ufronts/exchange-rate-ufront/singleSpaEntry.js

# Check portal proxy configuration
# Verify proxyConfigs.ts has correct target port
```

**Solutions**:
- Ensure microfrontend dev server is running
- Verify proxy configuration matches running port
- Check browser network tab for 404 errors

#### 2. API CORS Errors

**Symptoms**: `Access to fetch at '...' has been blocked by CORS policy`

**Diagnosis**:
```javascript
// Check if API calls are going through portal proxy
// Should see requests to: https://localhost:5180/api/Fx/DailyBulletin
// NOT: https://rbal-digital-investment.../utility/api/Fx/DailyBulletin
```

**Solutions**:
- Verify `exchangeRateApi` proxy configuration in portal
- Ensure API calls use relative paths (`/api/Fx/DailyBulletin`)
- Check portal server is running and proxy is active

#### 3. Shared Dependency Errors

**Symptoms**: `Module not found: react` or similar errors

**Diagnosis**:
```typescript
// Check vite.config.ts external dependencies
external: ['react', 'react-dom', '@emotion/react']

// Check if portal provides these dependencies
```

**Solutions**:
- Verify external dependencies are marked correctly
- Ensure portal shell loads dependencies before microfrontend
- Check version compatibility between portal and microfrontend

#### 4. Styling Issues

**Symptoms**: Components appear unstyled or CSS conflicts

**Diagnosis**:
- Check if Emotion CSS is loading correctly
- Verify CSS-in-JS styles are being applied
- Look for CSS specificity conflicts

**Solutions**:
- Ensure `@emotion/react` is external dependency
- Use CSS-in-JS for component-scoped styles
- Avoid global CSS that might conflict with portal

### Debug Tools

#### Browser DevTools
```javascript
// Single-SPA debugging
window.singleSpa.getAppStatus('exchange-rate-ufront')
window.singleSpa.getMountedApps()

// Portal context debugging
window.__PORTAL_CONTEXT__  // If available

// React DevTools
// Install React Developer Tools browser extension
```

#### Network Debugging
- Check Network tab for failed requests
- Verify API responses and status codes
- Monitor bundle loading times

#### Console Debugging
```typescript
// Add debugging to service
console.log('Making API request to:', '/api/Fx/DailyBulletin');
console.log('Response status:', response.status);
console.log('Data source:', data._dataSource);
```

---

## Conclusion

This Exchange Rate Microfrontend demonstrates modern microfrontend architecture principles within the RBAL Luka Portal ecosystem. Key achievements include:

1. **Independent Development**: Separate development lifecycle from portal
2. **Modern UI/UX**: Tailwind-inspired design matching investment web quality
3. **Robust API Integration**: CORS-compliant with fallback mechanisms
4. **Production Ready**: Error handling, performance optimization, and monitoring

The solution serves as a template for future microfrontend implementations, showcasing best practices for integration, styling, and maintainability.

---

## References

- [Single-SPA Documentation](https://single-spa.js.org/)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [React Query Documentation](https://tanstack.com/query/v3)
- [Emotion CSS-in-JS](https://emotion.sh/docs/introduction)

---

*Document Version: 1.0*  
*Last Updated: October 6, 2025*  
*Author: GitHub Copilot*