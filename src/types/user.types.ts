import type { UserRole } from "./jwt.types.js";

/** Entrada para actualizar el perfil propio (name, email, password). */
export interface UpdateProfileInput {
  name?: string;
  email?: string;
  password?: string;
  /** Contrasena actual, requerida para cambios sensibles (email/password). */
  currentPassword?: string;
}

/** Entrada para que un admin cambie el rol de un usuario. */
export interface UpdateUserRoleInput {
  role: UserRole;
}

/** Usuario devuelto por la API. Nunca incluye password. */
export interface UserResponse {
  id: number;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
}
