import {
  FastifyInstance,
} from "fastify";

import {
  notificationRepository,
} from "../../../notification/persistence/container";

export async function registerListNotificationsRoute(
  app: FastifyInstance
) {
  app.get(
    "/api/notifications",
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
        await notificationRepository.findByReceiver(
          query.receiverId
        );

      return reply.send({
        success: true,
        notifications,
      });
    }
  );
}