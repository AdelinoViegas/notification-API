import fp from "fastify-plugin";
import { prisma } from "../lib/prisma.js";
import { ExampleProvider } from "../services/provider";
import { 
  AnotherExampleService, 
  HelloWorldService 
} from "../services";

const provider = new ExampleProvider();

const services = {
  helloWorld: new HelloWorldService(prisma),
  anotherExample: new AnotherExampleService({ provider })
};

export default fp(async function(fastify){
  fastify.decorate("services", services);
}, {
  dependencies: ["env"]
});


declare module "fastify" {
  export interface FastifyInstance {
    services: typeof services;
  }
}