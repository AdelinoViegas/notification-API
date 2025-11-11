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