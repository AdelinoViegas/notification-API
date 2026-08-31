import { FastifyInstance } from "fastify";
import { notificationService } from "../../../services/container";
import type { NotificationConnection } from "../../../services/types";

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

      /**
       * O receiverId deve ser sempre o utilizador
       * autenticado.
       */
      if (!receiverId) {
        return reply
          .code(400)
          .send({
            statusCode: 400,
            error: "Bad Request",
            message:
              "receiverId é obrigatório",
          });
      }

      /**
       * AUTORIZAÇÃO
       *
       * Um utilizador autenticado só pode abrir
       * o stream destinado a ele próprio.
       */
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

      /**
       * Configuração SSE
       */
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

      /**
       * Conexão SSE
       */
      const connection: NotificationConnection = {
        send: async (data: string) => {
          if (
            reply.raw.destroyed ||
            reply.raw.writableEnded
          ) {
            return;
          }

          reply.raw.write(
            `data: ${data}\n\n`
          );
        },

        close: () => {
          if (
            !reply.raw.destroyed &&
            !reply.raw.writableEnded
          ) {
            reply.raw.end();
          }
        },
      };

      /**
       * Registra a conexão para que o Dispatcher
       * possa enviar notificações em tempo real.
       */
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

      /**
       * Confirmação inicial da conexão.
       */
      await connection.send(
        JSON.stringify({
          type: "CONNECTED",
          receiverId,
          message:
            "SSE connection established",
        })
      );

      /**
       * Quando o utilizador abre o SSE, verificamos
       * se existem notificações PENDING e tentamos
       * entregá-las.
       *
       * O método deliverPending é responsável pela
       * lógica de entrega/reentrega.
       */
      try {
        await notificationService.deliverPending(
          receiverId
        );
      } catch (error) {
        app.log.error(
          {
            error,
            receiverId,
          },
          "Erro ao entregar notificações pendentes"
        );
      }

      /**
       * Detecta quando o cliente fecha a conexão.
       */
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

      /**
       * Mantém a requisição aberta enquanto
       * a conexão SSE estiver ativa.
       */
      await new Promise<void>(() => {});
    }
  );
}