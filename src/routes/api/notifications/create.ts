
import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { DomainEvent } from "../../../services/types";
import { createNotificationSchema } from "./schemas";

export default function create(app: FastifyInstance) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { createAndDeliverNotification } = fastify.services;

  fastify.post(
    "/api/notifications",
    {
      schema: createNotificationSchema
    },
    async function (req, res) {
      const body = req.body as DomainEvent;

      try {
        const notification = await createAndDeliverNotification.execute(body);

        return res.code(201).send({
          success: true,
          message: "Notification created successfully",
          notification
        });
      } catch (error) {
        app.log.error(
          error,
          "Erro ao processar notificação"
        );

        return res.code(500).send({
          success: false,
          error: "Não foi possível processar a notificação"
        });
      }
    }
  );
}