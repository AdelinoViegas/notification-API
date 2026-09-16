import { SSEConnectionManager } from "./delivery/sse/manager.js";
import { NotificationService } from "../services/notificationService.js";
import { NotificationDispatcher } from "../notification/notificationDispatcher.js";
import { SSEAdapter } from "../notification/delivery/sse/adapter.js";
import { prisma } from "../lib/prisma.js";

export const sseConnectionManager = new SSEConnectionManager();
const sseAdapter = new SSEAdapter(sseConnectionManager);

export const notificationDispatcher =
  new NotificationDispatcher(
    new Map([
      ["sse", sseAdapter],
    ])
  );

export const notificationService =
  new NotificationService({
    database: prisma,
    notificationDispatcher,
  });