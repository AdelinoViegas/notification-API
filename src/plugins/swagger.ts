import fp from 'fastify-plugin'
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const tags = {}

export default fp(function(fastify){
  fastify.register(swagger, {
    openapi: {
      info: {
        title: "erp storage service",
        description: "File Storage Service",
        version: "1.0.1"
      },
      servers: [
        {
          url: "http://localhost:3001",
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer"
          }
        }
      },
      security: [
        { bearerAuth: [] }
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