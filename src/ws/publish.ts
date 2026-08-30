import type { Server } from "http";
import { WebSocketServer, type WebSocket } from "ws";

/** Eventos que el backend emite a los clientes conectados via WebSocket. */
export type CatalogEventType =
  | "AUTHOR_CREATED"
  | "AUTHOR_UPDATED"
  | "AUTHOR_DELETED"
  | "BOOK_CREATED"
  | "BOOK_UPDATED"
  | "BOOK_DELETED";

export interface CatalogEvent<T = unknown> {
  type: CatalogEventType;
  data: T;
}

/**
 * Configura el servidor WebSocket sobre el servidor HTTP existente.
 *
 * SRP: este modulo solo gestiona conexiones WebSocket y la difusion de
 * eventos a los clientes. No conoce nada de Express ni de la logica de negocio.
 */
export function createSocketServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket: WebSocket) => {
    socket.send(JSON.stringify({ type: "CONNECTED" }));
  });

  return wss;
}

/**
 * Difunde un evento de catalogo a todos los clientes conectados.
 *
 * El mensaje se serializa una sola vez y se envia en formato texto a
 * cada socket abierto (readyState === OPEN). Los errores de envio se
 * ignoran: no se debe romper la operacion HTTP por un problema de WS.
 */
export function publishCatalogEvent<T>(
  wss: WebSocketServer | undefined,
  event: CatalogEvent<T>,
): void {
  if (!wss) return;

  const payload = JSON.stringify(event);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}
