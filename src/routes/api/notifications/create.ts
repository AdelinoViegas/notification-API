import {
  FastifyInstance,
} from "fastify";

import {
  notificationService,
  notificationDispatcher,
} from "../../../notification/container";

import {
  notificationRepository,
} from "../../../notification/persistence/container";

export async function registerCreateNotificationRoute(
  app: FastifyInstance
) {
  app.post(
    "/api/notifications",
    async (request, reply) => {
      const body = request.body as {
        receiverId?: string;
        message?: string;
      };

      if (!body.receiverId) {
        return reply
          .code(400)
          .send({
            error:
              "receiverId é obrigatório",
          });
      }

      if (!body.message) {
        return reply
          .code(400)
          .send({
            error:
              "message é obrigatório",
          });
      }

      const event = {
        type: "SYSTEM" as const,
        source: "notification-api",
        senderId: "test-user",
        receiverId:
          body.receiverId,
        title: "Notificação",
        message: body.message,
        data: {},
        timestamp:
          new Date().toISOString(),
      };

      const notifications =
        await notificationService.process(
          event
        );

      const notification =
        notifications[0];

      try {
        await notificationDispatcher.dispatch(
          notification
        );

        await notificationRepository.updateStatus(
          notification.id,
          "SENT"
        );

        app.log.info(
          `Notification ${notification.id} sent successfully`
        );
      } catch (error) {
        await notificationRepository.updateStatus(
          notification.id,
          "FAILED"
        );

        app.log.error(
          error,
          `Failed to deliver notification ${notification.id}`
        );

        throw error;
      }

      return reply.send({
        success: true,
        message:
          "Notification dispatched successfully",
        notification: {
          ...notification,
          status: "SENT",
        },
      });
    }
  );
}