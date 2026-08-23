import Fastify from "fastify";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.get("/test", async () => {
    return {
      status: "ok",
      service: "notification-api",
    };
  });

  return app;
}