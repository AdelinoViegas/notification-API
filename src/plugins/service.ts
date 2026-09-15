import fp from "fastify-plugin";
import { prisma } from "../lib/prisma.js";
import { NotificationService } from "../services/index.js";

import { NotificationDispatcher } from "../notification/notificationDispatcher.js";
import { SSEAdapter } from "../notification/delivery/sse/adapter.js";
import { SSEConnectionManager } from "../notification/delivery/sse/manager.js";

const sseConnectionManager = new SSEConnectionManager();

const notificationDispatcher = new NotificationDispatcher(
  new Map([
    ["sse", new SSEAdapter(sseConnectionManager)]
  ])
);

const services = {
  notificationService: new NotificationService({
    database: prisma,
    notificationDispatcher,
  }),
}

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