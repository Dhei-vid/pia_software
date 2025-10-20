# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Disable linting and run build
RUN NEXT_DISABLE_ESLINT=true npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy Next.js output and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy Next.js config files if any
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000
CMD ["npm", "start"]
