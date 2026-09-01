/**
 * Saca el id numerico del parametro de ruta o responde 400.
 *
 * Shared por todos los controllers para evitar duplicar la validacion de id.
 *
 * @returns El id como numero, o null si respondio 400 al cliente.
 */
export function parseId(id, res) {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number.parseInt(raw ?? "", 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        res.status(400).json({ success: false, message: "Id invalido" });
        return null;
    }
    return parsed;
}
//# sourceMappingURL=route.js.map