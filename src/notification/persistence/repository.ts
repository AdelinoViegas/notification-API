import { Notification } from "../../services/types";

export interface NotificationRepository {
  create(
    notification: Notification
  ): Promise<Notification>;

  updateStatus(
    id: string,
    status: Notification["status"]
  ): Promise<void>;
}