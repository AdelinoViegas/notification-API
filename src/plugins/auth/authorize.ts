import {
  FastifyReply,
  FastifyRequest,
} from "fastify";

export function authorizeUser(
  request: FastifyRequest,
  reply: FastifyReply,
  userId: string
): boolean {
  if (request.user.id !== userId) {
    reply.code(403).send({
      statusCode: 403,
      error: "Forbidden",
      message: "Acesso não autorizado",
    });

    return false;
  }

  return true;
}