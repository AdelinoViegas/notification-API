import { NotificationService } from "./notificationService";
import { CreateNotification } from "./createNotification";
import { GetNotification } from "./getNotification";
import { ListNotifications } from "./listNotifications";
import { ListUnreadNotifications } from "./listUnreadNotifications";
import { MarkNotificationAsRead } from "./markNotificationAsRead";
import { DeliverPendingNotifications } from "./deliverPendingNotifications";
import { NotificationDispatcher } from "../notification/notificationDispatcher";
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

export const createNotification =
  new CreateNotification(
    notificationRepository
  );

export const getNotification =
  new GetNotification(
    notificationRepository
  );

export const listNotifications =
  new ListNotifications(
    notificationRepository
  );

export const listUnreadNotifications =
  new ListUnreadNotifications(
    notificationRepository
  );

export const markNotificationAsRead =
  new MarkNotificationAsRead(
    notificationRepository
  );

export const deliverPendingNotifications =
  new DeliverPendingNotifications(
    notificationRepository,
    notificationDispatcher
  );

export const notificationService =
  new NotificationService(
    createNotification,
    getNotification,
    listNotifications,
    listUnreadNotifications,
    markNotificationAsRead,
    deliverPendingNotifications,
  );