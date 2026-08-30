import { NotificationConnection } from "./types";

export interface NotificationConnectionManager {
  addConnection(
    receiverId: string,
    connection: NotificationConnection
  ): void;

  removeConnection(
    receiverId: string,
    connection: NotificationConnection
  ): void;
}