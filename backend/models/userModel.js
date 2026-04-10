import mongoose from "mongoose";
import { notificationPreferencesSchema } from "./notificationsPreferencesSchema.js"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: "",
    },
    cv: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    whatsappNumber: {
      type: String,
    },
    whatsappLink: {
      type: String,
    },
    portfolioLink: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    authMethod: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    // Add to userModel.js and adminModel.js
    notificationPreferences: {
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
    },
    pushSubscription: {
      type: Object,
      default: null,
    },
    deviceInfo: {
      type: Object,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;
