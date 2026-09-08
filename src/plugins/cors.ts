import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";

export default fastifyPlugin(function(fastify){
  fastify.register(fastifyCors, {
    origin: "*",
    methods: [ "GET", "POST", "PATCH" ]
  });
});