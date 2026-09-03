import type { Notification } from "./types";

import { NotificationRepository } from "../notification/notificationRepository";

export class MarkNotificationAsRead {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    id: string
  ): Promise<Notification | null> {
    return this.notificationRepository.markAsRead(id);
  }
}