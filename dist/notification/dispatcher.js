"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatcher = void 0;
class NotificationDispatcher {
    deliveries;
    constructor(deliveries) {
        this.deliveries = deliveries;
    }
    async dispatch(notification) {
        const delivery = this.deliveries.get(notification.channel);
        if (!delivery) {
            throw new Error(`Nenhum delivery configurado para o canal: ${notification.channel}`);
        }
        await delivery.deliver(notification);
    }
}
exports.NotificationDispatcher = NotificationDispatcher;
