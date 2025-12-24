# AI Legal Clause Analyzer - Docker Configuration
# This file creates a containerized version of your Next.js app

# Step 1: Use Node.js 20 Alpine (lightweight Linux) as base
FROM node:20-alpine AS base

# Step 2: Install dependencies
FROM base AS deps
# Install compatibility libraries
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Step 3: Build the Next.js application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the production app
RUN npm run build

# Step 4: Production image - smallest possible size
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Create .next directory with correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy Next.js build output
# Note: Requires output: 'standalone' in next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set hostname to accept connections from any IP
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the Next.js server
CMD ["node", "server.js"]
