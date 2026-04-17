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
router.get("/talents", getTalents);
router.get("/talents/featured", getFeaturedTalents);
router.get("/talents/skill/:skill", getTalentsBySkill);
router.get("/talent/:id", getTalentById);
router.get("/talent/:id/contact", getTalentContact);
router.post("/message", generateWhatsAppMessage);
router.post("/talents/search", searchTalents);

// Admin route - use adminProtect only
router.get("/stats", adminProtect, getHireStats);


export default router;