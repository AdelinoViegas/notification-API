# Módulo Clínico

O modulo responsável pela gestão de processos clínicos dentro da plataforma Master ERP. Ele fornece uma interface integrada para o gerenciamento de pacientes, atendimentos, exames, etc.

## Instalação

Para a instalação do modulo clinico configurar os serviços abaixo:
* [Api Gateway Master]()
* [Painel Web Admin](https://github.com/mr0xff/web-master-admin)
* **MongoDb** (rodar em container ou configurá-lo em bare metal)

> Atenção: Ajustar a porta do `web-admin` de acordo com a porta que estiver na .env (nesse caso é a porta `8081`)

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