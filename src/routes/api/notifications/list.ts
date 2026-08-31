import { FastifyInstance } from "fastify";

import { notificationService } from "../../../services/container";

export async function registerListNotificationsRoute(
  app: FastifyInstance
) {
  app.get(
    "/api/notifications",
    async (request, reply) => {
      const receiverId = request.user.id;

      const notifications =
        await notificationService.listByReceiver(
          receiverId
        );

      return reply.send({
        success: true,
        notifications,
      });
    }
  );
}