import { Notification } from "../../services/types";
import { database } from "../../lib/database/connection";
import { NotificationRepository } from "./repository";

export class SQLiteNotificationRepository
  implements NotificationRepository
{
  async create(
    notification: Notification
  ): Promise<Notification> {
    const statement = database.prepare(`
      INSERT INTO notifications (
        id,
        type,
        source,
        sender_id,
        receiver_id,
        channel,
        title,
        message,
        data,
        status,
        read,
        read_at,
        created_at,
        updated_at
      )
      VALUES (
        @id,
        @type,
        @source,
        @sender_id,
        @receiver_id,
        @channel,
        @title,
        @message,
        @data,
        @status,
        @read,
        @read_at,
        @created_at,
        @updated_at
      )
    `);

    statement.run({
      id: notification.id,
      type: notification.type,
      source: notification.source,
      sender_id: notification.senderId,
      receiver_id: notification.receiverId,
      channel: notification.channel,
      title: notification.title ?? null,
      message: notification.message ?? null,
      data: notification.data
        ? JSON.stringify(notification.data)
        : null,
      status: notification.status,
      read: notification.read ? 1 : 0,
      read_at: notification.readAt
        ? notification.readAt.toISOString()
        : null,
      created_at:
        notification.createdAt.toISOString(),
      updated_at:
        notification.updatedAt.toISOString(),
    });

    return notification;
  }

  /**
   * Atualiza o status da notificação.
   *
   * PENDING → SENT
   * PENDING → FAILED
   */
  async updateStatus(
    id: string,
    status: Notification["status"]
  ): Promise<void> {
    const statement = database.prepare(`
      UPDATE notifications
      SET
        status = @status,
        updated_at = @updated_at
      WHERE id = @id
    `);

    statement.run({
      id,
      status,
      updated_at:
        new Date().toISOString(),
    });
  }
}