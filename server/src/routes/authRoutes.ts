import express from "express";
import { getMe, login, sendOtp, verifyOtp } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.get("/me", protect, getMe);

export default router;
