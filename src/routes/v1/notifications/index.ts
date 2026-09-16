import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type {
  DomainEvent,
  NotificationConnection
} from "../../../services/types.js";
import { sseConnectionManager } from "../../../notification/containers.js";

export default function index(app: FastifyInstance) {
  const fastify =
    app.withTypeProvider<JsonSchemaToTsProvider>();

  const { notificationService: notificationService } = fastify.services;

  /**
   * ============================================================
   * GET /api/notifications/:id/list
   *
   * Lista todas as notificações de um receiver.
   * ============================================================
   */
  fastify.get(
    "/:id/list",
    {
      schema: {
        tags: ["Notifications"],
        description:
          "Lista todas as notificações de um receiver.",

        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              minLength: 1,
              description:
                "Identificador do receiver."
            }
          },
          required: ["id"],
          additionalProperties: false
        }
      }
    },
    async function (req, res) {
      const receiverId = req.params.id;

      const data =
        await notificationService.list(
          receiverId
        );

      return res.send({
        success: true,
        notifications: data,
        total: data.length
      });
    }
  );

  /**
   * ============================================================
   * GET /api/notifications/:id/unread
   *
   * Lista apenas as notificações não lidas
   * de um receiver.
   * ============================================================
   */
  fastify.get(
    "/:id/unread",
    {
      schema: {
        tags: ["Notifications"],
        description:
          "Lista apenas as notificações não lidas de um receiver.",

        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              minLength: 1,
              description:
                "Identificador do receiver."
            }
          },
          required: ["id"],
          additionalProperties: false
        }
      }
    },
    async function (req, res) {
      const receiverId = req.params.id;

      const data =
        await notificationService.listUnread(
          receiverId
        );

      return res.send({
        success: true,
        notifications: data,
        total: data.length
      });
    }
  );

  /**
   * ============================================================
   * GET /api/notifications/:id
   *
   * Obtém uma notificação específica.
   * ============================================================
   */
  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Notifications"],
        description:
          "Obtém uma notificação específica pelo seu ID.",

        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              minLength: 1,
              description:
                "Identificador único da notificação."
            }
          },
          required: ["id"],
          additionalProperties: false
        }
      }
    },
    async function (req, res) {
      const { id } = req.params;

      const notification =
        await notificationService.get(id);

      if (!notification) {
        throw fastify.httpErrors.notFound(
          "Notificação não encontrada"
        );
      }

      return res.send({
        success: true,
        notification
      });
    }
  );

  /**
   * ============================================================
   * POST /api/notifications
   *
   * Cria uma nova notificação e tenta entregá-la
   * imediatamente através do dispatcher configurado.
   *
   * Caso o receiver esteja offline, a notificação
   * permanece PENDING para posterior entrega.
   * ============================================================
   */
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Notifications"],
        description:
          "Cria uma nova notificação e tenta entregá-la imediatamente. " +
          "Se o receiver estiver offline, a notificação permanece " +
          "PENDING até que uma conexão SSE seja estabelecida.",

        body: {
          type: "object",
          additionalProperties: false,

          required: [
            "type",
            "source",
            "senderId",
            "receiverId",
            "message",
            "timestamp"
          ],

          properties: {
            type: {
              type: "string",
              minLength: 1,
              description:
                "Tipo do evento que originou a notificação."
            },

            source: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              description:
                "Sistema ou serviço que originou o evento."
            },

            senderId: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              description:
                "Identificador do remetente."
            },

            receiverId: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              description:
                "Identificador do destinatário."
            },

            title: {
              type: "string",
              minLength: 1,
              maxLength: 200,
              description:
                "Título da notificação."
            },

            message: {
              type: "string",
              minLength: 1,
              maxLength: 2000,
              description:
                "Mensagem apresentada ao destinatário."
            },

            data: {
              type: "object",
              additionalProperties: true,
              description:
                "Dados adicionais relacionados ao evento."
            },

            timestamp: {
              type: "string",
              format: "date-time",
              description:
                "Data e hora em que o evento ocorreu."
            }
          }
        }
      } as const
    },
    async function (req, res) {
      const body =
        req.body as DomainEvent;

      try {
        const notification =
          await notificationService.createAndDeliver(
            body
          );

        return res.code(201).send({
          success: true,
          message:
            "Notification created successfully",
          notification
        });
      } catch (error) {
        app.log.error(
          error,
          "Erro ao processar notificação"
        );

        return res.code(500).send({
          success: false,
          error:
            "Não foi possível processar a notificação"
        });
      }
    }
  );

  /**
   * ============================================================
   * PATCH /api/notifications/:id/read
   *
   * Marca uma notificação como lida.
   * ============================================================
   */
  fastify.patch(
    "/:id/read",
    {
      schema: {
        tags: ["Notifications"],
        description:
          "Marca uma notificação específica como lida.",

        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              minLength: 1,
              description:
                "Identificador único da notificação."
            }
          },
          required: ["id"],
          additionalProperties: false
        }
      }
    },
    async function (req, res) {
      try {
        const notification =
          await notificationService.markAsRead(
            req.params.id
          );

        if (!notification) {
          throw fastify.httpErrors.notFound(
            "Notificação não encontrada"
          );
        }

        return res.send({
          success: true,
          message:
            "Notificação marcada como lida",
          notification
        });
      } catch (error) {
        app.log.error(
          error,
          "Erro ao marcar notificação como lida"
        );

        throw fastify.httpErrors.internalServerError(
          "Não foi possível marcar a notificação como lida"
        );
      }
    }
  );

  /**
   * ============================================================
   * GET /api/notifications/stream
   *
   * Abre uma conexão Server-Sent Events (SSE)
   * para um receiver.
   *
   * A conexão permanece aberta e o servidor envia
   * notificações em tempo real enquanto o cliente
   * estiver conectado.
   *
   * Se existirem notificações PENDING para o
   * receiverId, elas são entregues automaticamente
   * após o estabelecimento da conexão.
   * ============================================================
   */
  fastify.get(
    "/stream",
    {
      schema: {
        tags: ["Notifications - SSE"],

        description:
          "Abre uma conexão SSE para receber notificações em tempo real. " +
          "A conexão permanece aberta enquanto o cliente estiver conectado. " +
          "Notificações que estavam PENDING são entregues automaticamente " +
          "após o estabelecimento da conexão.",

        querystring: {
          type: "object",

          properties: {
            receiverId: {
              type: "string",
              minLength: 1,
              description:
                "Identificador do receiver que receberá as notificações."
            }
          },

          required: ["receiverId"],
          additionalProperties: false
        },

        response: {
          200: {
            description:
              "Conexão SSE estabelecida com sucesso. " +
              "A resposta permanece aberta e envia eventos continuamente.",

            content: {
              "text/event-stream": {
                schema: {
                  type: "string",
                  description:
                    "Stream de eventos Server-Sent Events (SSE)."
                },

                examples: {
                  connected: {
                    summary:
                      "Confirmação da conexão",

                    value:
                      'data: {"type":"CONNECTED","receiverId":"user-003","message":"SSE connection established"}\n\n'
                  },

                  notification: {
                    summary:
                      "Notificação recebida",

                    value:
                      'data: {"id":"e5faafc4-9254-48b1-9e9e-47761f0c5def","type":"APPOINTMENT_CREATED","source":"erp-clinical","senderId":"user-001","receiverId":"user-003","channel":"sse","title":"Evento: APPOINTMENT_CREATED","message":"Nova consulta criada","data":{"appointmentId":"appointment-001"},"read":false,"timestamp":"2026-09-14T12:35:00.000Z"}\n\n'
                  }
                }
              }
            }
          },

          400: {
            description:
              "Parâmetro receiverId ausente ou inválido."
          }
        }
      }
    },

    async function (req, res) {
      const { receiverId } = req.query;

      /**
       * Configuração SSE.
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
       * Adapta a resposta HTTP do Fastify
       * ao contrato NotificationConnection.
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
       * Registra a conexão na infraestrutura SSE.
       */
      sseConnectionManager.addConnection(
        receiverId,
        connection
      );

      app.log.info(
        {
          receiverId,
          connections:
            sseConnectionManager
              .getConnections(receiverId)
              .size
        },
        "SSE connection registered"
      );

      /**
       * Confirmação inicial.
       */
      await connection.send(
        JSON.stringify({
          type: "CONNECTED",
          receiverId,
          message:
            "SSE connection established"
        })
      );

      app.log.info(
        {
          receiverId,
          connections:
            sseConnectionManager
              .getConnections(receiverId)
              .size
        },
        "SSE connection ready"
      );

      /**
       * Tenta entregar notificações pendentes.
       *
       * Isso permite recuperar notificações que
       * foram criadas enquanto o receiver estava offline.
       */
      try {
        await notificationService.deliverPending(
          receiverId
        );
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
       * Remove a conexão quando o cliente encerra.
       */
      req.raw.on(
        "close",
        () => {
          app.log.info(
            {
              receiverId,
              connections:
                sseConnectionManager
                  .getConnections(receiverId)
                  .size
            },
            "SSE connection closed"
          );

          sseConnectionManager.removeConnection(
            receiverId,
            connection
          );
        }
      );

      /**
       * Mantém o stream aberto.
       */
      app.log.info(
        {
          receiverId
        },
        "SSE waiting"
      );

      await new Promise<void>(() => {});
    }
  );
}