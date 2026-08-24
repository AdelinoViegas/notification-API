import { NotificationDispatcher } from "./dispatcher";
import { SSEAdapter } from "./delivery/sse/adapter";
import { sseConnectionManager } from "./delivery/sse/container";
import { NotificationService } from "./service";
import { notificationRepository } from "./persistence/container";

const sseAdapter = new SSEAdapter(
  sseConnectionManager
);

export const notificationDispatcher =
  new NotificationDispatcher(
    new Map([
      ["sse", sseAdapter],
    ])
  );

export const notificationService =
  new NotificationService(
    notificationRepository
  );