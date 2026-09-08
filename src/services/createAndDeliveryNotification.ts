import type {
  DomainEvent,
  Notification,
} from "./types";

import { CreateNotification } from "./createNotification";
import { DeliverPendingNotifications } from "./deliverPendingNotifications";
import { GetNotification } from "./getNotification";

export class CreateAndDeliverNotification {
  constructor(
    private readonly createNotification: CreateNotification,
    private readonly deliverPendingNotifications: DeliverPendingNotifications,
    private readonly getNotification: GetNotification
  ) {}

  async execute(
    event: DomainEvent
  ): Promise<Notification> {
    const notification = await this.createNotification.execute(event);

    await this.deliverPendingNotifications.execute(notification.receiverId);

    const persistedNotification =
      await this.getNotification.execute(
        notification.id
      );

    return persistedNotification ?? notification;
  }
}