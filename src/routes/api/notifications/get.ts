import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

export default function get(app: FastifyInstance) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { getNotification } = fastify.services;

  fastify.get(
    "/api/notifications/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: {
              type: "string"
            }
          },
          required: ["id"],
          additionalProperties: false
        }
      }
    },
    async function (req, res) {
      const notification =
        await getNotification.execute(
          req.params.id
        );

      if (!notification) {
        return res.code(404).send({
          success: false,
          error: "Notificação não encontrada"
        });
      }

      if (
        notification.receiverId !== req.user.id
      ) {
        return res.code(403).send({
          success: false,
          statusCode: 403,
          error: "Forbidden",
          message:
            "Você não tem permissão para acessar esta notificação"
        });
      }

      return res.send({
        success: true,
        notification
      });
    }
  );
}