"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const container_1 = require("./notification/delivery/sse/container");
const container_2 = require("./notification/container");
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
    app.post("/api/notifications", async (request, reply) => {
        const body = request.body;
        if (!body.receiverId) {
            return reply
                .code(400)
                .send({
                error: "receiverId é obrigatório",
            });
        }
        if (!body.message) {
            return reply
                .code(400)
                .send({
                error: "message é obrigatório",
            });
        }
        const notification = {
            id: crypto.randomUUID(),
            source: "notification-api",
            senderId: "test-user",
            receiverId: body.receiverId,
            channel: "sse",
            message: body.message,
            title: "Notificação",
            type: "SYSTEM",
            data: {},
            read: false,
            timestamp: new Date().toISOString(),
        };
        /**
         * Envia a notificação para o Dispatcher.
         *
         * Dispatcher
         *      ↓
         * SSEAdapter
         *      ↓
         * SSEConnectionManager
         *      ↓
         * receiverId
         */
        await container_2.notificationDispatcher.dispatch(notification);
        //Resposta do POST.
        return reply.send({
            success: true,
            message: "Notification dispatched successfully",
            notification,
        });
    });
    app.get("/api/notifications/stream", async (request, reply) => {
        const { receiverId, } = request.query;
        //receiverId é obrigatório.
        if (!receiverId) {
            return reply
                .code(400)
                .send({
                error: "receiverId é obrigatório",
            });
        }
        //Configuração SSE.
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        //Evita buffering em alguns proxies.
        reply.raw.setHeader("X-Accel-Buffering", "no");
        //Envia os headers imediatamente.
        reply.raw.flushHeaders();
        //* Adaptamos a resposta HTTP do Fastify para a abstração SSEConnection.
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
        //Registra a conexão para o receiver.
        container_1.sseConnectionManager.addConnection(receiverId, connection);
        app.log.info(`SSE connection opened for receiver: ${receiverId}`);
        // Envia evento inicial.
        await connection.send(JSON.stringify({
            type: "CONNECTED",
            receiverId,
            message: "SSE connection established",
        }));
        // Detecta quando o cliente fecha a conexão.
        request.raw.on("close", () => {
            container_1.sseConnectionManager.removeConnection(receiverId, connection);
            app.log.info(`SSE connection closed for receiver: ${receiverId}`);
        });
        // Mantém a conexão aberta.
        await new Promise(() => { });
    });
    return app;
}
