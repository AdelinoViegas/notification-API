import type { Notification } from "./types";
import { NotificationRepository } from "../notification/notificationRepository";

export class ListNotifications {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    receiverId: string
  ): Promise<Notification[]> {
    return this.notificationRepository.findByReceiver(
      receiverId
    );
  }
}