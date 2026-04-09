import Admin from "../models/adminModel.js";
import asyncHandler from "express-async-handler";
import adminGenerateToken from "../utils/adminGenerateToken.js";

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Private (Super Admin only)
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if admin already exists
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists with this email");
  }

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
    role: role || "admin",
  });

  if (admin) {
    const token = adminGenerateToken(res, admin._id);
    
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    const token = adminGenerateToken(res, admin._id);
    
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout admin
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("adminJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Admin logged out successfully" });
});

// @desc    Get current admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");
  
  if (admin) {
    res.json(admin);
  } else {
    res.status(404);
    throw new Error("Admin not found");
  }
});

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};