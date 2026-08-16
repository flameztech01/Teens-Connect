import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
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
      maxlength: 500,
    },
    location: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },
    whatsappNumber: {
      type: String,
      trim: true,
    },
    whatsappLink: {
      type: String,
    },
    portfolioLink: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "",
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
    isEmailVerified: {
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
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    // OTP fields for email verification & password reset
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    // Notification preferences
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
      endpoint: {
        type: String,
        default: null,
      },
      keys: {
        p256dh: {
          type: String,
          default: null,
        },
        auth: {
          type: String,
          default: null,
        },
      },
    },
    deviceInfo: {
      type: Object,
      default: null,
    },
    lastLogin: {
      type: Date,
    },
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isEmailVerified: 1 });
userSchema.index({ createdAt: -1 });

// Method to check if OTP is expired
userSchema.methods.isOTPExpired = function() {
  return this.otpExpires < new Date();
};

// Method to clear OTP
userSchema.methods.clearOTP = function() {
  this.otp = undefined;
  this.otpExpires = undefined;
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.otp;
  delete userObject.otpExpires;
  delete userObject.pushSubscription;
  delete userObject.deviceInfo;
  return userObject;
};

const User = mongoose.model("User", userSchema);
export default User;