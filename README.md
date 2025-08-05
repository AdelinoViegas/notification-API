# Módulo Clínico

O **Módulo Clínico** é responsável pela gestão de processos clínicos dentro da plataforma Master ERP. Ele fornece uma interface integrada para o gerenciamento de pacientes, atendimentos, exames, agendamentos, triagens e unidades clínicas. É voltado para ambientes hospitalares, clínicas e centros de diagnóstico.

## Funcionalidades

- Cadastro e edição de pacientes
- Gestão de agendamentos e atendimentos médicos
- Organização e registro de triagens e consultas
- Gerenciamento de exames laboratoriais e de imagem
- Controle de unidades clínicas físicas e seus usuários
- Atendimento e registro em banco de urgência
- Visualização de agendas médicas (calendário)
- Assinatura e validação de documentos clínicos
- Acompanhamento de exames/serviços realizados (servidos)
- Histórico e arquivamento de atendimentos

## Instalação

Clone o repositório e instale as dependências com `yarn`:

```bash
git clone https://github.com/mr0xff/web-master-erp.git
cd web-master-erp
yarn install
yarn build
yarn setup # para configurar o banco de dados do serviço clinico
yarn start
```

> Atenção: este módulo depende da configuração correta dos serviços de backend, incluindo autenticação e permissões. Certifique-se de que a API está configurada e rodando.

# Dependências Externas

Este módulo depende de dois serviços principais:

- **API do serviço Administrador** (`ADMIN_SRV_URL`)  
  Endpoint: `http://localhost:3000/v1`  
  Responsável pela autenticação, controle de acesso e gestão de usuários. [Saber mais](https://github.com/mr0xff/api-master-admin)

- **Frontend do Serviço Administrador** (`LOGIN_URL`)  
  URL: `http://localhost:5173/`  
  Redirecionamento para login de sessão e autenticação.
  [Saber mais](https://github.com/mr0xff/web-master-admin)


Esses valores devem ser configurados nas variáveis de ambiente da aplicação clínica.

## Servidores

- Local: http://localhost:3001/clinical
- Produção: https://web-master-erp-production.up.railway.app/clinical

## Estrutura de Rotas

Todas as rotas são baseadas em App Router (Next.js 14+). Algumas rotas usam parâmetros dinâmicos (`[id]`) para acesso a recursos específicos.

### Pacientes (`/clinical/patient`)

- `GET /` – Listagem de pacientes
- `GET /[patientId]` – Detalhes de um paciente
- `GET /sign` – Tela de registro/entrada de novo paciente
- `GET /serveds` – Histórico de pacientes atendidos

### Agendamentos (`/clinical/appointment`)

- `GET /` – Agendamentos ativos
- `GET /[scheduleId]` – Detalhe do agendamento
- `GET /archiveds` – Agendamentos arquivados
- `GET /serveds` – Consultas realizadas

### Consultórios (`/clinical/office`)

- `GET /` – Lista de atendimentos ativos
- `GET /[officeId]` – Detalhe de atendimento
- `GET /archiveds` – Atendimentos arquivados
- `GET /serveds` – Histórico de atendimentos

### Exames e Serviços (`/clinical/exams-services`)

- `GET /` – Listagem geral
- `GET /[examId]` – Detalhes do exame/serviço
- `GET /ccg/[type]` – Tipo específico de exame (ex: CCG)
- `GET /update/[id]` – Edição de exame agendado

### Laboratório e Imagem

- `/clinical/laboratory`, `/clinical/imaging` – Mesma estrutura:
  - `GET /` – Lista principal
  - `GET /[id]` – Detalhes
  - `GET /serveds` – Exames realizados

### Triagem e Pré-Triagem (`/clinical/screening`)

- `GET /` – Triagens ativas
- `GET /[patientId]` – Triagem por paciente
- `GET /archived` – Triagens arquivadas

### Banco de Urgência (`/clinical/urgency-bank/[patientId]`)

Subseções por paciente:

- `GET /` – Página principal do atendimento
- `GET /anamnesis` – Registro de anamnese
- `GET /clinical-diary` – Diário clínico
- `GET /exam` – Solicitação de exames
- `GET /office` – Atendimento no consultório
- `GET /screening` – Pré-triagem
- `layout.tsx` – Layout específico para esta área

### Outras Rotas

- `/clinical/doctor-calendar` – Visualização e assinatura da agenda médica
- `/clinical/phisical-unit` – Gestão de unidades físicas (clínicas, hospitais, usuários)
- `/clinical/profile` – Página do perfil do profissional de saúde

## Licença

Distribuído sob a Licença MIT. Consulte o arquivo [LICENSE](../LICENSE) para mais informações.