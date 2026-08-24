"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEAdapter = void 0;
class SSEAdapter {
    connectionManager;
    constructor(connectionManager) {
        this.connectionManager = connectionManager;
    }
    async deliver(notification) {
        const connections = this.connectionManager.getConnections(notification.receiverId);
        if (connections.size === 0) {
            console.log(`Nenhuma conexão SSE encontrada para: ${notification.receiverId}`);
            return;
        }
        for (const connection of connections) {
            try {
                await connection.send(JSON.stringify(notification));
            }
            catch (error) {
                console.error(`Erro ao enviar notificação para ${notification.receiverId}:`, error);
                this.connectionManager.removeConnection(notification.receiverId, connection);
            }
        }
    }
}
exports.SSEAdapter = SSEAdapter;
