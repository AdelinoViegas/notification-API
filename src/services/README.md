Services

Services representam funcionalidades ou regras de negócio da aplicação.

Eles existem para concentrar comportamentos que possuem uma responsabilidade específica dentro do sistema, evitando que regras de negócio fiquem espalhadas entre controllers, handlers, providers ou outras partes da aplicação.

Um Service deve representar uma ação, processo ou comportamento que faça sentido para o domínio da aplicação.
Quando utilizar um Service

Um Service é adequado quando existe uma funcionalidade que possui uma responsabilidade própria e que pode evoluir de forma independente.

Alguns exemplos:

    Criar, atualizar ou remover uma entidade seguindo regras específicas.
    Processar uma operação que envolve várias etapas.
    Validar condições de negócio.
    Calcular valores ou tomar decisões baseadas em regras do domínio.
    Orquestrar diferentes operações para realizar um caso de uso.
    Coordenar a interação entre diferentes partes da aplicação.
    Reutilizar uma determinada regra de negócio em diferentes pontos do sistema.

O objetivo não é transformar toda operação em um Service, mas dar uma responsabilidade própria às funcionalidades que realmente possuem comportamento de negócio ou um fluxo que merece ser isolado.
Services não precisam de dependências

Um Service pode ser completamente independente.

Nem toda funcionalidade precisa utilizar um Provider ou outro Service. Quando a responsabilidade pode ser executada pelo próprio Service, não há necessidade de criar dependências artificiais.

A existência de Providers ou outros Services deve acontecer conforme a necessidade da funcionalidade, e não como uma obrigação estrutural.
Services e Providers

Services e Providers possuem responsabilidades diferentes.

O Service representa o comportamento da aplicação, enquanto um Provider representa uma capacidade técnica ou uma integração que o Service pode utilizar.

Por exemplo, uma regra de negócio pode precisar:

    Enviar um e-mail.
    Acessar uma API externa.
    Utilizar uma biblioteca específica.
    Consultar ou persistir informações.
    Interagir com algum serviço externo.

Nesse cenário, o Service define o que precisa acontecer e pode utilizar um Provider responsável pelos detalhes de como essa operação é realizada.

Essa separação também facilita futuras substituições. Se a implementação utilizada hoje precisar ser trocada, o Service não precisa necessariamente conhecer ou sofrer com os detalhes dessa mudança.
Services utilizando outros Services

Um Service também pode utilizar outros Services quando precisa reutilizar ou combinar comportamentos de negócio existentes.

Isso é útil principalmente quando um caso de uso é composto por diferentes responsabilidades.

Por exemplo, um processo pode precisar:

    Validar regras existentes.
    Consultar informações.
    Executar outras ações de negócio.
    Coordenar diferentes etapas.

Nesse cenário, um Service pode atuar como um orquestrador, coordenando essas responsabilidades para concluir um caso de uso maior.
Casos de aplicação
Regras de negócio

Quando existe uma regra que precisa ser aplicada de maneira consistente em diferentes partes da aplicação.

Exemplos:

    Verificar se uma operação pode ser realizada.
    Calcular valores.
    Determinar estados.
    Validar condições específicas do domínio.

Casos de uso

Quando uma funcionalidade possui um fluxo próprio, envolvendo uma ou mais etapas para alcançar um resultado.

Exemplos:

    Criar um pedido.
    Finalizar uma compra.
    Registrar um usuário.
    Processar uma solicitação.
    Cancelar uma operação.

Orquestração

Quando uma operação precisa coordenar diferentes Services, Providers ou outras partes da aplicação.

O Service pode ser responsável por organizar a sequência necessária para concluir determinada operação.
Integrações

Quando uma regra de negócio precisa utilizar recursos externos, como:

    APIs.
    Serviços de mensageria.
    Serviços de e-mail.
    Bibliotecas externas.
    Sistemas de terceiros.

Nesse cenário, o Service pode utilizar Providers para manter os detalhes dessas integrações isolados.
Reutilização

Quando uma determinada regra ou comportamento pode ser utilizado por diferentes funcionalidades da aplicação.

Um Service permite centralizar esse comportamento em um único lugar, reduzindo duplicação de lógica.
O que um Service não deve ser

Um Service não deve ser criado simplesmente para seguir uma convenção.

Também não é necessário criar um Service para cada pequena operação da aplicação.

Uma classe que não possui uma responsabilidade clara, que apenas repassa chamadas para outra camada ou que existe somente para aumentar a quantidade de abstrações pode adicionar complexidade sem trazer benefícios.

A criação de um Service deve partir da necessidade de organizar uma responsabilidade ou comportamento, e não da necessidade de preencher uma estrutura.
Princípio geral

Services devem ajudar a aplicação a manter suas regras e comportamentos:

    Organizados.
    Independentes quando possível.
    Reutilizáveis.
    Fáceis de testar.
    Fáceis de evoluir.

Não existe uma estrutura obrigatória de dependências.

Um Service pode:

    Não possuir nenhuma dependência.
    Utilizar um ou mais Providers.
    Utilizar outros Services.
    Combinar Providers e Services.
    Orquestrar diferentes operações.

A estrutura deve ser definida de acordo com a responsabilidade de cada funcionalidade.

    Service é uma abstração para representar comportamentos e regras da aplicação. Suas dependências são determinadas pela necessidade do caso de uso, não por uma regra fixa de arquitetura.

