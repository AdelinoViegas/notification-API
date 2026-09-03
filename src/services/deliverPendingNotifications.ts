import type {
  Notification,
  NotificationEvent,
} from "./types";
import { NotificationRepository } from "../notification/notificationRepository";
import { NotificationDispatcher } from "../notification/notificationDispatcher";

export class DeliverPendingNotifications {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationDispatcher: NotificationDispatcher
  ) {}

  async execute(
    receiverId: string
  ): Promise<void> {
    const notifications =
      await this.notificationRepository.findPendingByReceiver(
        receiverId
      );

    for (const notification of notifications) {
      await this.deliver(notification);
    }
  }

  private async deliver(
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
}