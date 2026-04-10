import express from "express";
import multer from "multer";
import {
  createAnonymousPost,
  getMyAnonymousPosts,
  getAllAnonymousPosts,
  markAsRead,
  viewPoster,
  shareToWhatsApp,
  sharePosterToWhatsApp,
  getUnreadCount,
  deleteAnonymousPost
} from "../controllers/anonymousController.js";
import { protect, adminProtect } from "../Middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// User routes - require protect
router.post("/post", protect, upload.single("media"), createAnonymousPost);
router.get("/my-posts", protect, getMyAnonymousPosts);

// Admin only routes - require adminProtect only
router.get("/admin/all", adminProtect, getAllAnonymousPosts);
router.get("/admin/unread-count", adminProtect, getUnreadCount);
router.put("/admin/:id/read", adminProtect, markAsRead);
router.get("/admin/:id/view-poster", adminProtect, viewPoster);
router.post("/admin/:id/share-whatsapp", adminProtect, shareToWhatsApp);
router.post("/admin/:id/share-poster-whatsapp", adminProtect, sharePosterToWhatsApp);
router.delete("/admin/:id", adminProtect, deleteAnonymousPost);

export default router;