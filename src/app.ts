import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import servicesPlugin from "./plugins/services";
import { registerApiRoutes } from "./routes/api";
import { runMigrations } from "./lib/database/migrations";
import authPlugin from "./plugins/auth/plugin-auth";

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
  await app.register(servicesPlugin);
  
  runMigrations();

  await registerApiRoutes(app);

  return app;

}