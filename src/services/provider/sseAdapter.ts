import { NotificationDelivery, NotificationEvent } from "../../services/types";
import { SSEConnectionManager } from "./sseConnectionManager";

export class SSEAdapter implements NotificationDelivery {
  constructor( private readonly connectionManager: SSEConnectionManager ) {}

  async deliver( notification: NotificationEvent ): Promise<void> {
    let delivered = false;
    const connections = this.connectionManager.getConnections( notification.receiverId );

    if (connections.size === 0) 
      throw new Error( `Nenhuma conexão SSE encontrada para: ${notification.receiverId}`);

    for (const connection of connections) {
      try {
        await connection.send( JSON.stringify(notification));

        delivered = true;
      } catch (error) {
        console.error(`Erro ao enviar notificação para ${notification.receiverId}:`, error);

        this.connectionManager.removeConnection( notification.receiverId, connection);
      }
    }

    if (!delivered) 
      throw new Error(`Falha ao entregar notificação para ${notification.receiverId}`);
  }
}