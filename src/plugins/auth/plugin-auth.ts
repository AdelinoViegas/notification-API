import fp from "fastify-plugin";
import { AuthService } from "../../services/authService";

declare module "fastify" {
  interface FastifyInstance {
    authService: AuthService;
  }
}

export default fp(async (app) => {
  const baseUrl = app.config.AUTH_API_URL;

  if (!baseUrl) {
    throw new Error(
      "AUTH_API_URL não configurado"
    );
  }

  app.decorate(
    "authService",
    new AuthService(baseUrl)
  );
});