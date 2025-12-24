# Módulo Clínico

O modulo responsável pela gestão de processos clínicos dentro da plataforma Master ERP. Ele fornece uma interface integrada para o gerenciamento de pacientes, atendimentos, exames, etc.

## Instalação

> Este modulo depende do serviço [API Gateway Master](https://github.com/mr0xff/api-gateway-master), é obrigatório configura-lo
para que o modulo clinico funcione.

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/mr0xff/master-clinical.git
cd master-clinical
yarn install
yarn build
yarn setup # para configurar o banco de dados do serviço clínico
yarn start
```

## Variaveis de ambiente

Configurar corretamente as variaveis de ambiente mostrados abaixo: 

```sh
# dependencias principais
WEB_ADMIN_URL="http://localhost:8081/"
API_URL="http://localhost:8080"
NEXT_PUBLIC_STORAGE_URL="http://localhost:8080/st/public"
```