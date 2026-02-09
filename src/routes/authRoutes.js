import { Router } from "express";
import { register, login, verifyEmail, resendVerification } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "./schemas.js";

const router = Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify", verifyEmail);
router.post("/resend-verification", resendVerification);
export default router;
