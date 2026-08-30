import { FastifyInstance } from "fastify";
import { notificationService } from "../../../services/container";

export async function registerUnreadNotificationsRoute(
  app: FastifyInstance
) {
  app.get(
    "/api/notifications/unread",
    async (request, reply) => {
      const receiverId = request.user.id;

      const notifications =
        await notificationService.listUnreadByReceiver(
          receiverId
        );

      return reply.send({
        success: true,
        notifications,
      });
    }
  );
}