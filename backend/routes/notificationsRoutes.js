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
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// User notification routes (now any authenticated user)
router.get("/user", protect, getUserNotifications);
router.get("/user/unread-count", protect, getUnreadCount);
router.put("/user/read-all", protect, markAllAsRead);
router.delete("/user/delete-all", protect, deleteAllNotifications);

// Admin notification routes (now any authenticated user)
router.get("/admin", protect, getAdminNotifications);
router.get("/admin/unread-count", protect, getUnreadCount);
router.put("/admin/read-all", protect, markAllAsRead);
router.delete("/admin/delete-all", protect, deleteAllNotifications);

// Notification preferences (any authenticated user)
router.get("/preferences", protect, getNotificationPreferences);
router.put("/preferences", protect, updateNotificationPreferences);
router.put("/toggle-sound", protect, toggleSound);
router.put("/toggle-push", protect, togglePushNotifications);

// Push subscription (any authenticated user)
router.post("/subscribe", protect, subscribeToPush);
router.post("/unsubscribe", protect, unsubscribeFromPush);

// Common routes (any authenticated user)
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;