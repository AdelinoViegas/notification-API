/*
  representa uma funcionalidade ou regra de negócio que depende de outros
  services para executar parte de suas responsabilidades.

  um service pode receber outros services como dependências quando precisar
  reutilizar regras ou funcionalidades de negócio já existentes, evitando
  duplicação de lógica.

  essas dependências são opcionais do ponto de vista arquitetural:
  nem todo service precisa depender de outro service.
*/
import { ExampleService } from "./example.service";

export class ExampleServiceWithDependenciesService {
  #example: ExampleService;

  constructor({
    deps,
  }: {
    deps: {
      example: ExampleService;
    };
  }) {
    this.#example = deps.example;
    this.#internalValidator();
  }

  /*
    métodos que podem utilizar outros services para compor
    ou orquestrar diferentes regras de negócio
  */

  #internalValidator(){
    console.log(this.#example);
  }
}
