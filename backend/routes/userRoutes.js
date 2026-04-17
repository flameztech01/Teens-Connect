import express from "express";
import {
  googleSignup,
  googleLogin,
  getUserById,
  getUsers,
  updateProfile,
  logout,
  deleteAccount,
} from "../controllers/userController.js";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

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

// ============= IMPORTANT: ORDER MATTERS =============
// Put more specific routes BEFORE parameter routes

// Admin routes (must come before the /:id route)
router.get("/", getUsers);

// Public routes
router.post("/google/signup", 
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cv", maxCount: 1 }
  ]),
  googleSignup
);

router.post("/google/login", googleLogin);

// Private routes with ID parameter (must come AFTER specific routes)
router.get("/:id", protect, getUserById);
router.put("/profile", 
  protect, 
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cv", maxCount: 1 }
  ]),
  updateProfile
);
router.post("/logout", protect, logout);
router.delete("/account", protect, deleteAccount);

export default router;