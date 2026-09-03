import type { Notification } from "./types";
import { NotificationRepository } from "../notification/notificationRepository";

export class GetNotification {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    id: string
  ): Promise<Notification | null> {
    return this.notificationRepository.findById(id);
  }
}