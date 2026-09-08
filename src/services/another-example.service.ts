/*
  representa uma funcionalidade ou regra de negócio da aplicação
  exemplos como orquestração de operações, aplicação de regras e validações

  um service pode ou não depender de um provider.
  Providers devem ser utilizados apenas quando houver uma necessidade de
  abstrair uma integração, biblioteca, implementação externa ou operação
  auxiliar que possa ser substituída ou reutilizada.

  nem todos os services precisam necessariamente ter um provider.
*/
import { ExampleProvider } from "./provider";

export class AnotherExampleService {
  #provider: ExampleProvider;

  constructor({ provider }: { provider: ExampleProvider }) {
    this.#provider = provider;
  }

  /*
    métodos que podem vir a depender do provider para realizar
    operações auxiliares necessárias à execução da regra de negócio
  */
}
