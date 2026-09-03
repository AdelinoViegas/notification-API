import type {
  DomainEvent,
  Notification,
} from "./types";
import { NotificationRepository } from "../notification/notificationRepository";

export class CreateNotification {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    event: DomainEvent
  ): Promise<Notification> {
    this.validate(event);

    const receiverId =
      this.determineReceiver(event);

    const notification =
      this.buildNotification(
        event,
        receiverId
      );

    await this.notificationRepository.create(
      notification
    );

    return notification;
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

  private buildNotification(
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
      title:
        event.title ??
        this.buildTitle(event),
      message:
        event.message ??
        this.buildMessage(event),
      data: event.data,
      status: "PENDING",
      read: false,
      createdAt: now,
      updatedAt: now,
      timestamp: event.timestamp,
      deliveredAt: undefined,
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