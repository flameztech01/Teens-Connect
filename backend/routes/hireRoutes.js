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
import { protect } from "../Middleware/authMiddleware.js";   // only protect now

const router = express.Router();

// Public routes (no auth required)
router.get("/talents", getTalents);
router.get("/talents/featured", getFeaturedTalents);
router.get("/talents/skill/:skill", getTalentsBySkill);
router.get("/talent/:id", getTalentById);
router.get("/talent/:id/contact", getTalentContact);
router.post("/message", generateWhatsAppMessage);
router.post("/talents/search", searchTalents);

// Admin stats now requires a valid user token (protect)
router.get("/stats", protect, getHireStats);

export default router;