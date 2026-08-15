import express from "express";
import {
  signup,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  googleSignup,
  googleLogin,
  getUserById,
  getProfile,
  getUsers,
  updateProfile,
  logout,
  deleteAccount,
  updateUserRole,
} from "../controllers/userController.js";
import { protect } from "../Middleware/authMiddleware.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Optional: test connection
cloudinary.api
  .ping()
  .then(() => console.log("✅ Cloudinary connected successfully"))
  .catch((err) => console.error("❌ Cloudinary not connected:", err.message));

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Email/Password Authentication
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth Authentication
router.post(
  "/google/signup",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  googleSignup
);
router.post("/google/login", googleLogin);

// ============================================
// ADMIN ROUTES (Must come before /:id route)
// ============================================
router.get("/", protect, getUsers);
router.put("/:id/role", protect, updateUserRole);

// ============================================
// PRIVATE ROUTES (Authentication required)
// ============================================

// User profile routes
router.get("/profile", protect, getProfile);
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  updateProfile
);

// Account management
router.post("/logout", protect, logout);
router.delete("/account", protect, deleteAccount);

// User by ID (must come AFTER all specific routes)
router.get("/:id", protect, getUserById);

export default router;