import {
  DomainEvent,
  Notification,
  NotificationEvent
} from "./types";

import { NotificationRepository } from "./notificationRepository";

import { NotificationDispatcher } from "./notificationDispatcher";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationDispatcher: NotificationDispatcher
  ) {}

  async process(
    event: DomainEvent
  ): Promise<Notification[]> {
    this.validate(event);

    const receiverId =
      this.determineReceiver(event);

    const notification =
      this.createNotification(
        event,
        receiverId
      );

    await this.notificationRepository.create(
      notification
    );

    await this.tryDeliver(notification);

    const persistedNotification =
      await this.notificationRepository.findById(
        notification.id
      );

    return [
      persistedNotification ?? notification
    ];
  }

  async deliverPending(
    receiverId: string
  ): Promise<void> {
    const notifications =
      await this.notificationRepository.findPendingByReceiver(
        receiverId
      );

    for (const notification of notifications) {
      await this.tryDeliver(notification);
    }
  }

  async getById(
    id: string
  ): Promise<Notification | null> {
    return this.notificationRepository.findById(id);
  }

  async listByReceiver(
    receiverId: string
  ): Promise<Notification[]> {
    return this.notificationRepository.findByReceiver(
      receiverId
    );
  }

  async listUnreadByReceiver(
    receiverId: string
  ): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByReceiver(
      receiverId
    );
  }

  async markAsRead(
    id: string
  ): Promise<Notification | null> {
    return this.notificationRepository.markAsRead(id);
  }

  private async tryDeliver(
    notification: Notification
  ): Promise<void> {
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
      await this.notificationDispatcher.dispatch(
        event
      );

      await this.notificationRepository.updateStatus(
        notification.id,
        "SENT"
      );
    } catch (error) {
      console.warn(
        `Notificação ${notification.id} permanece PENDING:`,
        error
      );
    }
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