import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { signToken } from "../utils/jwt.js";
import type { UserRole } from "../types/jwt.types.js";

const PASSWORD_SALT_ROUNDS = 10;

interface RegisterInput {
  name?: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthSession {
  token: string;
  user: {
    id: number;
    name: string | null;
    email: string;
    role: UserRole;
  };
}

/** Normaliza el email a minusculas para evitar duplicados por caso. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Registra un nuevo usuario y devuelve su sesion (token + datos).
 * Rechaza emails ya existentes para preservar la unicidad de cuenta.
 */
export async function register(input: RegisterInput): Promise<AuthSession> {
  const email = normalizeEmail(input.email);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("Ya existe una cuenta con este email");
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      password: passwordHash,
    },
  });

  return buildSession(user.id, user.name, user.email, user.role as UserRole);
}

/**
 * Autentica credenciales y devuelve una sesion nueva.
 * Usa el mismo mensaje para credenciales invalidas (no filtra que campo fallo).
 */
export async function login(input: LoginInput): Promise<AuthSession> {
  const email = normalizeEmail(input.email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Credenciales invalidas");
  }

  const passwordOk = await bcrypt.compare(input.password, user.password);
  if (!passwordOk) {
    throw ApiError.unauthorized("Credenciales invalidas");
  }

  return buildSession(user.id, user.name, user.email, user.role as UserRole);
}

/** Construye la sesion firmando el token y devolviendo los datos del usuario. */
function buildSession(
  id: number,
  name: string | null,
  email: string,
  role: UserRole,
): AuthSession {
  const token = signToken({ userId: id, email, role });
  return { token, user: { id, name, email, role } };
}
