/**
 * Tipos de compartidos relacionados con la autenticación JWT
 * consumidos por  utils/jwt, middlewares/auth y controllers.
 */

/** roles validos para la aplicacion (coincide con el campo  User.role) */
export type UserRole = "user" | "admin";
/** contenido firmado dentro de cada token  jwt
 * Debe de mantenerse minimo viaja en cada request del cliente
 */

export interface JwtPayload {
  userId: number;
  emai: string;
  role: UserRole;
}

/**
 * Usuario autenticado adjuntado al Request por auth.middleware.
 * Alias semántico para no acoplar las capas al detalle del token.
 */
export type AuthUser = JwtPayload;