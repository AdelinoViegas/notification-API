# Módulo Clínico

O **Módulo Clínico** é responsável pela gestão de processos clínicos dentro da plataforma Master ERP. Ele fornece uma interface integrada para o gerenciamento de pacientes, atendimentos, exames e integrações com serviços de autenticação e armazenamento de arquivos.

## Instalação

Clone o repositório e instale as dependências com `yarn`:

```bash
git clone https://github.com/mr0xff/master-clinical.git
cd master-clinical
yarn install
yarn build
yarn setup # para configurar o banco de dados do serviço clínico
yarn start
```

> Atenção: este módulo depende da configuração correta dos serviços de backend, incluindo autenticação e permissões. Certifique-se de que as APIs necessárias estão configuradas e rodando.

## Configuração (.env)

O projeto utiliza variáveis de ambiente definidas no arquivo `.env` na raiz do repositório. Abaixo estão as variáveis usadas por este serviço e os valores padrão presentes no arquivo `.env` do repositório:

- JWT_EXPIRATION_TIME: "72h"  # Tempo de expiração do token JWT
- JWT_SECRET_ADMIN_KEY: "f82f539dcdce5b5fe661cb73d5f155e570a04732370ad7f928b7d804e879"  # Chave secreta para validação JWT (não compartilhe em ambientes públicos)
- COOKIE_AUTH_HEADER: "auth_token"  # Nome do cookie/header de autenticação

- MONGO_URL: "mongodb://localhost:27017"  # URL de conexão com o MongoDB
- MONGO_DB_NAME: "master_clinical_v1"  # Nome do banco de dados Mongo

- API_ADMIN_URL: "http://127.0.0.1:3000/v1"  # URL da API do serviço Administrador (auth, usuários, permissões)
- API_STORAGE_URL: "http://localhost:3002/v1"  # URL da API de armazenamento de arquivos (back-end)
- NEXT_PUBLIC_STORAGE_URL: "http://localhost:3002/"  # URL pública do serviço de arquivos (usada no front-end)
- WEB_ADMIN_URL: "http://localhost:8080/"  # URL do painel web administrador

Exemplo mínimo de arquivo `.env` (não comite credenciais sensíveis):

```dotenv
JWT_EXPIRATION_TIME="72h"
JWT_SECRET_ADMIN_KEY="<sua_chave_secreta_aqui>"
COOKIE_AUTH_HEADER="auth_token"

MONGO_URL="mongodb://localhost:27017"
MONGO_DB_NAME="master_clinical_v1"

API_ADMIN_URL="http://127.0.0.1:3000/v1"
API_STORAGE_URL="http://localhost:3002/v1"
NEXT_PUBLIC_STORAGE_URL="http://localhost:3002/"
WEB_ADMIN_URL="http://localhost:8080/"
```

## Dependências Externas

Este módulo depende de dois serviços principais externos:

- API do serviço Administrador (`API_ADMIN_URL`)
  - Endpoint padrão: `http://127.0.0.1:3000/v1`
  - Responsável pela autenticação, controle de acesso e gestão de usuários.
  - Repositório relacionado: https://github.com/mr0xff/api-master-admin

- API do serviço de Arquivos (`API_STORAGE_URL` / `NEXT_PUBLIC_STORAGE_URL`)
  - Endpoint do back-end: `http://localhost:3002/v1`
  - URL pública para recursos: `http://localhost:3002/`
  - Responsável pelo upload/serving de arquivos.
  - Repositório relacionado: https://github.com/mr0xff/api-master-storage

## Executando localmente

- URL local do serviço clínico (podendo variar conforme configuração): http://localhost:3001/clinical

## Observações de segurança

- Nunca comite chaves secretas (como JWT_SECRET_ADMIN_KEY) em repositórios públicos. Use variáveis de ambiente seguras em produção.
- Ajuste `MONGO_URL` e `MONGO_DB_NAME` para apontar para seu serviço de banco de dados em ambiente de produção.

---

Atualizado para refletir as variáveis presentes no arquivo `.env` do repositório.