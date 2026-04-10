import Notification from "../models/notificationsModel.js";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import asyncHandler from "express-async-handler";
import webPush from "web-push";

// Configure web push (for browser notifications)
webPush.setVapidDetails(
  "mailto:" + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// {
// "subject": "mailto: <curriumxtech@gmail.com>",
// "publicKey": "BA64Yg8WNEqeB1P-8Y15QLSslAnb63zSaMdaujeV7pYl2AjQ6lbPRh7_ZoOE_-PRX97kJo9Aa-OHrNh687IKnn8",
// "privateKey": "a84PdJz0Qb8ZOVbGCCPvFfBzJmFEHaBIY3TG7vyPpVA"
// }

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  const { userId, adminId, title, message, type, relatedId, relatedModel } = req.body;

  let recipientId = null;
  let recipientModel = null;

  if (userId) {
    recipientId = userId;
    recipientModel = "User";
  } else if (adminId) {
    recipientId = adminId;
    recipientModel = "Admin";
  }

  if (!recipientId) {
    res.status(400);
    throw new Error("Recipient ID is required");
  }

  const notification = await Notification.create({
    recipientId,
    recipientModel,
    title,
    message,
    type: type || "info",
    relatedId,
    relatedModel,
  });

  // Send push notification if device subscriptions exist and user has enabled this notification type
  await sendPushNotification(recipientId, recipientModel, notification);

  res.status(201).json(notification);
});

// @desc    Get user's notifications
// @route   GET /api/notifications/user
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {
    recipientId: req.user._id,
    recipientModel: "User",
  };

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

  res.status(200).json({
    notifications,
    page,
    pages: Math.ceil(total / limit),
    total,
    unreadCount,
  });
});

// @desc    Get admin's notifications
// @route   GET /api/notifications/admin
// @access  Private/Admin
const getAdminNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {
    recipientId: req.admin._id,
    recipientModel: "Admin",
  };

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

  res.status(200).json({
    notifications,
    page,
    pages: Math.ceil(total / limit),
    total,
    unreadCount,
  });
});

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
const getNotificationPreferences = asyncHandler(async (req, res) => {
  console.log("=== GET PREFERENCES ===");
  console.log("req.user:", req.user?._id?.toString());
  console.log("req.admin:", req.admin?._id?.toString());

  let recipient;

  if (req.user) {
    recipient = await User.findById(req.user._id).select("notificationPreferences");
  } else if (req.admin) {
    recipient = await Admin.findById(req.admin._id).select("notificationPreferences");
  }

  // Full defaults including digestFrequency
  const defaults = {
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    anonymousPostAlerts: true,
    responseAlerts: true,
    opportunityAlerts: true,
    messageAlerts: true,
    systemAlerts: true,
    digestFrequency: "instant",
  };

  // Get actual preferences from database if they exist
  let actualPrefs = {};
  if (recipient && recipient.notificationPreferences) {
    // Convert Mongoose subdocument to plain object if needed
    actualPrefs = recipient.notificationPreferences.toObject 
      ? recipient.notificationPreferences.toObject() 
      : recipient.notificationPreferences;
  }

  // Merge defaults with actual preferences (actual takes precedence)
  const preferences = {
    ...defaults,
    ...actualPrefs,
  };

  console.log("Returning preferences:", preferences);

  res.status(200).json(preferences);
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
const updateNotificationPreferences = asyncHandler(async (req, res) => {
  console.log("=== UPDATE PREFERENCES ===");
  console.log("req.user:", req.user?._id?.toString());
  console.log("req.admin:", req.admin?._id?.toString());

  const updates = req.body;
  console.log("Request body:", updates);

  let recipientId;
  let Model;

  if (req.user) {
    recipientId = req.user._id;
    Model = User;
  } else if (req.admin) {
    recipientId = req.admin._id;
    Model = Admin;
  } else {
    res.status(401);
    throw new Error("Not authenticated");
  }

  // Build $set object with dot notation
  const setFields = {};
  const allowedFields = [
    "emailNotifications",
    "pushNotifications", 
    "soundEnabled",
    "anonymousPostAlerts",
    "responseAlerts",
    "opportunityAlerts",
    "messageAlerts",
    "systemAlerts",
    "digestFrequency"
  ];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      setFields[`notificationPreferences.${field}`] = updates[field];
    }
  });

  console.log("Setting fields:", setFields);

  if (Object.keys(setFields).length === 0) {
    res.status(400);
    throw new Error("No valid fields to update");
  }

  const updated = await Model.findOneAndUpdate(
    { _id: recipientId },
    { $set: setFields },
    { 
      new: true,
      runValidators: false
    }
  );

  if (!updated) {
    res.status(404);
    throw new Error("User not found");
  }

  console.log("SUCCESS: Preferences updated");

  res.status(200).json({
    message: "Notification preferences updated successfully",
    preferences: updated.notificationPreferences,
  });
});

// @desc    Toggle sound for notifications
// @route   PUT /api/notifications/toggle-sound
// @access  Private
const toggleSound = asyncHandler(async (req, res) => {
  console.log("=== TOGGLE SOUND ===");
  console.log("req.user:", req.user?._id?.toString());
  console.log("req.admin:", req.admin?._id?.toString());

  let recipient;
  let Model;

  if (req.user) {
    recipient = await User.findById(req.user._id);
    Model = User;
  } else if (req.admin) {
    recipient = await Admin.findById(req.admin._id);
    Model = Admin;
  }

  if (!recipient) {
    console.log("ERROR: No recipient found");
    res.status(404);
    throw new Error("User not found");
  }

  console.log("Found recipient:", recipient._id.toString());

  // Get current value (default to true if undefined/null)
  const currentValue = recipient.notificationPreferences?.soundEnabled ?? true;
  const newValue = !currentValue;

  console.log("Toggling soundEnabled from", currentValue, "to", newValue);

  // Use findOneAndUpdate with dot notation - this works reliably with nested schemas
  const updated = await Model.findOneAndUpdate(
    { _id: recipient._id },
    { 
      $set: { 
        "notificationPreferences.soundEnabled": newValue 
      } 
    },
    { 
      new: true,           // Return updated document
      runValidators: false // Skip validation to avoid schema issues
    }
  );

  if (!updated) {
    console.log("ERROR: Update failed");
    res.status(500);
    throw new Error("Failed to update sound preference");
  }

  console.log("SUCCESS: Updated to", updated.notificationPreferences?.soundEnabled);

  res.status(200).json({
    soundEnabled: newValue,
    message: `Sound notifications ${newValue ? "enabled" : "disabled"}`,
  });
});

// @desc    Toggle push notifications
// @route   PUT /api/notifications/toggle-push
// @access  Private
const togglePushNotifications = asyncHandler(async (req, res) => {
  console.log("=== TOGGLE PUSH ===");
  console.log("req.user:", req.user?._id?.toString());
  console.log("req.admin:", req.admin?._id?.toString());

  let recipient;
  let Model;

  if (req.user) {
    recipient = await User.findById(req.user._id);
    Model = User;
  } else if (req.admin) {
    recipient = await Admin.findById(req.admin._id);
    Model = Admin;
  }

  if (!recipient) {
    console.log("ERROR: No recipient found");
    res.status(404);
    throw new Error("User not found");
  }

  console.log("Found recipient:", recipient._id.toString());

  // Get current value
  const currentValue = recipient.notificationPreferences?.pushNotifications ?? true;
  const newValue = !currentValue;

  console.log("Toggling pushNotifications from", currentValue, "to", newValue);

  // Build update
  const updateQuery = { 
    $set: { 
      "notificationPreferences.pushNotifications": newValue 
    } 
  };

  // If disabling push, also clear subscription
  if (!newValue) {
    updateQuery.$set.pushSubscription = null;
  }

  const updated = await Model.findOneAndUpdate(
    { _id: recipient._id },
    updateQuery,
    { 
      new: true,
      runValidators: false
    }
  );

  if (!updated) {
    console.log("ERROR: Update failed");
    res.status(500);
    throw new Error("Failed to update push preference");
  }

  console.log("SUCCESS: Updated to", updated.notificationPreferences?.pushNotifications);

  res.status(200).json({
    pushNotifications: newValue,
    message: `Push notifications ${newValue ? "enabled" : "disabled"}`,
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Check ownership
  const isUser = notification.recipientModel === "User" && notification.recipientId.toString() === req.user?._id?.toString();
  const isAdmin = notification.recipientModel === "Admin" && notification.recipientId.toString() === req.admin?._id?.toString();

  if (!isUser && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized");
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user) {
    query = {
      recipientId: req.user._id,
      recipientModel: "User",
      isRead: false,
    };
  } else if (req.admin) {
    query = {
      recipientId: req.admin._id,
      recipientModel: "Admin",
      isRead: false,
    };
  }

  await Notification.updateMany(query, { isRead: true, readAt: new Date() });

  res.status(200).json({ message: "All notifications marked as read" });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Check ownership
  const isUser = notification.recipientModel === "User" && notification.recipientId.toString() === req.user?._id?.toString();
  const isAdmin = notification.recipientModel === "Admin" && notification.recipientId.toString() === req.admin?._id?.toString();

  if (!isUser && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await notification.deleteOne();
  res.status(200).json({ message: "Notification deleted" });
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications/delete-all
// @access  Private
const deleteAllNotifications = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user) {
    query = {
      recipientId: req.user._id,
      recipientModel: "User",
    };
  } else if (req.admin) {
    query = {
      recipientId: req.admin._id,
      recipientModel: "Admin",
    };
  }

  await Notification.deleteMany(query);

  res.status(200).json({ message: "All notifications deleted" });
});

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
const subscribeToPush = asyncHandler(async (req, res) => {
  console.log("=== SUBSCRIBE TO PUSH ===");
  console.log("Request body:", req.body);
  
  const { subscription, deviceInfo } = req.body;

  if (!subscription) {
    console.log("❌ No subscription in request body");
    res.status(400);
    throw new Error("Subscription object is required");
  }

  // Validate subscription object has required fields
  if (!subscription.endpoint) {
    console.log("❌ Subscription missing endpoint");
    res.status(400);
    throw new Error("Subscription must have an endpoint");
  }

  let recipient;
  let Model;

  if (req.user) {
    recipient = await User.findById(req.user._id);
    Model = User;
    console.log("Found user:", req.user._id);
  } else if (req.admin) {
    recipient = await Admin.findById(req.admin._id);
    Model = Admin;
    console.log("Found admin:", req.admin._id);
  }

  if (!recipient) {
    console.log("❌ Recipient not found");
    res.status(404);
    throw new Error("User/Admin not found");
  }

  console.log("Saving subscription for:", recipient._id.toString());
  console.log("Subscription endpoint:", subscription.endpoint.substring(0, 50) + "...");

  try {
    // Use findByIdAndUpdate instead of save to avoid schema validation issues
    const updated = await Model.findByIdAndUpdate(
      recipient._id,
      {
        $set: {
          pushSubscription: subscription,
          deviceInfo: deviceInfo || navigator?.userAgent || 'Unknown'
        }
      },
      { new: true, runValidators: false }
    );

    if (!updated) {
      console.log("❌ Failed to update");
      res.status(500);
      throw new Error("Failed to save subscription");
    }

    console.log("✅ Subscription saved successfully");
    res.status(200).json({ 
      message: "Subscribed to push notifications",
      success: true,
      endpoint: subscription.endpoint.substring(0, 50) + "..."
    });
  } catch (error) {
    console.error("❌ Error saving subscription:", error);
    res.status(500);
    throw new Error("Failed to save subscription: " + error.message);
  }
});

// @desc    Unsubscribe from push notifications
// @route   POST /api/notifications/unsubscribe
// @access  Private
const unsubscribeFromPush = asyncHandler(async (req, res) => {
  let recipient;

  if (req.user) {
    recipient = await User.findById(req.user._id);
  } else if (req.admin) {
    recipient = await Admin.findById(req.admin._id);
  }

  if (recipient) {
    recipient.pushSubscription = null;
    await recipient.save();
  }

  res.status(200).json({ message: "Unsubscribed from push notifications" });
});

/// @desc    Send push notification helper
const sendPushNotification = async (recipientId, recipientModel, notification) => {
  try {
    console.log(`=== SEND PUSH NOTIFICATION ===`);
    console.log(`Recipient: ${recipientId} (${recipientModel})`);
    console.log(`Notification: ${notification.title}`);

    let recipient;

    if (recipientModel === "User") {
      recipient = await User.findById(recipientId);
    } else if (recipientModel === "Admin") {
      recipient = await Admin.findById(recipientId);
    }

    if (!recipient) {
      console.log("❌ Recipient not found in database");
      return;
    }

    // Check if user has enabled push notifications
    const pushEnabled = recipient.notificationPreferences?.pushNotifications ?? true;
    console.log(`Push enabled: ${pushEnabled}`);
    
    if (!pushEnabled) {
      console.log("❌ Push notifications disabled in preferences");
      return;
    }

    // Check if user has enabled this specific notification type
    let typeEnabled = true;
    switch (notification.type) {
      case "anonymous_post":
      case "anonymous_response":
        typeEnabled = recipient.notificationPreferences?.anonymousPostAlerts ?? true;
        break;
      case "opportunity":
        typeEnabled = recipient.notificationPreferences?.opportunityAlerts ?? true;
        break;
      case "message":
        typeEnabled = recipient.notificationPreferences?.messageAlerts ?? true;
        break;
      case "system":
        typeEnabled = recipient.notificationPreferences?.systemAlerts ?? true;
        break;
      default:
        typeEnabled = true;
    }

    console.log(`Type ${notification.type} enabled: ${typeEnabled}`);
    
    if (!typeEnabled) {
      console.log(`❌ Notification type ${notification.type} disabled`);
      return;
    }

    // CRITICAL CHECK: Does recipient have a push subscription?
    console.log(`Push subscription exists: ${!!recipient.pushSubscription}`);
    
    if (!recipient.pushSubscription) {
      console.log("❌ No push subscription found. Admin needs to enable push notifications in browser.");
      return;
    }

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.message,
      icon: "/logo.png",
      badge: "/logo.png",
      sound: recipient.notificationPreferences?.soundEnabled ? "/notification.mp3" : undefined,
      data: {
        notificationId: notification._id,
        type: notification.type,
        relatedId: notification.relatedId,
        url: getNotificationUrl(notification.type, notification.relatedId, recipientModel),
      },
    });

    console.log("✅ Sending push notification...");
    await webPush.sendNotification(recipient.pushSubscription, payload);
    console.log("✅ Push notification sent successfully!");
    
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
  }
};

// @desc    Helper to get notification URL
const getNotificationUrl = (type, relatedId, recipientModel) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (recipientModel === "Admin") {
    switch (type) {
      case "anonymous_post":
        return `${baseUrl}/admin/anonymous`;
      case "new_user":
        return `${baseUrl}/admin/users`;
      case "report":
        return `${baseUrl}/admin/reports`;
      default:
        return `${baseUrl}/admin/notifications`;
    }
  } else {
    switch (type) {
      case "anonymous_response":
        return `${baseUrl}/dashboard/anonymous`;
      case "opportunity":
        return `${baseUrl}/dashboard/hire`;
      case "message":
        return `${baseUrl}/dashboard/messages`;
      default:
        return `${baseUrl}/dashboard/notifications`;
    }
  }
};

/// @desc    Trigger notification for new anonymous post
// @route   Internal use
const notifyNewAnonymousPost = async (post) => {
  console.log("🔔 notifyNewAnonymousPost CALLED with post:", post._id?.toString());
  
  try {
    // Get all admins (removed isActive filter)
    const admins = await Admin.find({});
    console.log(`📊 Found ${admins.length} admins in database`);

    if (!admins || admins.length === 0) {
      console.log("❌ No admins found - cannot send notifications");
      return { success: false, reason: "no_admins" };
    }

    const results = [];

    for (const admin of admins) {
      try {
        console.log(`\n👤 Processing admin: ${admin.email} (${admin._id})`);
        
        // Check preferences
        const alertsEnabled = admin.notificationPreferences?.anonymousPostAlerts ?? true;
        console.log(`   anonymousPostAlerts: ${alertsEnabled}`);

        if (!alertsEnabled) {
          console.log(`   ⏭️ Skipped - alerts disabled`);
          results.push({ admin: admin._id, status: "skipped", reason: "alerts_disabled" });
          continue;
        }

        // Create notification
        console.log(`   📝 Creating notification...`);
        const notification = await Notification.create({
          recipientId: admin._id,
          recipientModel: "Admin",
          title: "New Anonymous Post",
          message: `A new anonymous post has been submitted for review.`,
          type: "anonymous_post",
          relatedId: post._id,
          relatedModel: "Anonymous",
          isRead: false,
        });

        console.log(`   ✅ Notification created: ${notification._id}`);

        // Try to send push
        try {
          await sendPushNotification(admin._id, "Admin", notification);
          console.log(`   📱 Push notification sent`);
          results.push({ admin: admin._id, status: "success", notificationId: notification._id, push: true });
        } catch (pushErr) {
          console.log(`   ⚠️ Push failed (but notification saved): ${pushErr.message}`);
          results.push({ admin: admin._id, status: "success", notificationId: notification._id, push: false, pushError: pushErr.message });
        }

      } catch (adminError) {
        console.error(`   ❌ Failed for admin ${admin._id}:`, adminError.message);
        results.push({ admin: admin._id, status: "error", error: adminError.message });
      }
    }

    console.log(`\n📊 Results: ${results.filter(r => r.status === "success").length} success, ${results.filter(r => r.status === "error").length} errors, ${results.filter(r => r.status === "skipped").length} skipped`);
    
    return { success: true, results };

  } catch (error) {
    console.error("❌ CRITICAL Error in notifyNewAnonymousPost:", error);
    console.error(error.stack);
    throw error;
  }
};

// @desc    Trigger notification for post response
// @route   Internal use
const notifyPostResponse = async (post, responderId) => {
  const user = await User.findById(post.user);
  
  if (!user) return;
  
  // Check if user has enabled response alerts
  const alertsEnabled = user.notificationPreferences?.responseAlerts ?? true;
  
  if (alertsEnabled) {
    // Create notification directly using Notification model
    const notification = await Notification.create({
      recipientId: post.user,
      recipientModel: "User",
      title: "Someone Responded to Your Post",
      message: `Someone has responded to your anonymous post.`,
      type: "anonymous_response",
      relatedId: post._id,
      relatedModel: "Anonymous",
      isRead: false,
    });
    
    // Send push notification
    await sendPushNotification(post.user, "User", notification);
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  let count = 0;

  if (req.user) {
    count = await Notification.countDocuments({
      recipientId: req.user._id,
      recipientModel: "User",
      isRead: false,
    });
  } else if (req.admin) {
    count = await Notification.countDocuments({
      recipientId: req.admin._id,
      recipientModel: "Admin",
      isRead: false,
    });
  }

  res.status(200).json({ unreadCount: count });
});

export {
  createNotification,
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
  notifyNewAnonymousPost,
  notifyPostResponse,
  sendPushNotification,
};