import { prisma } from "../../database/prisma";
import { Notification } from "../../types";
import { NotificationRepository } from "./repository";

export class PrismaNotificationRepository implements NotificationRepository {

  async create(
    notification: Notification
  ): Promise<Notification> {

    const created =
      await prisma.notification.create({
        data: {
          id: notification.id,
          type: notification.type,
          source: notification.source,
          senderId: notification.senderId,
          receiverId: notification.receiverId,
          channel: notification.channel,
          title: notification.title as string,
          message: notification.message as string,
          data: notification.data as Record<string, Date>,
          status: notification.status as Notification["status"],
          read: notification.read,
          readAt: notification.readAt ?? undefined,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        },
      });

    return {
      id: created.id,
      type: created.type as Notification["type"],
      source: created.source,
      senderId: created.senderId,
      receiverId: created.receiverId,
      channel: created.channel as Notification["channel"],
      title: created.title as string,
      message: created.message,
      data: created.data as | Record<string, unknown> | undefined,
      status: created.status as Notification["status"],
      read: created.read,
      readAt: created.readAt ?? undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}