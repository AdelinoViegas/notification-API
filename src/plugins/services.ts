import fp from "fastify-plugin";

import {
  createNotification,
  createAndDeliverNotification,
  getNotification,
  listNotifications,
  listUnreadNotifications,
  markNotificationAsRead,
  deliverPendingNotifications,
} from "../services/container";

const services = {
  createNotification,
  createAndDeliverNotification,
  getNotification,
  listNotifications,
  listUnreadNotifications,
  markNotificationAsRead,
  deliverPendingNotifications,
};

export default fp(async function (fastify) {
  fastify.decorate("services", services);
});

declare module "fastify" {
  interface FastifyInstance {
    services: typeof services;
  }
}