import * as userService from "../services/user.service.js";
import { ApiError } from "../utils/api-error.js";
import { parseId } from "../utils/route.js";
const VALID_ROLES = ["user", "admin"];
/** Devuelve req.user.userId ya que requireAuth garantiza usuario autenticado. */
function requireUserId(req) {
    return req.user.userId;
}
/** Lee el filtro de rol del query string o lanza 400 si es invalido. */
function parseRoleQuery(query, next) {
    if (query === undefined)
        return undefined;
    if (typeof query === "string" && VALID_ROLES.includes(query)) {
        return query;
    }
    next(ApiError.badRequest(`role debe ser uno de: ${VALID_ROLES.join(", ")}`));
    return undefined;
}
export async function getProfile(req, res, next) {
    const userId = requireUserId(req);
    try {
        const data = await userService.getProfile(userId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function updateProfile(req, res, next) {
    const userId = requireUserId(req);
    try {
        const data = await userService.updateProfile(userId, req.body);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function list(req, res, next) {
    const role = parseRoleQuery(req.query.role, next);
    if (role === undefined && req.query.role !== undefined)
        return;
    try {
        const data = await userService.listUsers(role);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function getOne(req, res, next) {
    const id = parseId(req.params.id, res);
    if (id === null)
        return;
    try {
        const data = await userService.getUser(id);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function updateRole(req, res, next) {
    const actorId = requireUserId(req);
    const targetId = parseId(req.params.id, res);
    if (targetId === null)
        return;
    try {
        const data = await userService.updateUserRole(actorId, targetId, req.body);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    const actorId = requireUserId(req);
    const targetId = parseId(req.params.id, res);
    if (targetId === null)
        return;
    try {
        await userService.deleteUser(actorId, targetId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=user.controller.js.map