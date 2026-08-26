import {
  DomainEvent,
  Notification,
  NotificationEvent,
  NotificationRepository
} from "../services/types";
import { NotificationDispatcher } from "./dispatcher";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationDispatcher: NotificationDispatcher
  ) {}

  async process( event: DomainEvent ): Promise<Notification[]> {

    // 1. Validar o evento
    this.validate(event);

    // 2. Determinar o receptor
    const receiverId = this.determineReceiver(event);

    // 3. Criar a notificação
    const notification = this.createNotification(event, receiverId);

    // 4. Persistir primeiro
    await this.notificationRepository.create(notification);

    // 5. Tentar entregar imediatamente
    await this.tryDeliver(notification);

    // 6. Retornar a notificação
    // com o estado atual persistido
    const persistedNotification = await this.notificationRepository.findById(notification.id);

    return [persistedNotification ?? notification];
  }

  async deliverPending(receiverId: string): Promise<void> {

    const notifications = await this.notificationRepository.findPendingByReceiver(receiverId);

    for (const notification of notifications) {
      await this.tryDeliver(notification);
    }
  }

  private async tryDeliver(notification: Notification): Promise<void> {
    const event: NotificationEvent = {
      id: notification.id,
      type: notification.type,
      source: notification.source,
      senderId: notification.senderId,
      receiverId: notification.receiverId,
      channel: notification.channel,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: notification.read,
      timestamp: notification.timestamp,
    };

    try {
      await this.notificationDispatcher.dispatch(event);

      // Entrega realizada com sucesso.
      await this.notificationRepository.updateStatus(notification.id, "SENT");
    } catch (error) {
      // Se não existir conexão SSE ou ocorrer
      // uma falha temporária de entrega,
      // mantemos a notificação como PENDING.
      console.warn(`Notificação ${notification.id} permanece PENDING:`, error);
    }
  }

  private validate(event: DomainEvent): void {
    if (!event.type) 
      throw new Error("Domain Event type é obrigatório");

    if (!event.source) 
      throw new Error("Domain Event source é obrigatório");

    if (!event.senderId) 
      throw new Error("Domain Event senderId é obrigatório");

    if (!event.receiverId) 
      throw new Error("Domain Event receiverId é obrigatório");

    if (!event.timestamp) 
      throw new Error("Domain Event timestamp é obrigatório");
  }

  private determineReceiver(event: DomainEvent): string {
    return event.receiverId;
  }

  private createNotification(event: DomainEvent, receiverId: string): Notification {
    const now = new Date();

    return {
      id: crypto.randomUUID(),
      type: event.type,
      source: event.source,
      senderId: event.senderId,
      receiverId,
      channel: "sse",
      title: event.title ?? this.buildTitle(event),
      message: event.message ?? this.buildMessage(event),
      data: event.data,
      status: "PENDING",
      read: false,
      createdAt: now,
      updatedAt: now,
      timestamp: event.timestamp,
      deliveredAt: undefined,
    };
  }

  private buildTitle(event: DomainEvent): string {
    return `Evento: ${event.type}`;
  }

  private buildMessage(event: DomainEvent): string {
    return `Novo evento recebido: ${event.type}`;
  }
}