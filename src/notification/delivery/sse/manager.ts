import { NotificationConnection } from "../../../services/types";
import { NotificationConnectionManager } from "../../../services/notificationConnectionManager";

export class SSEConnectionManager
  implements NotificationConnectionManager {
  private connections =
    new Map<string, Set<NotificationConnection>>();

  addConnection(
    receiver: string,
    connection: NotificationConnection
  ): void {
    const receiverConnections =
      this.connections.get(receiver) ??
      new Set();

    receiverConnections.add(connection);

    this.connections.set(
      receiver,
      receiverConnections
    );
  }

  removeConnection(
    receiver: string,
    connection: NotificationConnection
  ): void {
    const receiverConnections =
      this.connections.get(receiver);

    if (!receiverConnections) {
      return;
    }

    receiverConnections.delete(connection);

    if (receiverConnections.size === 0) {
      this.connections.delete(receiver);
    }
  }

  getConnections(
    receiver: string
  ): Set<NotificationConnection> {
    return (
      this.connections.get(receiver) ??
      new Set()
    );
  }
}