import { Notification } from "./types";

export interface NotificationRepository {
  create(
    notification: Notification
  ): Promise<Notification>;

  updateStatus(
    id: string,
    status: Notification["status"]
  ): Promise<void>;

  findById(
    id: string
  ): Promise<Notification | null>;

  findByReceiver(
    receiverId: string
  ): Promise<Notification[]>;

  findUnreadByReceiver(
    receiverId: string
  ): Promise<Notification[]>;

  findPendingByReceiver(
    receiverId: string
  ): Promise<Notification[]>;

  markAsRead(
    id: string
  ): Promise<Notification | null>;
}