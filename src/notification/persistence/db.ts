import { Notification } from "../../services/types";
import { NotificationRepository } from "../notificationRepository";
import { database } from "../../lib/database/connection";

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
        timestamp,
        created_at,
        updated_at,
        delivered_at
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
        @timestamp,
        @created_at,
        @updated_at,
        @delivered_at
      )
    `);

    statement.run({
      id: notification.id,
      type: notification.type,
      source: notification.source,
      sender_id: notification.senderId,
      receiver_id: notification.receiverId,
      channel: notification.channel,
      title: notification.title,
      message: notification.message,
      data: notification.data
        ? JSON.stringify(notification.data)
        : null,
      status: notification.status,
      read: notification.read ? 1 : 0,
      read_at: notification.readAt
        ? notification.readAt.toISOString()
        : null,
      timestamp: notification.timestamp,
      created_at:
        notification.createdAt.toISOString(),
      updated_at:
        notification.updatedAt.toISOString(),
      delivered_at:
        notification.deliveredAt
          ? notification.deliveredAt.toISOString()
          : null,
    });

    return notification;
  }

  private mapRowToNotification(
    row: any
  ): Notification {
    return {
      id: row.id,
      type: row.type,
      source: row.source,
      senderId: row.sender_id,
      receiverId: row.receiver_id,
      channel: row.channel,
      title: row.title,
      message: row.message,
      data: row.data
        ? JSON.parse(row.data)
        : undefined,
      status: row.status,
      read: Boolean(row.read),
      readAt: row.read_at
        ? new Date(row.read_at)
        : undefined,
      timestamp: row.timestamp,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deliveredAt: row.delivered_at
        ? new Date(row.delivered_at)
        : undefined,
    };
  }

  async updateStatus(
    id: string,
    status: Notification["status"]
  ): Promise<void> {
    const now =
      new Date().toISOString();

    const statement = database.prepare(`
      UPDATE notifications
      SET
        status = @status,
        delivered_at =
          CASE
            WHEN @status = 'SENT'
            THEN @delivered_at
            ELSE delivered_at
          END,
        updated_at = @updated_at
      WHERE id = @id
    `);

    statement.run({
      id,
      status,
      delivered_at:
        status === "SENT"
          ? now
          : null,
      updated_at: now,
    });
  }

  async findById(
    id: string
  ): Promise<Notification | null> {
    const statement = database.prepare(`
      SELECT
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
        timestamp,
        created_at,
        updated_at,
        delivered_at
      FROM notifications
      WHERE id = @id
    `);

    const row =
      statement.get({ id }) as any;

    if (!row) {
      return null;
    }

    return this.mapRowToNotification(row);
  }

  async findByReceiver(
    receiverId: string
  ): Promise<Notification[]> {
    const statement = database.prepare(`
      SELECT
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
        timestamp,
        created_at,
        updated_at,
        delivered_at
      FROM notifications
      WHERE receiver_id = @receiverId
      ORDER BY created_at DESC
    `);

    const rows =
      statement.all({ receiverId }) as any[];

    return rows.map((row) =>
      this.mapRowToNotification(row)
    );
  }

  async markAsRead(
    id: string
  ): Promise<Notification | null> {
    const notification =
      await this.findById(id);

    if (!notification) {
      return null;
    }

    if (notification.read) {
      return notification;
    }

    const now =
      new Date().toISOString();

    const statement = database.prepare(`
      UPDATE notifications
      SET
        read = 1,
        read_at = @read_at,
        updated_at = @updated_at
      WHERE id = @id
    `);

    statement.run({
      id,
      read_at: now,
      updated_at: now,
    });

    return this.findById(id);
  }

  async findUnreadByReceiver(
    receiverId: string
  ): Promise<Notification[]> {
    const statement = database.prepare(`
      SELECT
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
        timestamp,
        created_at,
        updated_at,
        delivered_at
      FROM notifications
      WHERE receiver_id = @receiverId
        AND read = 0
      ORDER BY created_at DESC
    `);

    const rows =
      statement.all({ receiverId }) as any[];

    return rows.map((row) =>
      this.mapRowToNotification(row)
    );
  }

  async findPendingByReceiver(
    receiverId: string
  ): Promise<Notification[]> {
    const statement = database.prepare(`
      SELECT
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
        timestamp,
        created_at,
        updated_at,
        delivered_at
      FROM notifications
      WHERE receiver_id = @receiverId
        AND status = 'PENDING'
        AND delivered_at IS NULL
      ORDER BY created_at ASC
    `);

    const rows =
      statement.all({ receiverId }) as any[];

    return rows.map((row) =>
      this.mapRowToNotification(row)
    );
  }
}