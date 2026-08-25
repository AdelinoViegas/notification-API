import {
  FastifyInstance,
} from "fastify";

import {
  registerCreateNotificationRoute,
} from "./create";

import {
  registerNotificationStreamRoute,
} from "./stream";

export async function registerNotificationRoutes(
  app: FastifyInstance
) {
  await registerCreateNotificationRoute(
    app
  );

  await registerNotificationStreamRoute(
    app
  );
}