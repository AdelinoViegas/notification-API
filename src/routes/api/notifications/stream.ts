import { FastifyInstance } from "fastify";
import { notificationService } from "../../../services/container";
import { NotificationConnection } from "../../../services/types";
import { authenticate } from "../../../plugins/auth/hooks";

export async function registerNotificationStreamRoute(
  app: FastifyInstance
) {
  app.get(
    "/api/notifications/stream",
    {
      preHandler: authenticate,
    },
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

      if (request.user.id !== receiverId) {
        return reply
          .code(403)
          .send({
            statusCode: 403,
            error: "Forbidden",
            message:
              "Você não tem permissão para acessar este stream",
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
          if (!reply.raw.destroyed) {
            reply.raw.end();
          }
        },
      };

      notificationService.addSSEConnection(
        receiverId,
        connection
      );

      app.log.info(
        {
          userId: request.user.id,
          receiverId,
        },
        "SSE connection opened"
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
            {
              userId: request.user.id,
              receiverId,
            },
            "SSE connection closed"
          );
        }
      );

      await new Promise<void>(
        () => {}
      );
    }
  );
}