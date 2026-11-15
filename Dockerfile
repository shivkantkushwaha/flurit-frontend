# Multi-stage build for Next.js with Node 22 (required by pnpm 11+)
# Stage 1: Base & Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@11.5.3 --activate

# Copy package descriptors and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies strictly according to lockfile with build script permission
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.5.3 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set production environment for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Arguments for Next.js public variables bundled at build time with safe defaults
ARG NEXT_PUBLIC_API_BASE_URL="https://flurit-backend.onrender.com/api/v1"
ARG NEXT_PUBLIC_ENABLE_MSW="false"
ARG NEXT_PUBLIC_SUPABASE_URL="https://mnxliofkpmhpsvoechlk.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable__0SvpqLgQO11CBCLbyMSWA_MmTCkGku"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=""

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_ENABLE_MSW=${NEXT_PUBLIC_ENABLE_MSW}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Build Next.js application
RUN pnpm build

# Stage 3: Production Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security best practices
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

RUN corepack enable && corepack prepare pnpm@11.5.3 --activate

# Copy production dependencies and built artifacts
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
