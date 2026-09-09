import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

export default function index(app: FastifyInstance){
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { helloWorld } = fastify.services;

  fastify.get("/", async function(req, res){
    const data =  await helloWorld.list();
    res.send({ items: data });
  });

  fastify.get("/:msg", {
    schema: {
      params: {
        type: "object",
        required: ["msg"],
        properties: { 
          msg: { type: "string" }
        }
      } as const
    }
  }, async function(req, res){
    const data = helloWorld.find(req.params.msg);
    res.send({ items: data });
  });

  fastify.post("/", {
    schema: {
      body: {
        type: "object",
        required: ["msg"],
        properties: {
          msg: { type: "string" }
        } as const // OBRIGATÓRIO para o JsonSchemaToTsProvider inferir os tipos literais
      }
    }}, async function(req, res) {
    const { msg } = req.body;

    const data = await helloWorld.save(msg);

    res.code(201).send({ 
      message: "mensagem criada com sucesso!",
      data
    });
  });
}