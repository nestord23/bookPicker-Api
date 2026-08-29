/**
 * Tipos de compartidos relacionados con la autenticación JWT
 * consumidos por  utils/jwt, middlewares/auth y controllers.
 */

/** roles validos para la aplicacion (coincide con el campo  User.role) */
export type UserRole = "user" | "admin";

/** Contenido firmado dentro de cada token JWT.
 * Debe mantenerse minimo: viaja en cada request del cliente. */
export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}

/**
 * Usuario autenticado adjuntado al Request por auth.middleware.
 *
 * Desacoplado de JwtPayload a proposito (DIP): la logica de negocio
 * depende solo de los campos que realmente usa, no del detalle del token.
 */
export interface AuthUser {
  userId: number;
  role: UserRole;
}