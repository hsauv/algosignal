# ---------------------------------------------------------------------------
# AlgoSignal — production image (Next.js standalone + Prisma)
# Multi-stage build → small, self-contained runtime image.
# Runs on any sovereign cloud that accepts an OCI container.
# ---------------------------------------------------------------------------

# ---- deps: install node_modules ----
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---- builder: generate client + build the app ----
FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal runtime ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs nextjs

# Next.js standalone output (server.js + traced node_modules).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + migrations so `prisma migrate deploy` can run at release time.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000

# Apply pending migrations, then start the server. Invoke the Prisma CLI through
# node directly (no reliance on the .bin symlink / exec bit).
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
