/*
 * Representa uma funcionalidade que pode ser utilizada por outros serviços
 * da aplicação.
 *
 * Providers podem ser usados para abstrair dependências externas ou detalhes
 * de implementação, facilitando futuras migrações, substituições de bibliotecas
 * ou refatorações sem impactar diretamente os consumidores.
 *
 * Exemplo:
 * Um provider pode encapsular uma biblioteca de terceiros e expor apenas
 * a interface necessária para o restante da aplicação.
 */
export class ExampleProvider {
  /**
   * Exemplo de método disponibilizado pelo provider.
   *
   * @example
   * exampleProvider.someAction();
   */
  someAction() {}
}

