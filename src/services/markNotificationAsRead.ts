import type { Notification } from "./types";
import { NotificationRepository } from "../notification/notificationRepository";

export class MarkNotificationAsRead {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    notificationId: string,
    receiverId: string
  ): Promise<Notification | null> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) 
      return null;

    if (notification.receiverId !== receiverId) {
      throw new Error("Usuário não tem permissão para marcar esta notificação como lida");
    }

    return this.notificationRepository.markAsRead(notificationId);
  }
}