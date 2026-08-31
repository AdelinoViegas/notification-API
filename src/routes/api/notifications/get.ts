import { FastifyInstance } from "fastify";

import { notificationService } from "../../../services/container";

export async function registerGetNotificationRoute(
  app: FastifyInstance
) {
  app.get(
    "/api/notifications/:id",
    async (request, reply) => {
      const params =
        request.params as { id?: string };

      if (!params.id) {
        return reply
          .code(400)
          .send({
            error: "id é obrigatório",
          });
      }

      const notification =
        await notificationService.getById(
          params.id
        );

      if (!notification) {
        return reply
          .code(404)
          .send({
            error:
              "Notificação não encontrada",
          });
      }

      if (
        notification.receiverId !==
        request.user.id
      ) {
        return reply
          .code(403)
          .send({
            statusCode: 403,
            error: "Forbidden",
            message:
              "Você não tem permissão para acessar esta notificação",
          });
      }

      return reply.send({
        success: true,
        notification,
      });
    }
  );
}