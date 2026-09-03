import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

export default function list(app: FastifyInstance) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { notificationService } = fastify.services;

  fastify.get("/api/notifications", {
    schema: {}
  }, async function (req, res) {
    const receiverId = req.user.id;
    const notifications = await notificationService.listByReceiver(receiverId);

    return res.send({
      success: true,
      notifications
    });
  });
}