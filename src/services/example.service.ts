 /*
  * Representa uma regra ou funcionalidade de negócio da aplicação.
  *
  * Services são responsáveis por orquestrar e executar comportamentos
  * específicos do domínio, podendo utilizar providers ou outros services
  * como dependências.
  *
  * A ideia é manter as regras de negócio isoladas, facilitando a manutenção,
  * testes e futuras alterações na implementação.
  */
export class ExampleService {
  constructor() {}

  /**
   * Exemplo de método responsável por executar uma funcionalidade
   * ou regra de negócio do serviço.
   *
   * @example
   * exampleService.someAction();
   */
  someAction() {}
}
