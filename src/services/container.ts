import { NotificationService } from "./notificationService";
import { NotificationDispatcher } from "./notificationDispatcher";

import { SSEAdapter } from "../notification/delivery/sse/adapter";
import { sseConnectionManager } from "../notification/delivery/sse/container";

import { notificationRepository } from "../notification/persistence/container";

const sseAdapter =
  new SSEAdapter(
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
    notificationRepository,
    notificationDispatcher,
    sseConnectionManager
  );