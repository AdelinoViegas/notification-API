import Fastify from "fastify";
import fastifyEnv from "@fastify/env";

import { registerApiRoutes } from "./routes/api";
import { runMigrations } from "./lib/database/migrations";
import authPlugin from "./plugins/auth/auth";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(fastifyEnv, {
    schema: {
      type: "object",
      required: ["AUTH_API_URL"],
      properties: {
        AUTH_API_URL: {
          type: "string",
        },
      },
    },
    dotenv: true,
  });

  await app.register(authPlugin);

  runMigrations();

  await registerApiRoutes(app);

  return app;
}