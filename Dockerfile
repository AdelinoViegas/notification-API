FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . .

ARG DATABASE_URL="file:./db/prod.db"
ENV DATABASE_URL=${DATABASE_URL}

RUN yarn prisma:up
RUN yarn build:ts


# Stage 2: Runner
FROM node:22-alpine

ARG DATABASE_URL="file:./db/prod.db"

ENV FASTIFY_ADDRESS="0.0.0.0"
ENV FASTIFY_PORT=3001

ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

RUN apk add --no-cache tzdata libc6-compat && \
    cp /usr/share/zoneinfo/Africa/Luanda /etc/localtime && \
    echo "Africa/Luanda" > /etc/timezone

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/db ./db

RUN yarn install --frozen-lockfile --production && \
    yarn prisma generate && \
    find node_modules \
    -type d \( -name "test" -o \
               -name "tests" -o \
               -name "__tests__" -o \
               -name "examples" -o \
               -name "example" -o \
               -name "docs" -o \
               -name "studio-core" -o \
               -name "templates" \) -exec rm -rf {} + && \
    find node_modules \
    -type f \( -name "*.md" -o \
               -name "*.ts" -o \
               -name "*.map" -o \
               -name "changelog" \) -delete && \
    rm -rf node_modules/@prisma/engines && \
    rm -rf /usr/local/share/.cache/yarn && \
    rm -rf /root/.cache

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3001

CMD ["yarn", "start"]