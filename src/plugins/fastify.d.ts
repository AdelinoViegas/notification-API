import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      AUTH_API_URL: string;
    };
  }
}
