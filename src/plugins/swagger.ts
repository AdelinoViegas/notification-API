import fp from 'fastify-plugin'
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const tags = {}

export default fp(function(fastify){
  fastify.register(swagger, {
    openapi: {
      info: {
        title: "notify",
        description: "Serviço de Notificações",
        version: "1.0.0"
      },
      servers: [
        {
          url: "http://localhost:3000",
        }
      ]
    }
  });

  fastify.decorate("tags", tags);

  fastify.register(swaggerUi, {
    routePrefix: "/doc",
    theme: { title: "erp-notfy-service" }
  });
});

declare module "fastify" {
  export interface FastifyInstance {
    tags: typeof tags;
  }
}