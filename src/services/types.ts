/**
 * Tipos de eventos que podem originar uma notificação.
 * Podemos adicionar novos tipos à medida que o sistema crescer.
 */
export type NotificationType =
  | "APPOINTMENT_CREATED"
  | "APPOINTMENT_CANCELLED"
  | "PATIENT_CREATED"
  | "EXAM_RESULT_AVAILABLE"
  | "SYSTEM";

/**
 * Canais através dos quais uma notificação pode ser entregue.
 *
 * Neste momento temos apenas SSE.
 * Futuramente poderemos adicionar:
 * - email
 * - sms
 * - push
 */
export type NotificationChannel = "sse";

/**
 * Evento recebido pela Notification API
 * a partir de outro serviço do sistema.
 */
export interface DomainEvent {
  type: NotificationType;
  source: string;
  senderId: string;
  receiverId: string;
  message?: string;
  title?: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Notificação criada pelo NotificationService.
 *
 * Esta é a entidade persistida no SQLite.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  source: string;
  senderId: string;
  receiverId: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: Record<string, unknown>;

  /**
   * Estado da entrega da notificação.
   *
   * PENDING -> ainda não entregue
   * SENT    -> entregue ao cliente
   * FAILED  -> tentativa de entrega falhou
   */
  status: "PENDING" | "SENT" | "FAILED";

  /**
   * Indica se o receptor já leu a notificação.
   */
  read: boolean;

  /**
   * Momento em que o receptor leu a notificação.
   */
  readAt?: Date;

  /**
   * Momento em que o evento original aconteceu.
   *
   * É diferente de createdAt:
   *
   * timestamp -> momento do evento de origem
   * createdAt -> momento em que a API persistiu a notificação
   */
  timestamp: string;

  /**
   * Momento em que a API persistiu a notificação.
   */
  createdAt: Date;

  /**
   * Momento da última alteração da notificação.
   */
  updatedAt: Date;

  /**
   * Momento em que a notificação foi efetivamente
   * entregue através do canal de entrega.
   *
   * undefined enquanto a notificação estiver PENDING
   * ou se nunca tiver sido entregue.
   */
  deliveredAt?: Date;
}

/**
 * Evento utilizado pelo Dispatcher
 * para entregar a notificação através de um canal.
 *
 * Neste momento o Dispatcher utiliza SSE.
 */
export interface NotificationEvent {
  id: string;
  type: NotificationType;
  source: string;
  senderId: string;
  receiverId: string;
  channel: NotificationChannel;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  timestamp: string;
}

/**
 * Contrato que qualquer mecanismo de entrega
 * deve implementar.
 *
 * SSEAdapter implementará esta interface.
 *
 * Futuramente poderemos ter:
 *
 * EmailAdapter
 * SmsAdapter
 * PushAdapter
 */

export interface NotificationDelivery {
  deliver(
    notification: NotificationEvent
  ): Promise<void>;
}

export interface NotificationConnection {
  send(data: string): Promise<void>;

  close(): void;
}