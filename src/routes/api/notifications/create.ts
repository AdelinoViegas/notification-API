import { FastifyInstance } from "fastify";
import { notificationService } from "../../../services/container";
import type { DomainEvent } from "../../../services/types";

export async function registerCreateNotificationRoute(
  app: FastifyInstance
) {
  app.post(
    "/api/notifications",
    async (request, reply) => {
      const body =
        request.body as Partial<DomainEvent>;

      if (!body.type) {
        return reply
          .code(400)
          .send({
            error: "type é obrigatório",
          });
      }

      if (!body.source) {
        return reply
          .code(400)
          .send({
            error: "source é obrigatório",
          });
      }

      if (!body.senderId) {
        return reply
          .code(400)
          .send({
            error: "senderId é obrigatório",
          });
      }

      if (!body.receiverId) {
        return reply
          .code(400)
          .send({
            error: "receiverId é obrigatório",
          });
      }

      if (!body.timestamp) {
        return reply
          .code(400)
          .send({
            error: "timestamp é obrigatório",
          });
      }

      if (!body.message) {
        return reply
          .code(400)
          .send({
            error: "message é obrigatório",
          });
      }

      const event: DomainEvent = {
        type: body.type,
        source: body.source,
        senderId: body.senderId,
        receiverId: body.receiverId,
        title: body.title,
        message: body.message,
        data: body.data,
        timestamp: body.timestamp,
      };

      try {
        const notifications =
          await notificationService.process(event);

        const notification =
          notifications[0];

        return reply
          .code(201)
          .send({
            success: true,
            message:
              "Notification created successfully",
            notification,
          });
      } catch (error) {
        app.log.error(
          error,
          "Erro ao processar notificação"
        );

        return reply
          .code(500)
          .send({
            success: false,
            error:
              "Não foi possível processar a notificação",
          });
      }
    }
  );
}