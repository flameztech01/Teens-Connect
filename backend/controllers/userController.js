import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import { generateAndSendOTP, sendOTP } from "../utils/resendOTP.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to upload file to Cloudinary
const uploadFileToCloudinary = async (file, folder, options = {}) => {
  if (!file) return null;
  
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "auto",
      ...options,
    };

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    }).end(file.buffer);
  });
};

// Helper function to get user info from Google access token
const getUserInfoFromAccessToken = async (accessToken) => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user info from Google");
  }

  return response.json();
};

// ============================================
// EMAIL SIGNUP WITH OTP
// ============================================

// @desc    Signup with email and password (send OTP)
// @route   POST /api/users/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { 
    name,
    username,
    email,
    password,
    phone,
  } = req.body;

  // Validate required fields
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Name, email, password, and phone are required");
  }

  // Check if user already exists and is verified
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    // If user exists but email is not verified, allow them to signup again
    if (!existingUser.isEmailVerified) {
      // Update user with new data
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Generate unique username if provided username is taken by another user
      let finalUsername = username;
      if (username && username !== existingUser.username) {
        const usernameTaken = await User.findOne({ 
          username: username,
          _id: { $ne: existingUser._id }
        });
        if (usernameTaken) {
          res.status(400);
          throw new Error("Username is already taken");
        }
        finalUsername = username;
      } else {
        finalUsername = existingUser.username;
      }

      // Update user data
      existingUser.name = name;
      existingUser.username = finalUsername;
      existingUser.password = hashedPassword;
      existingUser.phone = phone;
      existingUser.isVerified = false;
      existingUser.isEmailVerified = false;
      
      // Reset OTP
      await generateAndSendOTP(existingUser);
      await existingUser.save();

      res.status(200).json({
        success: true,
        message: "Account updated. New OTP sent to your email.",
        email: existingUser.email,
        phone: existingUser.phone,
        isResend: true,
      });
      return;
    }

    // If user is already verified, return error
    res.status(400);
    throw new Error("User already exists with this email or username");
  }

  // Generate unique username if not provided
  let finalUsername = username;
  if (!finalUsername) {
    const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
    finalUsername = baseUsername;
    let counter = 1;
    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${baseUsername}${counter++}`;
    }
  } else {
    // Check if username is taken
    const usernameTaken = await User.findOne({ username: finalUsername });
    if (usernameTaken) {
      res.status(400);
      throw new Error("Username is already taken");
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with minimal fields only
  const user = await User.create({
    name,
    username: finalUsername,
    email,
    password: hashedPassword,
    phone,
    isVerified: false,
    isEmailVerified: false,
    authMethod: "email",
    role: "user",
    gender: "prefer-not-to-say",
    bio: "",
    location: "",
    skills: [],
    interests: [],
  });

  // Generate and send OTP using Resend
  await generateAndSendOTP(user);

  res.status(201).json({
    success: true,
    message: "OTP sent to your email. Please verify to complete registration.",
    email: user.email,
    phone: user.phone,
    isResend: false,
  });
});

// @desc    Verify OTP and complete registration
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Log for debugging
  console.log('Verify OTP request:', { email, otp });

  // Validate input
  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  if (otp.length !== 6) {
    res.status(400);
    throw new Error("OTP must be 6 digits");
  }

  // Find user by email - include OTP fields
  const user = await User.findOne({ email }).select('+otp +otpExpires');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if already verified
  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  // Check if OTP exists
  if (!user.otp) {
    res.status(400);
    throw new Error("No OTP found. Please request a new one.");
  }

  // Check if OTP has expired
  if (user.otpExpires < new Date()) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Check if OTP matches
  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Mark user as verified
  user.isVerified = true;
  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Generate JWT token
  const token = generateToken(res, user._id);

  // Get fresh user data without sensitive fields
  const userData = await User.findById(user._id).select('-password -otp -otpExpires');

  res.status(200).json({
    success: true,
    message: "Email verified successfully!",
    _id: userData._id,
    name: userData.name,
    username: userData.username,
    email: userData.email,
    phone: userData.phone,
    profile: userData.profile,
    bio: userData.bio,
    location: userData.location,
    skills: userData.skills,
    interests: userData.interests,
    role: userData.role,
    isVerified: userData.isVerified,
    isEmailVerified: userData.isEmailVerified,
    authMethod: userData.authMethod,
    isProfileComplete: !!(userData.bio || userData.location || userData.skills?.length > 0),
    token,
  });
});

// @desc    Resend OTP
// @route   POST /api/users/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  // Generate and send new OTP using Resend
  await generateAndSendOTP(user);

  res.status(200).json({
    success: true,
    message: "New OTP sent to your email",
  });
});

// @desc    Check if user exists and is verified
// @route   POST /api/users/check-email
// @access  Public
const checkEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    exists: true,
    isVerified: user.isEmailVerified,
    email: user.email,
    name: user.name,
  });
});

// ============================================
// EMAIL LOGIN
// ============================================

// @desc    Login with email and password
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    res.status(401);
    throw new Error("Please verify your email first. Check your inbox for OTP.");
  }

  // Check password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    profile: user.profile,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    interests: user.interests,
    role: user.role,
    isVerified: user.isVerified,
    isEmailVerified: user.isEmailVerified,
    authMethod: user.authMethod,
    token,
  });
});

// ============================================
// FORGOT PASSWORD
// ============================================

// @desc    Request password reset OTP
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  // Generate and send OTP for password reset
  await generateAndSendOTP(user);

  res.status(200).json({
    success: true,
    message: "OTP sent to your email for password reset",
  });
});

// @desc    Reset password with OTP
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error("Email, OTP, and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const user = await User.findOne({ email }).select('+otp +otpExpires');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if OTP has expired
  if (user.otpExpires < new Date()) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Check if OTP matches
  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  // Clear OTP
  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;
  user.isEmailVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully. Please login with your new password.",
  });
});

// ============================================
// GOOGLE AUTH
// ============================================

// @desc    Google Signup with additional info
// @route   POST /api/users/google/signup
// @access  Public
// @desc    Google Signup (one-click, no additional fields)
// @route   POST /api/users/google/signup
// @access  Public
const googleSignup = asyncHandler(async (req, res) => {
  const { token: googleToken } = req.body;

  if (!googleToken) {
    res.status(400);
    throw new Error("Google token is required");
  }

  let googleId = "";
  let email = "";
  let name = "";
  let picture = "";

  // Verify Google token (ID token or access token)
  try {
    // Try as ID token first
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    googleId = payload?.sub || "";
    email = payload?.email || "";
    name = payload?.name || "";
    picture = payload?.picture || "";
  } catch (error) {
    // Fallback: try as access token
    const userInfo = await getUserInfoFromAccessToken(googleToken);
    googleId = userInfo?.sub || `google-${userInfo?.email || Date.now()}`;
    email = userInfo?.email || "";
    name = userInfo?.name || "";
    picture = userInfo?.picture || "";
  }

  if (!email) {
    res.status(400);
    throw new Error("Google account email is required");
  }

  // Check if user already exists with this email or googleId
  const existingUser = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (existingUser) {
    // If user exists, we could either login them in or return error.
    // For signup, we return error to avoid duplication.
    res.status(400);
    throw new Error("Account already exists. Please login instead.");
  }

  // Generate a unique username from email or name
  const baseUsername = (email?.split("@")[0] || name || "user")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_]/g, "") || "user";

  let username = baseUsername;
  let counter = 1;
  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter++}`;
  }

  // Create user with minimal required fields
  const user = await User.create({
    googleId,
    name: name || "",
    username,
    email,
    profile: picture || "",
    profilePicture: picture || "",
    // Set a dummy password (not used for Google auth)
    password: `google-auth-${googleId}`,
    isVerified: true,
    isEmailVerified: true,
    authMethod: "google",
    role: "user",
    // Default values for optional fields
    phone: "",
    bio: "",
    location: "",
    skills: [],
    interests: [],
    gender: "prefer-not-to-say",
    dateOfBirth: null,
    whatsappNumber: "",
    whatsappLink: "",
    portfolioLink: "",
    cv: "",
  });

  // Generate JWT token
  const token = generateToken(res, user._id);

  // Return user data (excluding sensitive fields)
  res.status(201).json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    profile: user.profile,
    cv: user.cv,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    interests: user.interests,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    whatsappNumber: user.whatsappNumber,
    whatsappLink: user.whatsappLink,
    portfolioLink: user.portfolioLink,
    profilePicture: user.profilePicture,
    authMethod: user.authMethod,
    role: user.role,
    isVerified: user.isVerified,
    isEmailVerified: user.isEmailVerified,
    token,
  });
});

// @desc    Google Login
// @route   POST /api/users/google/login
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
  const { token: googleToken } = req.body;

  if (!googleToken) {
    res.status(400);
    throw new Error("Google token is required");
  }

  let googleId = "";
  let email = "";
  let name = "";
  let picture = "";

  // Verify Google token
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    googleId = payload?.sub || "";
    email = payload?.email || "";
    name = payload?.name || "";
    picture = payload?.picture || "";
  } catch (error) {
    const userInfo = await getUserInfoFromAccessToken(googleToken);
    googleId = userInfo?.sub || `google-${userInfo?.email || Date.now()}`;
    email = userInfo?.email || "";
    name = userInfo?.name || "";
    picture = userInfo?.picture || "";
  }

  if (!email) {
    res.status(400);
    throw new Error("Google account email is required");
  }

  // Find existing user
  const user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (!user) {
    res.status(404);
    throw new Error("No account found with this email. Please sign up first.");
  }

  // Update user info if needed
  if (!user.googleId) {
    user.googleId = googleId;
  }
  if (!user.profile && picture) {
    user.profile = picture;
    user.profilePicture = picture;
  }
  if (!user.name && name) {
    user.name = name;
  }

  user.isVerified = true;
  user.isEmailVerified = true;
  user.authMethod = "google";
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    profile: user.profile,
    cv: user.cv,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    interests: user.interests,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    whatsappNumber: user.whatsappNumber,
    whatsappLink: user.whatsappLink,
    portfolioLink: user.portfolioLink,
    profilePicture: user.profilePicture,
    authMethod: user.authMethod,
    role: user.role,
    token,
  });
});

// ============================================
// USER MANAGEMENT
// ============================================

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -otp -otpExpires");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -otp -otpExpires");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};
  
  if (req.query.role) {
    query.role = req.query.role;
  }
  
  if (req.query.authMethod) {
    query.authMethod = req.query.authMethod;
  }
  
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { username: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("-password -otp -otpExpires")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    users,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Handle file uploads
  if (req.files) {
    if (req.files.profilePicture) {
      // Delete old profile picture from Cloudinary if exists
      if (user.profilePicture) {
        const publicId = user.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`user_profiles/${publicId}`);
      }
      
      const profilePictureUrl = await uploadFileToCloudinary(
        req.files.profilePicture[0],
        "user_profiles",
        { transformation: [{ width: 500, height: 500, crop: "limit" }] }
      );
      user.profile = profilePictureUrl;
      user.profilePicture = profilePictureUrl;
    }
    
    if (req.files.cv) {
      // Delete old CV from Cloudinary if exists
      if (user.cv) {
        const publicId = user.cv.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`user_cvs/${publicId}`, { resource_type: "raw" });
      }
      
      const cvUrl = await uploadFileToCloudinary(
        req.files.cv[0],
        "user_cvs",
        { resource_type: "raw" }
      );
      user.cv = cvUrl;
    }
  }

  // Update text fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.username) {
    // Check if username is taken
    const existingUser = await User.findOne({ 
      username: req.body.username,
      _id: { $ne: user._id }
    });
    if (existingUser) {
      res.status(400);
      throw new Error("Username is already taken");
    }
    user.username = req.body.username;
  }
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.bio !== undefined) user.bio = req.body.bio;
  if (req.body.location !== undefined) user.location = req.body.location;
  if (req.body.dateOfBirth) user.dateOfBirth = req.body.dateOfBirth;
  if (req.body.gender) user.gender = req.body.gender;
  if (req.body.whatsappNumber !== undefined) {
    user.whatsappNumber = req.body.whatsappNumber;
    if (req.body.whatsappNumber) {
      const cleanedNumber = req.body.whatsappNumber.replace(/\D/g, '');
      user.whatsappLink = `https://wa.me/${cleanedNumber}`;
    } else {
      user.whatsappLink = "";
    }
  }
  if (req.body.portfolioLink !== undefined) user.portfolioLink = req.body.portfolioLink;
  
  // Parse skills and interests if provided
  if (req.body.skills) {
    if (typeof req.body.skills === 'string') {
      try {
        user.skills = JSON.parse(req.body.skills);
      } catch {
        user.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else {
      user.skills = req.body.skills;
    }
  }
  
  if (req.body.interests) {
    if (typeof req.body.interests === 'string') {
      try {
        user.interests = JSON.parse(req.body.interests);
      } catch {
        user.interests = req.body.interests.split(',').map(i => i.trim()).filter(Boolean);
      }
    } else {
      user.interests = req.body.interests;
    }
  }
  
  // Update password if provided
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    username: updatedUser.username,
    email: updatedUser.email,
    phone: updatedUser.phone,
    profile: updatedUser.profile,
    cv: updatedUser.cv,
    bio: updatedUser.bio,
    location: updatedUser.location,
    skills: updatedUser.skills,
    interests: updatedUser.interests,
    dateOfBirth: updatedUser.dateOfBirth,
    gender: updatedUser.gender,
    whatsappNumber: updatedUser.whatsappNumber,
    whatsappLink: updatedUser.whatsappLink,
    portfolioLink: updatedUser.portfolioLink,
    profilePicture: updatedUser.profilePicture,
    authMethod: updatedUser.authMethod,
    role: updatedUser.role,
    isVerified: updatedUser.isVerified,
    isEmailVerified: updatedUser.isEmailVerified,
  });
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete profile picture from Cloudinary if exists
  if (user.profilePicture) {
    const publicId = user.profilePicture.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`user_profiles/${publicId}`);
  }
  
  // Delete CV from Cloudinary if exists
  if (user.cv) {
    const publicId = user.cv.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`user_cvs/${publicId}`, { resource_type: "raw" });
  }

  await User.deleteOne({ _id: user._id });

  // Clear cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Account deleted successfully" });
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!role) {
    res.status(400);
    throw new Error("Role is required");
  }

  if (!["user", "admin", "super_admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role. Must be user, admin, or super_admin");
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    message: `User role updated to ${role}`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export {
  signup,
  verifyOTP,
  resendOTP,
  checkEmail,
  login,
  forgotPassword,
  resetPassword,
  googleSignup,
  googleLogin,
  getUserById,
  getProfile,
  getUsers,
  updateProfile,
  logout,
  deleteAccount,
  updateUserRole,
};