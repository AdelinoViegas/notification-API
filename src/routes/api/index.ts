import { FastifyInstance } from "fastify";
import { registerNotificationRoutes } from "./notifications";

export async function registerApiRoutes(
  app: FastifyInstance
) {
  await app.register(
    async (notificationApp) => {
      await registerNotificationRoutes(
        notificationApp
      );
    }
  );
}