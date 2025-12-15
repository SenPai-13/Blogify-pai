import express from "express";
import { getMe, login, signup } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/signup", signup);

router.get("/me", protect, getMe);

export default router;
