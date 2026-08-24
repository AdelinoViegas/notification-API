"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.notificationDispatcher = void 0;
const dispatcher_1 = require("./dispatcher");
const adapter_1 = require("./delivery/sse/adapter");
const container_1 = require("./delivery/sse/container");
const service_1 = require("./service");
const container_2 = require("./persistence/container");
const sseAdapter = new adapter_1.SSEAdapter(container_1.sseConnectionManager);
exports.notificationDispatcher = new dispatcher_1.NotificationDispatcher(new Map([
    ["sse", sseAdapter],
]));
exports.notificationService = new service_1.NotificationService(container_2.notificationRepository);
