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
import { protect } from "../Middleware/authMiddleware.js";   // only protect now

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes use protect – no admin-only distinction
router.post("/post", protect, upload.single("media"), createAnonymousPost);
router.get("/my-posts", protect, getMyAnonymousPosts);

// Previously admin-only, now accessible to any logged-in user
router.get("/admin/all", protect, getAllAnonymousPosts);
router.get("/admin/unread-count", protect, getUnreadCount);
router.put("/admin/:id/read", protect, markAsRead);
router.get("/admin/:id/view-poster", protect, viewPoster);
router.post("/admin/:id/share-whatsapp", protect, shareToWhatsApp);
router.post("/admin/:id/share-poster-whatsapp", protect, sharePosterToWhatsApp);
router.delete("/admin/:id", protect, deleteAnonymousPost);

export default router;