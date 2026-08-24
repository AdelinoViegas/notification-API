// src/types.ts

/**
 * Tipos de eventos que podem originar uma notificação.
 *
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
 *
 * Exemplo:
 *
 * {
 *   type: "APPOINTMENT_CREATED",
 *   source: "appointment-service",
 *   senderId: "doctor-123",
 *   receiverId: "nurse-456",
 *   data: {
 *     patientId: "patient-789",
 *     appointmentId: "appointment-001"
 *   },
 *   timestamp: "2026-08-24T10:00:00.000Z"
 * }
 */
export interface DomainEvent {
  type: NotificationType;
  /**
   * Serviço que originou o evento.
   *
   * Exemplo:
   * "appointment-service"
   */
  source: string;

  /**
   * Utilizador que originou a ação.
   */
  senderId: string;

  /**
   * Utilizador que deve receber a notificação.
   */
  receiverId: string;

  /**
   * Dados específicos do evento.
   *
   * Exemplo:
   * {
   *   patientId: "patient-123"
   * }
   */
  data: Record<string, unknown>;

  /**
   * Momento em que o evento ocorreu.
   */
  timestamp: string;
}


/**
 * Notificação criada pelo NotificationService.
 *
 * Esta é a entidade que será persistida
 * no PostgreSQL.
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
  status: "PENDING" | "SENT" | "FAILED";
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}


/**
 * Evento de notificação utilizado pelo Dispatcher
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


/**
 * Representa uma conexão SSE ativa.
 */
export interface SSEConnection {

  /**
   * Envia dados para o cliente conectado.
   */
  send(data: string): Promise<void>;

  /**
   * Fecha a conexão.
   */
  close(): void;
}