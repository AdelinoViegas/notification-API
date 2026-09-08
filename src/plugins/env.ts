import fastifyPlugin from "fastify-plugin";
import fastifyEnv from "@fastify/env";

const schema = {
  type: 'object',
  required: [ 
    "DATABASE_URL"
  ],
  properties: {
    DATABASE_URL: { type: "string" }
  }
}

const options = {
  confKey: 'config', // optional, default: 'config'
  schema: schema,
}

export default fastifyPlugin(function(fastify){
  fastify.register(fastifyEnv, options);
}, {
  name: "env"
});

declare module "fastify" {
  export interface FastifyInstance {
    config: {}
  }
}