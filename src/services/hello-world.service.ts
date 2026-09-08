import BaseService from "./base.service";

/*
  representa uma funcionalidade ou regra de negócio da aplicação.

  nem todo service precisa depender de providers ou de outros services.
  Quando a própria classe consegue encapsular sua responsabilidade sem
  depender de outras abstrações, ela pode ser utilizada de forma independente.

  neste exemplo, o service mantém seu próprio estado e disponibiliza
  operações para salvar, listar e localizar mensagens.
*/
export class HelloWorldService extends BaseService {
  #db: string[] = [];

  /**
   * Armazena uma nova mensagem.
   */
  save(msg: string) {
    this.#db.push(msg);
  }

  /**
   * Retorna todas as mensagens armazenadas.
   */
  list() {
    return this.#db;
  }

  /**
   * Localiza a primeira mensagem que começa com o valor informado.
   */
  find(msg: string) {
    return this.#db.find((v) => v.startsWith(msg)) ?? "";
  }

  listWithAsync() {
    return Promise.resolve(this.#db);
  }
}
