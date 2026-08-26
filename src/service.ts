import { buildApp } from "./app.js";

const app = buildApp();

const start = async () => {
  try {
    console.log("3. Iniciando servidor...");

    await app.listen({port: 9090, host: "0.0.0.0" });

    console.log("4. Servidor iniciado!");
  } catch (error) {
    console.error("ERRO AO INICIAR:", error);
    app.log.error(error);
    process.exit(1);
  }
};

start();