import Fastify from "fastify";
import { registerApiRoutes } from "./routes/api";
import { runMigrations } from "./lib/database/migrations";

export function buildApp() {
  const app = Fastify({ logger: true });
  /**
   * Database
   */
  runMigrations();

  /**
   * API Routes
   */
  registerApiRoutes(app);
  return app;
}