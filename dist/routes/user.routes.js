import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validateUpdateProfile, validateUpdateRole, } from "../validators/user.validator.js";
const router = Router();
// Perfil propio (cualquier usuario autenticado, solo sobre si mismo).
// Debe ir antes de /:id para no capturar "me" como id.
router.get("/me", requireAuth, userController.getProfile);
router.patch("/me", requireAuth, validateUpdateProfile, userController.updateProfile);
// Administracion de usuarios (solo admin).
router.get("/", requireAuth, requireRole("admin"), userController.list);
router.get("/:id", requireAuth, requireRole("admin"), userController.getOne);
router.patch("/:id/role", requireAuth, requireRole("admin"), validateUpdateRole, userController.updateRole);
router.delete("/:id", requireAuth, requireRole("admin"), userController.remove);
export default router;
//# sourceMappingURL=user.routes.js.map