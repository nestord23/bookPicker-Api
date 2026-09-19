import { Router } from "express";
import * as tagController from "../controllers/tag.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validateTag } from "../validators/tag.validator.js";

const router = Router();

router.get("/", requireAuth, tagController.list);
router.get("/:id", requireAuth, tagController.getOne);
router.post("/", requireAuth, validateTag, tagController.create);
router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validateTag,
  tagController.update,
);
router.delete("/:id", requireAuth, requireRole("admin"), tagController.remove);

export default router;
