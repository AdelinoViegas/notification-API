import Fastify from "fastify";
import { sseConnectionManager } from "./notification/delivery/sse/container.js";
import type { SSEConnection } from "./types.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.get("/test", async () => {
    return {
      status: "ok",
      service: "notification-api",
    };
  });

  /**
   * SSE notification stream
   *
   * O cliente mantém esta conexão aberta
   * para receber notificações em tempo real.
   *
   * Exemplo:
   *
   * GET /api/notifications/stream?receiverId=doctor-123
   */
  app.get(
    "/api/notifications/stream",
    async (request, reply) => {
      const { receiverId } = request.query as {
        receiverId?: string;
      };

      if (!receiverId) {
        return reply.code(400).send({
          error: "receiverId é obrigatório",
        });
      }

      /**
       * Configuração necessária para SSE.
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

      /**
       * Envia os headers imediatamente.
       */
      reply.raw.flushHeaders();

      /**
       * Implementação da nossa abstração SSEConnection
       * utilizando o response do Node/Fastify.
       */
      const connection: SSEConnection = {
        send: async (data: string) => {
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

      /**
       * Registra a conexão para este receiver.
       */
      sseConnectionManager.addConnection(
        receiverId,
        connection
      );

      /**
       * Evento inicial para confirmar
       * que a conexão foi estabelecida.
       */
      await connection.send(
        JSON.stringify({
          type: "CONNECTED",
          receiverId,
          message: "SSE connection established",
        })
      );

      /**
       * Detecta quando o cliente fecha a conexão.
       *
       * Pode acontecer quando:
       * - fecha o browser;
       * - faz refresh;
       * - perde a conexão;
       * - o frontend fecha o EventSource.
       */
      request.raw.on("close", () => {
        sseConnectionManager.removeConnection(
          receiverId,
          connection
        );

        app.log.info(
          `SSE connection closed for receiver: ${receiverId}`
        );
      });

      /**
       * Mantém a função pendente.
       *
       * O endpoint não deve terminar enquanto
       * a conexão SSE estiver ativa.
       */
      await new Promise<void>(() => {});
    }
  );

  return app;
}