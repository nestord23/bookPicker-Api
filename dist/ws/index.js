import { createSocketServer, publishCatalogEvent, } from "./publish.js";
/**
 * Referencia al servidor WebSocket activo, inicializada en setupSocketServer.
 * Mantiene el patron singleton del proyecto (igual que el cliente Prisma).
 */
let wss;
/**
 * Arranca el WebSocket sobre el servidor HTTP y almacena la referencia.
 * Debe llamarse una unica vez al iniciar la aplicacion (ver server.ts).
 */
export function setupSocketServer(server) {
    wss = createSocketServer(server);
    return wss;
}
/** Emite un evento de catalogo a todos los clientes conectados. */
export function emitCatalogEvent(type, data) {
    const event = { type, data };
    publishCatalogEvent(wss, event);
}
/** Notifica la creacion, actualizacion o eliminacion de un autor. */
export function publishAuthor(type, author) {
    emitCatalogEvent(type, author);
}
/** Notifica la creacion, actualizacion o eliminacion de un libro. */
export function publishBook(type, book) {
    emitCatalogEvent(type, book);
}
//# sourceMappingURL=index.js.map