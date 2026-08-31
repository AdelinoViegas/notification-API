import { buildApp } from "./app.js";

const start = async () => {
  try {
    console.log("3. Iniciando servidor...");

    const app = await buildApp();

    await app.listen({
      port: 9090,
      host: "0.0.0.0",
    });

    console.log("4. Servidor iniciado!");
  } catch (error) {
    console.error("ERRO AO INICIAR:", error);
    process.exit(1);
  }
};

start();