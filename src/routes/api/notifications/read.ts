import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

export default function read(app: FastifyInstance) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { markNotificationAsRead } = fastify.services;

  fastify.patch(
    "/api/notifications/:id/read",
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
      try {
        const notification =
          await markNotificationAsRead.execute(
            req.params.id,
            req.user.id
          );

        if (!notification) {
          return res.code(404).send({
            success: false,
            error: "Notificação não encontrada"
          });
        }

        return res.send({
          success: true,
          message: "Notificação marcada como lida",
          notification
        });
      } catch (error) {
        app.log.error(
          error,
          "Erro ao marcar notificação como lida"
        );

        return res.code(403).send({
          success: false,
          statusCode: 403,
          error: "Forbidden",
          message:
            "Você não tem permissão para alterar esta notificação"
        });
      }
    }
  );
}