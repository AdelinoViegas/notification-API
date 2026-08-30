export interface SSEConnection {
  send(data: string): Promise<void>;
  close(): void;
}
