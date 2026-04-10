import express from "express";
import {
  getUserNotifications,
  getAdminNotifications,
  getNotificationPreferences,
  updateNotificationPreferences,
  toggleSound,
  togglePushNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  subscribeToPush,
  unsubscribeFromPush,
  getUnreadCount,
} from "../controllers/notificationsController.js";
import { protect, adminProtect, unifiedProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User notification routes (user only)
router.get("/user", protect, getUserNotifications);
router.get("/user/unread-count", protect, getUnreadCount);
router.put("/user/read-all", protect, markAllAsRead);
router.delete("/user/delete-all", protect, deleteAllNotifications);

// Admin notification routes (admin only)
router.get("/admin", adminProtect, getAdminNotifications);
router.get("/admin/unread-count", adminProtect, getUnreadCount);
router.put("/admin/read-all", adminProtect, markAllAsRead);
router.delete("/admin/delete-all", adminProtect, deleteAllNotifications);

// Notification preferences (BOTH users and admins)
router.get("/preferences", unifiedProtect, getNotificationPreferences);
router.put("/preferences", unifiedProtect, updateNotificationPreferences);
router.put("/toggle-sound", unifiedProtect, toggleSound);
router.put("/toggle-push", unifiedProtect, togglePushNotifications);

// Push subscription (BOTH users and admins)
router.post("/subscribe", unifiedProtect, subscribeToPush);
router.post("/unsubscribe", unifiedProtect, unsubscribeFromPush);

// Common routes (BOTH users and admins)
router.put("/:id/read", unifiedProtect, markAsRead);
router.delete("/:id", unifiedProtect, deleteNotification);

export default router;