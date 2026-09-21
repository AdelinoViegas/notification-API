import fp from "fastify-plugin";
import { notificationService } from "../services/provider/containers";

const services = { notificationService }

export default fp(
  async function (fastify) {
    fastify.decorate("services", services);
  },
  {
    dependencies: ["env"],
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    services: typeof services;
  }
}