import { SSEConnectionManager } from "./sseConnectionManager";
import { NotificationService } from "../notificationService";
import { NotificationDispatcher } from "./notificationDispatcher";
import { SSEAdapter } from "./sseAdapter";
import { prisma } from "../../lib/prisma";

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