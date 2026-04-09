import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import { v2 as cloudinary } from "cloudinary";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// @desc    Google Signup with additional info and file uploads
// @route   POST /api/users/google/signup
// @access  Public
const googleSignup = asyncHandler(async (req, res) => {
  const { 
    token: googleToken, 
    phone, 
    dateOfBirth,
    gender,
    location,
    whatsappNumber,
    portfolioLink,
    skills,
    interests,
    bio
  } = req.body;

  // Handle file uploads
  let profilePictureUrl = "";
  let cvUrl = "";

  if (req.files) {
    if (req.files.profilePicture) {
      profilePictureUrl = await uploadFileToCloudinary(
        req.files.profilePicture[0],
        "user_profiles",
        { transformation: [{ width: 500, height: 500, crop: "limit" }] }
      );
    }
    
    if (req.files.cv) {
      cvUrl = await uploadFileToCloudinary(
        req.files.cv[0],
        "user_cvs",
        { resource_type: "raw" }
      );
    }
  }

  if (!googleToken) {
    res.status(400);
    throw new Error("Google token is required");
  }

  if (!phone) {
    res.status(400);
    throw new Error("Phone number is required");
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

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (existingUser) {
    res.status(400);
    throw new Error("Account already exists. Please login instead.");
  }

  // Generate unique username
  const baseUsername = (email?.split("@")[0] || name || "user")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_]/g, "") || "user";

  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter++}`;
  }

  // Generate WhatsApp link if number provided
  let whatsappLink = "";
  if (whatsappNumber) {
    const cleanedNumber = whatsappNumber.replace(/\D/g, '');
    whatsappLink = `https://wa.me/${cleanedNumber}`;
  }

  // Parse skills and interests if they're JSON strings
  let parsedSkills = skills;
  let parsedInterests = interests;
  
  if (typeof skills === 'string') {
    try {
      parsedSkills = JSON.parse(skills);
    } catch {
      parsedSkills = skills ? skills.split(',').map(s => s.trim()) : [];
    }
  }
  
  if (typeof interests === 'string') {
    try {
      parsedInterests = JSON.parse(interests);
    } catch {
      parsedInterests = interests ? interests.split(',').map(i => i.trim()) : [];
    }
  }

  // Create user with all fields
  const user = await User.create({
    googleId,
    name: name || "",
    username,
    email,
    phone: phone.trim(),
    profile: profilePictureUrl || picture || "",
    cv: cvUrl || "",
    bio: bio || "",
    location: location || "",
    skills: parsedSkills || [],
    interests: parsedInterests || [],
    dateOfBirth: dateOfBirth || null,
    gender: gender || "",
    whatsappNumber: whatsappNumber || "",
    whatsappLink: whatsappLink,
    portfolioLink: portfolioLink || "",
    profilePicture: profilePictureUrl || picture || "",
    password: `google-auth-${googleId}`,
    isVerified: true,
    authMethod: "google",
  });

  const token = generateToken(res, user._id);

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
    token,
  });
});

// @desc    Google Login only
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
  user.authMethod = "google";
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
    token,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

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
    .select("-password")
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

// @desc    Update user profile with file uploads
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
  user.name = req.body.name || user.name;
  user.username = req.body.username || user.username;
  user.phone = req.body.phone || user.phone;
  user.bio = req.body.bio || user.bio;
  user.location = req.body.location || user.location;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  user.gender = req.body.gender || user.gender;
  user.whatsappNumber = req.body.whatsappNumber || user.whatsappNumber;
  user.portfolioLink = req.body.portfolioLink || user.portfolioLink;
  
  // Parse skills and interests if provided
  if (req.body.skills) {
    if (typeof req.body.skills === 'string') {
      try {
        user.skills = JSON.parse(req.body.skills);
      } catch {
        user.skills = req.body.skills.split(',').map(s => s.trim());
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
        user.interests = req.body.interests.split(',').map(i => i.trim());
      }
    } else {
      user.interests = req.body.interests;
    }
  }
  
  // Update WhatsApp link if number changed
  if (req.body.whatsappNumber && req.body.whatsappNumber !== user.whatsappNumber) {
    const cleanedNumber = req.body.whatsappNumber.replace(/\D/g, '');
    user.whatsappLink = `https://wa.me/${cleanedNumber}`;
  }
  
  // Update password if provided
  if (req.body.password) {
    user.password = req.body.password;
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

export {
  googleSignup,
  googleLogin,
  getUserById,
  getUsers,
  updateProfile,
  logout,
  deleteAccount,
};