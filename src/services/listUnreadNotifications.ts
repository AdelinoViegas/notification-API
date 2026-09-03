import type { Notification } from "./types";
import { NotificationRepository } from "../notification/notificationRepository";

export class ListUnreadNotifications {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    receiverId: string
  ): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByReceiver(
      receiverId
    );
  }
}