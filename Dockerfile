FROM node:22-alpine AS builder 
WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile
COPY . . 
RUN yarn docker:prisma
RUN yarn build:ts

# Stage 3: Runner (O "Modo Cirúrgico")
FROM node:22-alpine

ARG DATABASE_URL="file:./db/metadatas.db"

ENV FASTIFY_ADDRESS="0.0.0.0"
ENV FASTIFY_PORT=3001

ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}
# Configuração de sistema
RUN apk add --no-cache tzdata libc6-compat && \
    cp /usr/share/zoneinfo/Africa/Luanda /etc/localtime && \
    echo "Africa/Luanda" > /etc/timezone

WORKDIR /app

# Copia apenas o necessário para instalar dependências de produção
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/db ./db

# Instala apenas produção e limpa IMEDIATAMENTE na mesma camada
RUN yarn install --frozen-lockfile --production && \
    yarn prisma generate && \
    # --- PURGA AGRESSIVA ---
    # Remove pastas de teste, exemplos e docs que confirmaste estarem lá
    find node_modules \
    -type d -name "test" -or \
    -type d -name "tests" -or \
    -type d -name "__tests__" -or \
    -type d -name "examples" -or \
    -type d -name "example" -or \
    -type d -name "docs" -or \
    -type d -name "studio-core" -or \
    -type d -name "templates" | xargs rm -rf && \
    # Remove ficheiros de lixo comuns
    find node_modules -type f -name "*.md" -o -name "*.ts" -o -name "*.map" -o -name "changelog" | xargs rm -rf && \
    # Remove especificamente os motores do Prisma que o generate baixa a mais
    rm -rf node_modules/@prisma/engines && \
    rm -rf /usr/local/share/.cache/yarn && \
    rm -rf /root/.cache
# Copia os artefactos finais
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3001

CMD ["yarn", "start"]