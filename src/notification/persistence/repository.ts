/*import { NotificationEvent } from "../../types";

export interface NotificationRepository {
  create(notification: NotificationEvent): Promise<void>;

  findUnreadByReceiver(
    receiver: string
  ): Promise<NotificationEvent[]>;

  markAsRead(
    notificationId: string
  ): Promise<void>;
}*/

import { Notification } from "../../types";

export interface NotificationRepository {

  create(
    notification: Notification
  ): Promise<Notification>;

}