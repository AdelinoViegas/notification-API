import { FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

export default function list(app: FastifyInstance) {
  const fastify = app.withTypeProvider<JsonSchemaToTsProvider>();
  const { listNotifications } = fastify.services;

  fastify.get(
    "/api/notifications",
    {
      schema: {}
    },
    async function (req, res) {
      const receiverId = req.user.id;

      const notifications = await listNotifications.execute(receiverId);

      return res.send({
        success: true,
        notifications
      });
    }
  );
}