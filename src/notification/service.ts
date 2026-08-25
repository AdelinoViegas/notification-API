import {
  DomainEvent,
  Notification,
} from "../services/types";

import {
  NotificationRepository,
} from "./persistence/repository";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async process(
    event: DomainEvent
  ): Promise<Notification[]> {

    // 1. Validar o evento
    this.validate(event);

    // 2. Determinar o receptor
    const receiverId = this.determineReceiver(event);

    // 3. Criar a notificação
    const notification =
      this.createNotification(
        event,
        receiverId
      );

    // 4. Persistir
    await this.notificationRepository.create(
      notification
    );

    // 5. Retornar a notificação criada
    return [notification];
  }

  private validate(
    event: DomainEvent
  ): void {

    if (!event.type) {
      throw new Error(
        "Domain Event type é obrigatório"
      );
    }

    if (!event.source) {
      throw new Error(
        "Domain Event source é obrigatório"
      );
    }

    if (!event.senderId) {
      throw new Error(
        "Domain Event senderId é obrigatório"
      );
    }

    if (!event.receiverId) {
      throw new Error(
        "Domain Event receiverId é obrigatório"
      );
    }

    if (!event.timestamp) {
      throw new Error(
        "Domain Event timestamp é obrigatório"
      );
    }
  }

  private determineReceiver(
    event: DomainEvent
  ): string {

    return event.receiverId;
  }


  private createNotification(
    event: DomainEvent,
    receiverId: string
  ): Notification {
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
    };
  }

  private buildTitle(
    event: DomainEvent
  ): string {

    return `Evento: ${event.type}`;
  }

  private buildMessage(
    event: DomainEvent
  ): string {

    return `Novo evento recebido: ${event.type}`;
  }
}