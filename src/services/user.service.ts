import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { normalizeEmail } from "../utils/email.js";
import type { UserRole } from "../types/jwt.types.js";
import type {
  UpdateProfileInput,
  UpdateUserRoleInput,
  UserResponse,
} from "../types/user.types.js";

const PASSWORD_SALT_ROUNDS = 10;

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

/** Mapea un usuario al tipo de respuesta, garantizando que nunca se exponga el password. */
function toUserResponse(user: {
  id: number;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    createdAt: user.createdAt,
  };
}

function userNotFound(): ApiError {
  return ApiError.notFound("Usuario no encontrado");
}

/**
 * Devuelve el perfil del usuario autenticado (solo puede ver el suyo).
 */
export async function getProfile(userId: number): Promise<UserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
  if (!user) {
    throw userNotFound();
  }
  return toUserResponse(user);
}

/**
 * Actualiza el perfil propio. Cambiar email o password exige confirmar
 * la contrasena actual. Rechaza emails que ya esten en uso por otro usuario.
 */
export async function updateProfile(
  userId: number,
  input: UpdateProfileInput,
): Promise<UserResponse> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw userNotFound();
  }

  const data: {
    name?: string;
    email?: string;
    password?: string;
  } = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  const changingSensitive = input.email !== undefined || input.password !== undefined;
  if (changingSensitive) {
    const currentOk = await bcrypt.compare(input.currentPassword ?? "", user.password);
    if (!currentOk) {
      throw ApiError.badRequest("Contrasena actual incorrecta");
    }
  }

  if (input.email !== undefined) {
    const email = normalizeEmail(input.email);
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken && taken.id !== userId) {
      throw ApiError.conflict("Este email ya esta en uso");
    }
    data.email = email;
  }

  if (input.password !== undefined) {
    data.password = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: USER_SELECT,
  });
  return toUserResponse(updated);
}

/** Lista usuarios (admin). Nunca se filtra password. */
export async function listUsers(role?: UserRole): Promise<UserResponse[]> {
  const users = await prisma.user.findMany({
    where: role ? { role } : {},
    select: USER_SELECT,
    orderBy: { id: "asc" },
  });
  return users.map(toUserResponse);
}

/** Obtiene un usuario por id (admin). */
export async function getUser(id: number): Promise<UserResponse> {
  const user = await prisma.user.findUnique({ where: { id }, select: USER_SELECT });
  if (!user) {
    throw userNotFound();
  }
  return toUserResponse(user);
}

/**
 * Cambia el rol de un usuario (admin).
 * Un admin no puede desescalarse a si mismo para evitar dejar el sistema sin admin.
 */
export async function updateUserRole(
  actorId: number,
  targetId: number,
  input: UpdateUserRoleInput,
): Promise<UserResponse> {
  if (actorId === targetId && input.role !== "admin") {
    throw ApiError.badRequest("No puedes quitar el rol admin a tu propia cuenta");
  }

  const user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) {
    throw userNotFound();
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data: { role: input.role },
    select: USER_SELECT,
  });
  return toUserResponse(updated);
}

/**
 * Elimina un usuario (admin).
 * Un admin no puede eliminar su propia cuenta para evitar dejar el sistema sin admin.
 */
export async function deleteUser(actorId: number, targetId: number): Promise<void> {
  if (actorId === targetId) {
    throw ApiError.badRequest("No puedes eliminar tu propia cuenta");
  }

  const count = await prisma.user.count({ where: { id: targetId } });
  if (count === 0) {
    throw userNotFound();
  }

  await prisma.user.delete({ where: { id: targetId } });
}
