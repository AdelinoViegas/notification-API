FROM node:22-alpine AS builder 
WORKDIR /app

# Instalar dependências primeiro para aproveitar o cache de camadas
COPY package.json yarn.lock ./

# Garante que o TypeScript seja instalado e visível
RUN yarn install --frozen-lockfile

# Copiar o resto dos ficheiros
COPY . . 

# Variáveis de Build
ARG NEXT_PUBLIC_STORAGE_URL
ENV NEXT_PUBLIC_STORAGE_URL=$NEXT_PUBLIC_STORAGE_URL
ARG MONGO_URL
ENV MONGO_URL=$MONGO_URL
ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED=1
ARG FEEDBACK_GOOGLE_SCRIPT_URL
ENV FEEDBACK_GOOGLE_SCRIPT_URL=$FEEDBACK_GOOGLE_SCRIPT_URL
ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

# Forçar o build usando o binário local do TypeScript para evitar que o Next instale o TS 6.0.3
RUN yarn build

# --- ESTÁGIO FINAL ---
FROM node:22-alpine

# Variáveis de Runtime (Nunca colocar segredos reais aqui, apenas os nomes das chaves)
ENV COOKIE_AUTH_HEADER="auth_token" 
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV="production"

RUN apk add --no-cache alpine-conf && \
  setup-timezone -z Africa/Luanda

WORKDIR /app

# Copiar apenas o estritamente necessário
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

# CRITICAL: Não copies o next.config.ts se não for necessário em runtime, 
# ou garante que ele está compilado/disponível como .mjs
COPY --from=builder /app/next.config.ts . 

EXPOSE 3000

CMD ["yarn", "start"]