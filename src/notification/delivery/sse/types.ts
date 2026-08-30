export interface NotificationConnection {
  send(data: string): Promise<void>;
  close(): void;
}
