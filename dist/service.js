"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const app = (0, app_js_1.buildApp)();
const start = async () => {
    try {
        await app.listen({
            port: 8080,
            host: "0.0.0.0",
        });
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};
start();
