import { FastifyInstance } from "fastify";

import { notificationService } from "../../../services/container";
import type { DomainEvent } from "../../../services/types";

import { createNotificationSchema } from "./schemas";

export async function registerCreateNotificationRoute(
  app: FastifyInstance
) {
  app.post(
    "/api/notifications",
    {
      schema: createNotificationSchema,
    },
    async (request, reply) => {
      const body =
        request.body as DomainEvent;

      try {
        const notifications =
          await notificationService.process(body);

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
