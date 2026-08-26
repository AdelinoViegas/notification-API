import { FastifyInstance } from "fastify";
import { registerNotificationRoutes } from "./notifications";

export async function registerApiRoutes(app: FastifyInstance) {
  await registerNotificationRoutes(app);
}