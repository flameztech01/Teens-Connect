import express from "express";
import {
  getTalents,
  getTalentById,
  getTalentsBySkill,
  getFeaturedTalents,
  generateWhatsAppMessage,
  getTalentContact,
  searchTalents,
  getHireStats
} from "../controllers/hireController.js";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// User protected routes
router.get("/talents", protect, getTalents);
router.get("/talents/featured", protect, getFeaturedTalents);
router.get("/talents/skill/:skill", protect, getTalentsBySkill);
router.get("/talent/:id", protect, getTalentById);
router.get("/talent/:id/contact", protect, getTalentContact);
router.post("/message", protect, generateWhatsAppMessage);
router.post("/talents/search", protect, searchTalents);

// Admin route - use adminProtect only
router.get("/stats", adminProtect, getHireStats);


export default router;