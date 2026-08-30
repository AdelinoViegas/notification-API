import { FastifyInstance } from "fastify";
import { notificationService } from "../../../services/container";
import { NotificationConnection } from "../../../services/types";

export async function registerNotificationStreamRoute(
  app: FastifyInstance
) {
  app.get(
    "/api/notifications/stream",
    async (request, reply) => {
      const {
        receiverId,
      } = request.query as {
        receiverId?: string;
      };

      if (!receiverId) {
        return reply
          .code(400)
          .send({
            error:
              "receiverId é obrigatório",
          });
      }

      reply.raw.setHeader(
        "Content-Type",
        "text/event-stream"
      );

      reply.raw.setHeader(
        "Cache-Control",
        "no-cache"
      );

      reply.raw.setHeader(
        "Connection",
        "keep-alive"
      );

      reply.raw.setHeader(
        "X-Accel-Buffering",
        "no"
      );

      reply.raw.flushHeaders();

      const connection: NotificationConnection = {
        send: async (
          data: string
        ) => {
          reply.raw.write(
            `data: ${data}\n\n`
          );
        },

        close: () => {
          if (
            !reply.raw.destroyed
          ) {
            reply.raw.end();
          }
        },
      };

      notificationService.addSSEConnection(
        receiverId,
        connection
      );

      app.log.info(
        `SSE connection opened for receiver: ${receiverId}`
      );

      await connection.send(
        JSON.stringify({
          type: "CONNECTED",
          receiverId,
          message:
            "SSE connection established",
        })
      );

      try {
        await notificationService.deliverPending(
          receiverId
        );
      } catch (error) {
        app.log.error(
          error,
          `Erro ao entregar notificações pendentes para ${receiverId}`
        );
      }

      request.raw.on(
        "close",
        () => {
          notificationService.removeSSEConnection(
            receiverId,
            connection
          );

          app.log.info(
            `SSE connection closed for receiver: ${receiverId}`
          );
        }
      );

      await new Promise<void>(
        () => {}
      );
    }
  );
}