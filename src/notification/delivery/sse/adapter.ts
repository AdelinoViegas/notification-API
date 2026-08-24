import {
  NotificationDelivery,
  NotificationEvent,
} from "../../../types";

import { SSEConnectionManager } from "./manager";

export class SSEAdapter implements NotificationDelivery {
  constructor(
    private readonly connectionManager: SSEConnectionManager
  ) {}

  async deliver(
    notification: NotificationEvent
  ): Promise<void> {
    const connections =
      this.connectionManager.getConnections(
        notification.receiverId
      );

    if (connections.size === 0) {
      console.log(
        `Nenhuma conexão SSE encontrada para: ${notification.receiverId}`
      );

      return;
    }

    for (const connection of connections) {
      try {
        await connection.send(
          JSON.stringify(notification)
        );
      } catch (error) {
        console.error(
          `Erro ao enviar notificação para ${notification.receiverId}:`,
          error
        );

        this.connectionManager.removeConnection(
          notification.receiverId,
          connection
        );
      }
    }
  }
}