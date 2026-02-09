import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/rbacMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
	getProfile,
	updateProfile,
	getAllUsers,
	getUserById,
	updateUserRole,
	deleteUser,
} from "../controllers/userController.js";
import { updateProfileSchema, updateRoleSchema } from "./schemas.js";

const router = Router();
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, validate(updateProfileSchema), updateProfile);

// Admin only routes
router.get("/", requireAuth, requireRole("admin"), getAllUsers);
router.get("/:id", requireAuth, requireRole("admin"), getUserById);
router.put("/:id/role", requireAuth, requireRole("admin"), validate(updateRoleSchema), updateUserRole);
router.delete("/:id", requireAuth, requireRole("admin"), deleteUser);

export default router;
