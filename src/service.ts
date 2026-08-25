import { buildApp } from "./app.js";

console.log("1. Criando aplicação...");

const app = buildApp();

console.log("2. Aplicação criada...");

const start = async () => {
  try {
    console.log("3. Iniciando servidor...");

    await app.listen({
      port: 8080,
      host: "0.0.0.0",
    });

    console.log("4. Servidor iniciado!");
  } catch (error) {
    console.error("ERRO AO INICIAR:", error);
    app.log.error(error);
    process.exit(1);
  }
};

start();