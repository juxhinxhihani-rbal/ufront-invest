# Investment Web Platform

A modern Next.js application for investment questionnaires and exchange rate display with secure server-side API integration.

## 🚀 Features

- **Investment Risk Questionnaire**: Dynamic questionnaire with risk calculation
- **Exchange Rate Display**: Real-time foreign exchange rates with trend indicators
- **Multi-language Support**: Albanian and English language options
- **Secure API Integration**: Server-side API calls to protect backend URLs
- **Modern UI**: Built with Tailwind CSS and Lucide React icons
- **Authentication Ready**: Keycloak integration support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **API**: Next.js API Routes (Server-side)
- **Authentication**: Keycloak (optional)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Access to backend APIs (Investment API and FX API)

## ⚙️ Configuration Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd rbal-investment-web
npm install
```

### 2. Configuration File

Edit the configuration file at `public/env.json`:

```json
{
  "InvestBaseUrl": "https://your-actual-invest-api.com/",
  "FxBaseUrl": "https://your-actual-fx-api.com/"
}
```

**Important**: The URLs in `public/env.json` are read server-side only and remain secure from client exposure.

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔒 Security Features

### Server-Side Configuration Loading
- All external API calls are made from Next.js API routes
- Configuration is loaded from `public/env.json` on the server-side only
- Backend URLs are hidden from client-side code
- No CORS issues with external APIs

### API Routes Structure
```
/api/questionnaire       - GET: Fetch questions
/api/calculate-risk      - POST: Calculate risk
/api/submit-risk         - POST: Submit results  
/api/exchange-rates      - GET: Fetch exchange rates
```

## 🌐 Deployment

### Configuration for Production
1. Update `public/env.json` with production URLs before building
2. Build and deploy your application
3. No additional environment variable setup needed

### Vercel
1. Update `public/env.json` with production URLs
2. Connect your repository to Vercel
3. Deploy (configuration is automatically included)

### Docker
```dockerfile
# Copy configuration file during build
COPY public/env.json ./public/env.json
```

## 📱 Application Features

### Investment Questionnaire
- Dynamic question loading based on language
- Real-time risk calculation
- Form validation with user feedback
- Results summary screen

### Exchange Rate Display  
- Individual and corporate rate views
- Trend indicators (up/down/same)
- Auto-refresh functionality
- Offline detection and retry logic

### Multi-language Support
- Albanian (sq-AL) and English (en-US)
- Context-based language switching
- Persistent language preferences

## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── api/              # Next.js API routes
│   ├── exchangeRate/     # Exchange rate page
│   └── questionnaire/    # Questionnaire page
├── components/           # React components
├── context/             # React contexts
├── service/             # API service layers
└── types.ts             # TypeScript definitions
```

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
```

## 🔍 Troubleshooting

### Common Issues

1. **API Routes not working**: Ensure you removed `output: 'export'` from `next.config.js`
2. **Environment variables not loading**: Check `.env.local` exists and variables are set
3. **CORS errors**: Should be resolved with server-side API calls
4. **Build errors**: Verify all TypeScript types are correct

### Debug Mode
```bash
npm run dev:debug      # Run with Node.js inspector
npm run dev:debug-brk  # Run with breakpoint
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to Raiffeisen Bank International Group.
