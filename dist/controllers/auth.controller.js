import { register as registerUser, login as loginUser } from "../services/auth.service.js";
/**
 * Registra un nuevo usuario y responde con su sesion.
 */
export async function register(req, res, next) {
    try {
        const session = await registerUser(req.body);
        res.status(201).json({ success: true, data: session });
    }
    catch (err) {
        next(err);
    }
}
/**
 * Inicia sesion con credenciales y responde con una sesion nueva.
 */
export async function login(req, res, next) {
    try {
        const session = await loginUser(req.body);
        res.status(200).json({ success: true, data: session });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map