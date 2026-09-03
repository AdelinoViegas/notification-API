import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { DomainEvent } from "../../../services/types";

export default function create(app: FastifyInstance) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { notificationService } = fastify.services;

  fastify.post(
    "/api/notifications",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "type",
            "source",
            "senderId",
            "receiverId",
            "timestamp"
          ],
          properties: {
            type: {
              type: "string"
            },
            source: {
              type: "string"
            },
            senderId: {
              type: "string"
            },
            receiverId: {
              type: "string"
            },
            title: {
              type: "string"
            },
            message: {
              type: "string"
            },
            data: {
              type: "object",
              additionalProperties: true
            },
            timestamp: {
              type: "string"
            }
          },
          additionalProperties: false
        }
      }
    },
    async function (req, res) {

      const body =
        req.body as DomainEvent;

      try {
        const notifications = await notificationService.process(body);

        const notification =
          notifications[0];

        return res
          .code(201)
          .send({
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

        return res
          .code(500)
          .send({
            success: false,
            error:
              "Não foi possível processar a notificação"
          });
      }
    }
  );
}