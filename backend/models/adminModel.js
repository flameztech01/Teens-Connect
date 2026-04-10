import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { notificationPreferencesSchema } from "./notificationsPreferencesSchema.js"

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    role: {
      type: String,
      enum: ["admin", "super_admin", "moderator"],
      default: "admin",
    },
    profilePicture: {
      type: String,
      default: "",
    },
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Encrypt password before saving - NO next() needed with async
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return; // Just return early, no next() needed
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // No next() call - Mongoose handles it automatically when promise resolves
});

// Match password method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;