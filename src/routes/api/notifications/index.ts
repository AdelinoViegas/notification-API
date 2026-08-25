import { FastifyInstance } from "fastify";
import { registerCreateNotificationRoute } from "./create";
import { registerNotificationStreamRoute } from "./stream";
import { registerListNotificationsRoute } from "./list";
import { registerGetNotificationRoute  } from "./get";
import { registerMarkNotificationAsReadRoute } from "./read";
import { registerUnreadNotificationsRoute } from "./unread";

export async function registerNotificationRoutes(app: FastifyInstance) {
  await registerCreateNotificationRoute(app);
  await registerNotificationStreamRoute(app);
  await registerListNotificationsRoute(app);
  await registerUnreadNotificationsRoute(app);
  await registerGetNotificationRoute(app);
  await registerMarkNotificationAsReadRoute(app);
}