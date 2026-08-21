/*
 * Configuración de la aplicación
 *
 * este modulo es el unico punto que lee process.env
 * el resto del codigo impporta  "config" y nunca accede a las variables
 * del entorno directamente
 */
const VALID_NODE_ENV = ["development", "production", "test"];
const DEFAULT_PORT = 3000;
const DEFAULT_JWT_EXPIRES_IN = "1d";
const DEV_ONLY_JWT_SECRET = "default_secret_only_for_development";
/**
 * Resuelve el entorno de ejecucion validando contra los valores permitidos
 * cualquier valor desconocido cae en "development"
 */
function resolveNodeEnv() {
    const raw = process.env.NODE_ENV;
    if (raw && VALID_NODE_ENV.includes(raw)) {
        return raw;
    }
    return "development";
}
const nodeEnv = resolveNodeEnv();
/**
 * Lee una variable de entorno obligatoria.
 *
 * @param key - Nombre de la variable de entorno
 * @returns El valor de la variable
 * @throws {Error} si la variable no está definida o está vacía
 */
function readRequiredEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
export const config = {
    nodeEnv,
    port: Number.parseInt(process.env.PORT ?? "", 10) || DEFAULT_PORT,
    databaseUrl: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
    jwt: {
        // En producción el secreto es obligatorio: si falta, la app se niega a arrancar.
        // El fallback solo es aceptable fuera de producción (dev/test).
        secret: nodeEnv === "production"
            ? readRequiredEnv("JWT_SECRET")
            : (process.env.JWT_SECRET ?? DEV_ONLY_JWT_SECRET),
        expiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_JWT_EXPIRES_IN,
    },
};
//# sourceMappingURL=config.js.map