FROM node:22-alpine AS builder 
WORKDIR /app

# 1. IMPEDIR que o .env local entre (Garanta que tem um .dockerignore com .env nele!)
COPY . . 

# 2. DECLARAR as variáveis que o Next.js precisa no BUILD (Client-side)
ARG NEXT_PUBLIC_STORAGE_URL
ENV NEXT_PUBLIC_STORAGE_URL=$NEXT_PUBLIC_STORAGE_URL

RUN yarn install 
RUN yarn build

FROM node:22-alpine

RUN apk add --no-cache alpine-conf && \
  setup-timezone -z Africa/Luanda

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/next.config.ts .
# REMOVIDO: COPY --from=builder /app/.env .  <-- ISSO ESTAVA QUEBRANDO TUDO

EXPOSE 3000

CMD ["yarn", "start"]