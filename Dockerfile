FROM node:22-alpine AS builder 
WORKDIR /app
COPY . . 
RUN yarn install 
RUN yarn build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/clinical-setup.mjs clinical-setup.mjs

EXPOSE 3000

CMD ["yarn", "start"]
