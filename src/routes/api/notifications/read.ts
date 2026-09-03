import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

export default function read(app: FastifyInstance) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { notificationService } = fastify.services;

  fastify.patch("/api/notifications/:id/read", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: {
            type: "string"
          }
        },
        required: ["id"]
      }
    }
  }, async function (req, res) {
    const notification = await notificationService.getById(req.params.id);

    if (!notification) {
      return res
        .code(404)
        .send({
          error:
            "Notificação não encontrada"
        });
    }

    if (notification.receiverId !== req.user.id) {
      return res
        .code(403)
        .send({
          statusCode: 403,
          error: "Forbidden",
          message:
            "Você não tem permissão para alterar esta notificação"
        });
    }

    const updatedNotification = await notificationService.markAsRead(req.params.id);

    if (!updatedNotification) {
      return res
        .code(404)
        .send({
          error:
            "Notificação não encontrada"
        });
    }

    return res.send({
      success: true,
      message:
        "Notificação marcada como lida",
      notification: updatedNotification
    });
  });
}