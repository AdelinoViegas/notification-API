"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async process(event) {
        // 1. Validar o evento
        this.validate(event);
        // 2. Determinar o receptor
        const receiverId = this.determineReceiver(event);
        // 3. Criar a notificação
        const notification = this.createNotification(event, receiverId);
        // 4. Persistir
        await this.notificationRepository.create(notification);
        // 5. Retornar a notificação criada
        return [notification];
    }
    validate(event) {
        if (!event.type) {
            throw new Error("Domain Event type é obrigatório");
        }
        if (!event.source) {
            throw new Error("Domain Event source é obrigatório");
        }
        if (!event.senderId) {
            throw new Error("Domain Event senderId é obrigatório");
        }
        if (!event.receiverId) {
            throw new Error("Domain Event receiverId é obrigatório");
        }
        if (!event.timestamp) {
            throw new Error("Domain Event timestamp é obrigatório");
        }
    }
    determineReceiver(event) {
        return event.receiverId;
    }
    createNotification(event, receiverId) {
        const now = new Date();
        return {
            id: crypto.randomUUID(),
            type: event.type,
            source: event.source,
            senderId: event.senderId,
            receiverId,
            channel: "sse",
            title: this.buildTitle(event),
            message: this.buildMessage(event),
            data: event.data,
            status: "PENDING",
            read: false,
            createdAt: now,
            updatedAt: now,
        };
    }
    buildTitle(event) {
        return `Evento: ${event.type}`;
    }
    buildMessage(event) {
        return `Novo evento recebido: ${event.type}`;
    }
}
exports.NotificationService = NotificationService;
