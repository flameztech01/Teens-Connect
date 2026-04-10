// utils/notificationPreferencesSchema.js
export const notificationPreferencesSchema = {
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  pushNotifications: {
    type: Boolean,
    default: true,
  },
  soundEnabled: {
    type: Boolean,
    default: true,
  },
  anonymousPostAlerts: {
    type: Boolean,
    default: true,
  },
  responseAlerts: {
    type: Boolean,
    default: true,
  },
  opportunityAlerts: {
    type: Boolean,
    default: true,
  },
  messageAlerts: {
    type: Boolean,
    default: true,
  },
  systemAlerts: {
    type: Boolean,
    default: true,
  },
  digestFrequency: {
    type: String,
    enum: ["instant", "daily", "weekly"],
    default: "instant",
  },
};