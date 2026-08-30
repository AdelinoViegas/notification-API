import { FastifyInstance } from "fastify";
import { notificationService } from "../../../services/container";

export async function registerUnreadNotificationsRoute(
  app: FastifyInstance
) {
  app.get(
    "/api/notifications/unread",
    async (request, reply) => {
      const query =
        request.query as {
          receiverId?: string;
        };

      if (!query.receiverId) {
        return reply
          .code(400)
          .send({
            error:
              "receiverId é obrigatório",
          });
      }

      const notifications =
        await notificationService.listUnreadByReceiver(
          query.receiverId
        );

      return reply.send({
        success: true,
        notifications,
      });
    }
  );
}