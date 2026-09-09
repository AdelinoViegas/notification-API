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
  async save(msg: string) {
    this.#db.push(msg);
    const data = await this.db.helloWorld.create({ data: { msg }});
    return data.id;
  }

  /**
   * Retorna todas as mensagens armazenadas.
   */
  async list() {
    const data = await this.db.helloWorld.findMany();
    const dataInMemory = this.#db;

    return {
      sqlite: data,
      inMemory: dataInMemory
    }
  }

  /**
   * Localiza a primeira mensagem que começa com o valor informado.
   */
  async find(msg: string) {
    const data = await this.db.helloWorld.findMany({
      where: { msg }
    });

    const filter = this.#db.find((v) => v.startsWith(msg)) ?? "";

    return {
      searchDb: data,
      searchInMemory: filter
    }
  }
}
