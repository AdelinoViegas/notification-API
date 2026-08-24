"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const container_js_1 = require("./notification/delivery/sse/container.js");
function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true,
    });
    app.get("/test", async () => {
        return {
            status: "ok",
            service: "notification-api",
        };
    });
    /**
     * SSE notification stream
     *
     * O cliente mantém esta conexão aberta
     * para receber notificações em tempo real.
     *
     * Exemplo:
     *
     * GET /api/notifications/stream?receiverId=doctor-123
     */
    app.get("/api/notifications/stream", async (request, reply) => {
        const { receiverId } = request.query;
        if (!receiverId) {
            return reply.code(400).send({
                error: "receiverId é obrigatório",
            });
        }
        /**
         * Configuração necessária para SSE.
         */
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("X-Accel-Buffering", "no");
        /**
         * Envia os headers imediatamente.
         */
        reply.raw.flushHeaders();
        /**
         * Implementação da nossa abstração SSEConnection
         * utilizando o response do Node/Fastify.
         */
        const connection = {
            send: async (data) => {
                reply.raw.write(`data: ${data}\n\n`);
            },
            close: () => {
                if (!reply.raw.destroyed) {
                    reply.raw.end();
                }
            },
        };
        /**
         * Registra a conexão para este receiver.
         */
        container_js_1.sseConnectionManager.addConnection(receiverId, connection);
        /**
         * Evento inicial para confirmar
         * que a conexão foi estabelecida.
         */
        await connection.send(JSON.stringify({
            type: "CONNECTED",
            receiverId,
            message: "SSE connection established",
        }));
        /**
         * Detecta quando o cliente fecha a conexão.
         *
         * Pode acontecer quando:
         * - fecha o browser;
         * - faz refresh;
         * - perde a conexão;
         * - o frontend fecha o EventSource.
         */
        request.raw.on("close", () => {
            container_js_1.sseConnectionManager.removeConnection(receiverId, connection);
            app.log.info(`SSE connection closed for receiver: ${receiverId}`);
        });
        /**
         * Mantém a função pendente.
         *
         * O endpoint não deve terminar enquanto
         * a conexão SSE estiver ativa.
         */
        await new Promise(() => { });
    });
    return app;
}
