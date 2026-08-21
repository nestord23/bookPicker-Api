/**
 * Ampliacion de los tipos de express para toda la Aplicacion
 * Gracias a declaration merging, `req.user` existe en cualquier
 *  middleware o controller sin casts ni `any`.
 */

import type { AuthUser } from "./jwt.types.ts";

declare global {
  namespace Express {
    interface Request {
      /** Poblado solo por auth.middleware cuando el token es válido */
      user?: AuthUser;
    }
  }
}
