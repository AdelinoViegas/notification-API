# # Etapa 1: Build
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Copia apenas arquivos necessários para instalar dependências e buildar
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# # Copia o restante do código-fonte
# COPY . .

# # Compila o projeto Next.js
# RUN yarn build

# # Etapa 2: Produção
# FROM node:20-alpine AS runner

# # Cria usuário não-root (boa prática de segurança)
# RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# WORKDIR /app

# Copia apenas artefatos necessários da build
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/yarn.lock ./
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/next.config.js ./next.config.js

# # Permissões (opcional, melhora segurança ao rodar como não-root)
# USER nextjs

# EXPOSE 3000

# CMD ["yarn", "start"]

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
COPY --from=builder /app/next.config.ts ./next.config.js
COPY --from=builder /app/.env ./.env

EXPOSE 3000
CMD ["yarn", "start"]
