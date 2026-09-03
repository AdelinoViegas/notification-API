import {
  DomainEvent,
  Notification
} from "./types";
import { CreateNotification } from "./createNotification";
import { GetNotification } from "./getNotification";
import { ListNotifications } from "./listNotifications";
import { ListUnreadNotifications } from "./listUnreadNotifications";
import { MarkNotificationAsRead } from "./markNotificationAsRead";
import { DeliverPendingNotifications } from "./deliverPendingNotifications";

export class NotificationService {
  constructor(
    private readonly createNotification: CreateNotification,
    private readonly getNotification: GetNotification,
    private readonly listNotifications: ListNotifications,
    private readonly listUnreadNotifications: ListUnreadNotifications,
    private readonly markNotificationAsRead: MarkNotificationAsRead,
    private readonly deliverPendingNotifications: DeliverPendingNotifications
  ) {}

  async process(
    event: DomainEvent
  ): Promise<Notification[]> {
    const notification =
      await this.createNotification.execute(event);

    await this.deliverPendingNotifications.execute(
      notification.receiverId
    );

    const persistedNotification =
      await this.getNotification.execute(
        notification.id
      );

    return [
      persistedNotification ?? notification
    ];
  }

  async deliverPending(
    receiverId: string
  ): Promise<void> {
    await this.deliverPendingNotifications.execute(
      receiverId
    );
  }

  async getById(
    id: string
  ): Promise<Notification | null> {
    return this.getNotification.execute(id);
  }

  async listByReceiver(
    receiverId: string
  ): Promise<Notification[]> {
    return this.listNotifications.execute(
      receiverId
    );
  }

  async listUnreadByReceiver(
    receiverId: string
  ): Promise<Notification[]> {
    return this.listUnreadNotifications.execute(
      receiverId
    );
  }

  async markAsRead(
    id: string
  ): Promise<Notification | null> {
    return this.markNotificationAsRead.execute(
      id
    );
  }
}