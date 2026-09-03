import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { sseConnectionManager } from "../../../notification/delivery/sse/container";
import type { NotificationConnection } from "../../../services/types";

export default function stream(
  app: FastifyInstance
) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const {notificationService } = fastify.services;

  fastify.get("/api/notifications/stream", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          receiverId: {
            type: "string"
          }
        },
        required: ["receiverId"]
      }
    }
  }, async function (req, res) {

    const {
      receiverId
    } = req.query;

    /**
     * AUTORIZAÇÃO
     *
     * Um utilizador autenticado só pode abrir
     * o stream destinado a ele próprio.
     */
    if (req.user.id !== receiverId) {
      return res
        .code(403)
        .send({
          statusCode: 403,
          error: "Forbidden",
          message:
            "Você não tem permissão para acessar este stream"
        });
    }

    /**
     * Configuração SSE
     */
    res.raw.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.raw.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.raw.setHeader(
      "Connection",
      "keep-alive"
    );

    res.raw.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    res.raw.flushHeaders();

    /**
     * Conexão SSE
     */
    const connection: NotificationConnection = {
      send: async (data: string) => {
        if (
          res.raw.destroyed ||
          res.raw.writableEnded
        ) {
          return;
        }

        res.raw.write(
          `data: ${data}\n\n`
        );
      },

      close: () => {
        if (
          !res.raw.destroyed &&
          !res.raw.writableEnded
        ) {
          res.raw.end();
        }
      }
    };

    /**
     * O gerenciamento da conexão SSE pertence
     * à infraestrutura de notification, e não
     * ao NotificationService.
     */
    sseConnectionManager.addConnection(
      receiverId,
      connection
    );

    app.log.info(
      {
        userId: req.user.id,
        receiverId
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
          "SSE connection established"
      })
    );

    /**
     * Quando o utilizador abre o SSE,
     * tentamos entregar as notificações
     * pendentes.
     */
    try {
      await notificationService.deliverPending(receiverId);
    } catch (error) {
      app.log.error(
        {
          error,
          receiverId
        },
        "Erro ao entregar notificações pendentes"
      );
    }

    /**
     * Detecta quando o cliente fecha a conexão.
     */
    req.raw.on(
      "close",
      () => {
        sseConnectionManager.removeConnection(
          receiverId,
          connection
        );

        app.log.info(
          {
            userId: req.user.id,
            receiverId
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
  });
}