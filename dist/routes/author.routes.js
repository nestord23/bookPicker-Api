import { Router } from "express";
import * as authorController from "../controllers/author.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validateAuthor } from "../validators/author.validator.js";
const router = Router();
router.get("/", requireAuth, authorController.list);
router.get("/:id", requireAuth, authorController.getOne);
router.post("/", requireAuth, requireRole("admin"), validateAuthor, authorController.create);
router.put("/:id", requireAuth, requireRole("admin"), validateAuthor, authorController.update);
router.delete("/:id", requireAuth, requireRole("admin"), authorController.remove);
export default router;
//# sourceMappingURL=author.routes.js.map