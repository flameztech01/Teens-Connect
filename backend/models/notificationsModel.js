import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel",
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "info",
        "warning",
        "success",
        "error",
        "anonymous_post",
        "anonymous_response",
        "new_user",
        "opportunity",
        "message",
        "report",
        "system",
      ],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
      default: null,
    },
    relatedModel: {
      type: String,
      enum: ["Anonymous", "User", "Opportunity", "Message", "Report"],
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
notificationSchema.index({ recipientId: 1, recipientModel: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual("timeAgo").get(function () {
  const seconds = Math.floor((new Date() - this.createdAt) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
});

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = function (recipientId, recipientModel) {
  return this.countDocuments({
    recipientId,
    recipientModel,
    isRead: false,
  });
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = function (recipientId, recipientModel) {
  return this.updateMany(
    {
      recipientId,
      recipientModel,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

// Static method to delete old notifications
notificationSchema.statics.deleteOldNotifications = function (days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true,
  });
};

// REMOVED: Pre-save middleware that was causing "next is not a function" error
// The expiresAt field will be set by default in schema instead

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;