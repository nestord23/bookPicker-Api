import * as userBookService from "../services/userBook.service.js";
import { ApiError } from "../utils/api-error.js";
import { parseId } from "../utils/route.js";
const VALID_STATUS = ["to_read", "reading", "read"];
/** Devuelve req.user.userId ya que requireAuth garantiza usuario autenticado. */
function requireUserId(req) {
    // requireAuth pobla req.user; si faltara es un error de programacion.
    return req.user.userId;
}
/** Lee el filtro de status del query string o lanza 400 si es invalido. */
function parseStatusQuery(query, next) {
    if (query === undefined)
        return undefined;
    if (typeof query === "string" && VALID_STATUS.includes(query)) {
        return query;
    }
    next(ApiError.badRequest(`status debe ser uno de: ${VALID_STATUS.join(", ")}`));
    return undefined;
}
export async function list(req, res, next) {
    const userId = requireUserId(req);
    const status = parseStatusQuery(req.query.status, next);
    if (status === undefined && req.query.status !== undefined)
        return;
    try {
        const data = await userBookService.listUserBooks(userId, status);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function add(req, res, next) {
    const userId = requireUserId(req);
    try {
        const data = await userBookService.addBookToLibrary(userId, req.body);
        res.status(201).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function getOne(req, res, next) {
    const userId = requireUserId(req);
    const bookId = parseId(req.params.bookId, res);
    if (bookId === null)
        return;
    try {
        const data = await userBookService.getUserBook(userId, bookId);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    const userId = requireUserId(req);
    const bookId = parseId(req.params.bookId, res);
    if (bookId === null)
        return;
    try {
        const data = await userBookService.updateUserBook(userId, bookId, req.body);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    const userId = requireUserId(req);
    const bookId = parseId(req.params.bookId, res);
    if (bookId === null)
        return;
    try {
        await userBookService.deleteUserBook(userId, bookId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=userBook.controller.js.map