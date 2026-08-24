"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaNotificationRepository = void 0;
const prisma_1 = require("../../database/prisma");
class PrismaNotificationRepository {
    async create(notification) {
        const created = await prisma_1.prisma.notification.create({
            data: {
                id: notification.id,
                type: notification.type,
                source: notification.source,
                senderId: notification.senderId,
                receiverId: notification.receiverId,
                channel: notification.channel,
                title: notification.title,
                message: notification.message,
                data: notification.data,
                status: notification.status,
                read: notification.read,
                readAt: notification.readAt ?? undefined,
                createdAt: notification.createdAt,
                updatedAt: notification.updatedAt,
            },
        });
        return {
            id: created.id,
            type: created.type,
            source: created.source,
            senderId: created.senderId,
            receiverId: created.receiverId,
            channel: created.channel,
            title: created.title,
            message: created.message,
            data: created.data,
            status: created.status,
            read: created.read,
            readAt: created.readAt ?? undefined,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        };
    }
}
exports.PrismaNotificationRepository = PrismaNotificationRepository;
