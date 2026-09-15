import type {
  DomainEvent,
  Notification,
  NotificationEvent,
  Database,
} from "./types.js";

import { NotificationDispatcher } from "../notification/notificationDispatcher.js";
import BaseService from "./base.service.js";

export class NotificationService extends BaseService {
  #notificationDispatcher: NotificationDispatcher;

  constructor({
    database,
    notificationDispatcher,
  }: {
    database: Database;
    notificationDispatcher: NotificationDispatcher;
  }) {
    super(database);

    this.#notificationDispatcher = notificationDispatcher;
  }

  readonly errors = {
    INVALID_EVENT_TYPE: 1,
    INVALID_EVENT_SOURCE: 2,
    INVALID_SENDER_ID: 3,
    INVALID_RECEIVER_ID: 4,
    INVALID_TIMESTAMP: 5,
    NOTIFICATION_NOT_FOUND: 6,
    UNAUTHORIZED: 7,
    DELIVERY_ERROR: 8,
    UNKNOWN_ERROR: 9,
  } as const;

  /**
   * Cria uma nova notificação.
   *
   * A notificação é persistida inicialmente
   * com status PENDING.
   */
  async create(
    event: DomainEvent
  ): Promise<Notification> {
    this.#validateEvent(event);

    const notification = this.#buildNotification(
      event,
      event.receiverId
    );

    await this.db.notification.create({
      data: {
        id: notification.id,
        type: notification.type,
        source: notification.source,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        channel: notification.channel,
        title: notification.title,
        message: notification.message,
        data: notification.data
          ? JSON.stringify(notification.data)
          : null,
        status: notification.status,
        read: notification.read ? true : false,
        readAt: notification.readAt
          ? notification.readAt.toISOString()
          : null,
        timestamp: notification.timestamp,
        createdAt:
          notification.createdAt.toISOString(),
        updatedAt:
          notification.updatedAt.toISOString(),
        deliveredAt:
          notification.deliveredAt
            ? notification.deliveredAt.toISOString()
            : null,
      },
    });

    return notification;
  }

  /**
   * Cria uma notificação e tenta
   * entregá-la imediatamente.
   *
   * Diferente de deliverPending(), este método
   * entrega especificamente a notificação recém-criada.
   */
  async createAndDeliver(
    event: DomainEvent
  ): Promise<Notification> {
    const notification = await this.create(event);

    await this.#deliver(notification);

    const persistedNotification =
      await this.get(notification.id);

    return persistedNotification ?? notification;
  }

  /**
   * Entrega todas as notificações PENDING
   * de um determinado receiver.
   *
   * É utilizado principalmente na conexão/reconexão
   * do SSE para recuperar notificações que ficaram pendentes.
   */
  async deliverPending(
    receiverId: string
  ): Promise<void> {
    const notifications =
      await this.db.notification.findMany({
        where: {
          receiverId,
          status: "PENDING",
          deliveredAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    for (const notification of notifications) {
      await this.#deliver(
        this.#mapDatabaseNotification(
          notification
        )
      );
    }
  }

  /**
   * Obtém uma notificação pelo ID.
   */
  async get(
    id: string
  ): Promise<Notification | null> {
    const notification =
      await this.db.notification.findUnique({
        where: {
          id,
        },
      });

    if (!notification) {
      return null;
    }

    return this.#mapDatabaseNotification(
      notification
    );
  }

  /**
   * Lista todas as notificações
   * de um receiver.
   */
  async list(
    receiverId: string
  ): Promise<Notification[]> {
    const notifications =
      await this.db.notification.findMany({
        where: {
          receiverId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return notifications.map(
      (notification) =>
        this.#mapDatabaseNotification(
          notification
        )
    );
  }

  /**
   * Lista apenas as notificações
   * não lidas de um receiver.
   */
  async listUnread(
    receiverId: string
  ): Promise<Notification[]> {
    const notifications =
      await this.db.notification.findMany({
        where: {
          receiverId,
          read: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return notifications.map(
      (notification) =>
        this.#mapDatabaseNotification(
          notification
        )
    );
  }

  /**
   * Marca uma notificação como lida.
   */
  async markAsRead(
    notificationId: string
  ): Promise<Notification | null> {
    const notification =
      await this.db.notification.findUnique({
        where: {
          id: notificationId,
        },
      });

    if (!notification) {
      return null;
    }

    if (notification.read === true) {
      return this.#mapDatabaseNotification(
        notification
      );
    }

    const now = new Date().toISOString();

    const updated =
      await this.db.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          read: true,
          readAt: now,
          updatedAt: now,
        },
      });

    return this.#mapDatabaseNotification(
      updated
    );
  }

  /**
   * Valida o evento recebido antes
   * de criar a notificação.
   */
  #validateEvent(
    event: DomainEvent
  ): void {
    if (!event.type) {
      throw new Error(
        "Domain Event type é obrigatório"
      );
    }

    if (!event.source) {
      throw new Error(
        "Domain Event source é obrigatório"
      );
    }

    if (!event.senderId) {
      throw new Error(
        "Domain Event senderId é obrigatório"
      );
    }

    if (!event.receiverId) {
      throw new Error(
        "Domain Event receiverId é obrigatório"
      );
    }

    if (!event.timestamp) {
      throw new Error(
        "Domain Event timestamp é obrigatório"
      );
    }
  }

  /**
   * Constrói a entidade Notification
   * a partir do DomainEvent.
   */
  #buildNotification(
    event: DomainEvent,
    receiverId: string
  ): Notification {
    const now = new Date();

    return {
      id: crypto.randomUUID(),
      type: event.type,
      source: event.source,
      senderId: event.senderId,
      receiverId,
      channel: "sse",
      title:
        event.title ??
        this.#buildTitle(event),
      message:
        event.message ??
        this.#buildMessage(event),
      data: event.data,
      status: "PENDING",
      read: false,
      createdAt: now,
      updatedAt: now,
      timestamp: event.timestamp,
      deliveredAt: undefined,
    };
  }

  /**
   * Faz a entrega de uma única
   * notificação.
   */
  async #deliver(
    notification: Notification
  ): Promise<void> {
    const event: NotificationEvent = {
      id: notification.id,
      type: notification.type,
      source: notification.source,
      senderId: notification.senderId,
      receiverId: notification.receiverId,
      channel: notification.channel,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      read: notification.read,
      timestamp: notification.timestamp,
    };

    try {
      await this.#notificationDispatcher.dispatch(
        event
      );

      await this.db.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          status: "SENT",
          deliveredAt:
            new Date().toISOString(),
          updatedAt:
            new Date().toISOString(),
        },
      });
    } catch (error) {
      console.warn(
        `Notificação ${notification.id} permanece PENDING:`,
        error
      );
    }
  }

  /**
   * Converte o modelo do Prisma
   * para o modelo Notification
   * utilizado pela aplicação.
   */
  #mapDatabaseNotification(
    notification: {
      id: string;
      type: string;
      source: string;
      senderId: string;
      receiverId: string;
      channel: string;
      title: string | null;
      message: string | null;
      data: string | null;
      status: string;
      read: boolean;
      readAt: string | null;
      timestamp: string;
      createdAt: string;
      updatedAt: string;
      deliveredAt: string | null;
    }
  ): Notification {
    return {
      id: notification.id,
      type:
        notification.type as Notification["type"],
      source: notification.source,
      senderId: notification.senderId,
      receiverId: notification.receiverId,
      channel:
        notification.channel as Notification["channel"],
      title: notification.title ?? "",
      message: notification.message ?? "",
      data: notification.data
        ? JSON.parse(notification.data)
        : undefined,
      status:
        notification.status as Notification["status"],
      read: notification.read === true,
      readAt: notification.readAt
        ? new Date(notification.readAt)
        : undefined,
      timestamp: notification.timestamp,
      createdAt:
        new Date(notification.createdAt),
      updatedAt:
        new Date(notification.updatedAt),
      deliveredAt:
        notification.deliveredAt
          ? new Date(
              notification.deliveredAt
            )
          : undefined,
    };
  }

  /**
   * Gera o título padrão
   * da notificação.
   */
  #buildTitle(
    event: DomainEvent
  ): string {
    return `Evento: ${event.type}`;
  }

  /**
   * Gera a mensagem padrão
   * da notificação.
   */
  #buildMessage(
    event: DomainEvent
  ): string {
    return `Novo evento recebido: ${event.type}`;
  }
}