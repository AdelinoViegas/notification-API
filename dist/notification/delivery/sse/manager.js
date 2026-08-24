"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEConnectionManager = void 0;
class SSEConnectionManager {
    connections = new Map();
    addConnection(receiver, connection) {
        const receiverConnections = this.connections.get(receiver) ?? new Set();
        receiverConnections.add(connection);
        this.connections.set(receiver, receiverConnections);
    }
    removeConnection(receiver, connection) {
        const receiverConnections = this.connections.get(receiver);
        if (!receiverConnections) {
            return;
        }
        receiverConnections.delete(connection);
        if (receiverConnections.size === 0) {
            this.connections.delete(receiver);
        }
    }
    getConnections(receiver) {
        return this.connections.get(receiver) ?? new Set();
    }
}
exports.SSEConnectionManager = SSEConnectionManager;
