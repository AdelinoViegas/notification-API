import fp from "fastify-plugin";
import { notificationService } from "../services/container";

const services = { notificationService };

export default fp(async function (fastify) {
  fastify.decorate("services", services);
});

declare module "fastify" {
  interface FastifyInstance {
    services: typeof services;
  }
}