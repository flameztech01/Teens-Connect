import express from "express";
import {
  googleSignup,
  googleLogin,
  getUserById,
  getUsers,
  updateProfile,
  logout,
  deleteAccount,
} from "../controllers/userController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Storage for Profile Pictures
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Storage for CV/Resume files
const cvStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_cvs",
    allowed_formats: ["pdf", "doc", "docx"],
    resource_type: "raw", // For non-image files like PDFs
  },
});

// Configure multer for multiple file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for better control
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
  },
});

// Custom upload handlers
const uploadToCloudinary = async (file, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "auto",
      ...options,
    };

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(file.buffer);
  });
};

// Optional: test connection
cloudinary.api
  .ping()
  .then(() => console.log("✅ Cloudinary connected successfully"))
  .catch((err) => console.error("❌ Cloudinary not connected:", err.message));

// Public routes
router.post("/google/signup", 
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cv", maxCount: 1 }
  ]),
  googleSignup
);

router.post("/google/login", googleLogin);
router.get("/:id", getUserById);

// Private routes
router.put("/profile", 
  protect, 
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "cv", maxCount: 1 }
  ]),
  updateProfile
);
router.get("/:id", protect, getUserById);
router.post("/logout", protect, logout);
router.delete("/account", protect, deleteAccount);

// Admin routes
router.get("/", adminProtect, getUsers);


export default router;