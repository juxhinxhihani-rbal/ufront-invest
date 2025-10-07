FROM artifacts.rbi.tech/docker-io-docker-proxy/node:22-bullseye-slim AS build

WORKDIR /app
COPY .npmrc .
COPY package.json .
COPY package-lock.json .
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build

FROM artifacts.rbi.tech/docker-io-docker-proxy/node:22-bullseye-slim AS runtime

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json .
COPY package-lock.json .
RUN npm ci --prefer-offline --no-audit --omit=dev

# Copy built application
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./next.config.js

# Create a non-root user
RUN groupadd --gid 1001 nodejs
RUN useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

# Change ownership of the app directory to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 8080
ENV PORT=8080

CMD ["npm", "start"]
