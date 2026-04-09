import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} from "../controllers/adminController.js";
import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginAdmin);

// Protected routes
router.post("/register", registerAdmin); // Only super admin can register new admins
router.post("/logout", adminProtect, logoutAdmin);
router.get("/profile", adminProtect, getAdminProfile);

export default router;