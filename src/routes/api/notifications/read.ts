import { FastifyInstance } from "fastify";
import { notificationRepository } from "../../../notification/persistence/container";

export async function registerMarkNotificationAsReadRoute(app: FastifyInstance) {
  app.patch("/api/notifications/:id/read",
    async (request, reply) => {
      const params = request.params as { id?: string };

      if (!params.id) {
        return reply
          .code(400)
          .send({
            error: "id é obrigatório",
          });
      }

      const notification = await notificationRepository.markAsRead(params.id);

      if (!notification) {
        return reply
          .code(404)
          .send({
            error:
              "Notificação não encontrada",
          });
      }

      return reply.send({
        success: true,
        message:
          "Notificação marcada como lida",
        notification,
      });
    }
  );
}