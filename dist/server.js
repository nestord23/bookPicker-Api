import "dotenv/config";
import { createApp } from "./app.js";
import { config } from "./config/config.js";
import { prisma } from "./config/prisma.js";
import { setupSocketServer } from "./ws/index.js";
const app = createApp();
const server = app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port} (${config.nodeEnv})`);
});
const wss = setupSocketServer(server);
/**
 * Cierre ordenado: deja de aceptar requests, cierra conexiones
 * pendientes y desconecta Prisma antes de terminar el proceso.
 */
function shutdown(signal) {
    console.log(`${signal} recibido. Cerrando servidor...`);
    for (const client of wss.clients) {
        client.close();
    }
    server.close(() => {
        void prisma.$disconnect().finally(() => process.exit(0));
    });
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
//# sourceMappingURL=server.js.map