import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import type { AuthUser } from "./types";

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authorization =
    request.headers.authorization;

  if (!authorization) {
    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Token não fornecido",
    });
  }

  const [scheme, token] =
    authorization.split(" ");

  if (
    scheme?.toLowerCase() !== "bearer" ||
    !token
  ) {
    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Authorization inválido",
    });
  }

  try {
    request.user =
      await request.server.authService.authenticate(
        token
      );
  } catch (error) {
    request.log.warn(
      { err: error },
      "Falha na autenticação"
    );

    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Token inválido",
    });
  }
}