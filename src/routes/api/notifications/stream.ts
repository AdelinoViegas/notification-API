import {
  FastifyInstance,
} from "fastify";

import {
  sseConnectionManager,
} from "../../../notification/delivery/sse/container";

import type {
  SSEConnection,
} from "../../../services/types";

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

      const connection: SSEConnection = {
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

      sseConnectionManager.addConnection(
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

      request.raw.on(
        "close",
        () => {
          sseConnectionManager.removeConnection(
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