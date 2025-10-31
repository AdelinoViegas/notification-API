# Módulo Clínico

O **Módulo Clínico** é responsável pela gestão de processos clínicos dentro da plataforma Master ERP. Ele fornece uma interface integrada para o gerenciamento de pacientes, atendimentos, exames, agendamentos, triagens e unidades clínicas. É voltado para ambientes hospitalares, clínicas e centros de diagnóstico.

## Instalação

Clone o repositório e instale as dependências com `yarn`:

```bash
git clone https://github.com/mr0xff/master-clinical.git
cd master-clinical
yarn install
yarn build
yarn setup # para configurar o banco de dados do serviço clinico
yarn start
```

> Atenção: este módulo depende da configuração correta dos serviços de backend, incluindo autenticação e permissões. Certifique-se de que a API está configurada e rodando.

# Dependências Externas

Este módulo depende de dois serviços principais:

- **API do serviço Administrador** (`API_ADMIN_URL`)  
  Endpoint: `http://localhost:3000/v1`  
  Responsável pela autenticação, controle de acesso e gestão de usuários. [Saber mais](https://github.com/mr0xff/api-master-admin)

- **API do serviço de Arquivos** (`API_STORAGE_URL`)  
  Endpoint: `http://localhost:3003/v1`  
  Responsável pela gestao dos arquivos carregados. [Saber mais](https://github.com/mr0xff/api-master-storage)

## Servidores

- Local: http://localhost:3001/clinical
