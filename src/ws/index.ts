import type { Server } from "http";
import type { WebSocketServer } from "ws";
import type { AuthorResponse } from "../types/author.types.js";
import type { BookResponse } from "../types/book.types.js";
import {
  createSocketServer,
  publishCatalogEvent,
  type CatalogEvent,
  type CatalogEventType,
} from "./publish.js";

/**
 * Referencia al servidor WebSocket activo, inicializada en setupSocketServer.
 * Mantiene el patron singleton del proyecto (igual que el cliente Prisma).
 */
let wss: WebSocketServer | undefined;

/**
 * Arranca el WebSocket sobre el servidor HTTP y almacena la referencia.
 * Debe llamarse una unica vez al iniciar la aplicacion (ver server.ts).
 */
export function setupSocketServer(server: Server): WebSocketServer {
  wss = createSocketServer(server);
  return wss;
}

/** Emite un evento de catalogo a todos los clientes conectados. */
export function emitCatalogEvent(type: CatalogEventType, data: unknown): void {
  const event: CatalogEvent = { type, data };
  publishCatalogEvent(wss, event);
}

/** Notifica la creacion, actualizacion o eliminacion de un autor. */
export function publishAuthor(type: "AUTHOR_CREATED" | "AUTHOR_UPDATED" | "AUTHOR_DELETED", author: AuthorResponse | { id: number }): void {
  emitCatalogEvent(type, author);
}

/** Notifica la creacion, actualizacion o eliminacion de un libro. */
export function publishBook(type: "BOOK_CREATED" | "BOOK_UPDATED" | "BOOK_DELETED", book: BookResponse | { id: number }): void {
  emitCatalogEvent(type, book);
}
