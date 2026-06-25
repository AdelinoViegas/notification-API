FROM node:22-alpine AS builder 
WORKDIR /app

# Instalar dependências primeiro para aproveitar o cache de camadas
COPY package.json yarn.lock ./

# Garante que o TypeScript seja instalado e visível
RUN yarn install --frozen-lockfile

# Copiar o resto dos ficheiros
COPY . . 

# --- VARIÁVEIS DE BUILD ---
# Necessárias para que o Next.js não falhe ao pré-renderizar as páginas estáticas
ARG MONGO_URL
ENV MONGO_URL=$MONGO_URL

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG API_URL
ENV API_URL=$API_URL

ARG NEXT_LOGIN_PAGE_URL
ENV NEXT_LOGIN_PAGE_URL=$NEXT_LOGIN_PAGE_URL

ARG NEXT_PUBLIC_STORAGE_URL
ENV NEXT_PUBLIC_STORAGE_URL=$NEXT_PUBLIC_STORAGE_URL

ARG FEEDBACK_GOOGLE_SCRIPT_URL
ENV FEEDBACK_GOOGLE_SCRIPT_URL=$FEEDBACK_GOOGLE_SCRIPT_URL

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Forçar o build usando o binário local do TypeScript para evitar que o Next instale o TS 6.0.3
RUN yarn build

# --- ESTÁGIO FINAL ---
FROM node:22-alpine

# Variáveis de Runtime 
ENV COOKIE_AUTH_HEADER=auth_token
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Configuração de fuso horário local para Luanda
RUN apk add --no-cache alpine-conf && \
  setup-timezone -z Africa/Luanda

WORKDIR /app

# Copiar apenas o estritamente necessário do estágio de build
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/next.config.ts .

EXPOSE 3000

CMD ["yarn", "start"]