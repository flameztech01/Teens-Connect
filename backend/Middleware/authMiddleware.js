import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

const getToken = (req, cookieName) => {
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }
  return null;
};

// UNIFIED: Works for both users and admins
export const unifiedProtect = asyncHandler(async (req, res, next) => {
  let token;
  let decoded;
  let isAdminToken = false;

  // Try admin token first (admin_jwt cookie or Bearer token)
  token = getToken(req, "admin_jwt");
  
  // If no admin token, try user token
  if (!token) {
    token = getToken(req, "jwt");
  } else {
    isAdminToken = true;
  }

  // If still no token, check Bearer header for either
  if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    // Try verifying as admin token first if we got it from admin_jwt cookie
    if (isAdminToken) {
      try {
        decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId).select("-password");
        if (admin) {
          req.admin = admin;
          return next();
        }
      } catch (adminErr) {
        // Admin token failed, try as user token
      }
    }

    // Try verifying as user token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id;
      const user = await User.findById(userId).select("-password");
      if (user) {
        req.user = user;
        return next();
      }
    } catch (userErr) {
      // Not a valid user token either
    }

    // If we get here, token is invalid for both
    res.status(401);
    throw new Error("Not authorized, invalid token");

  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token verification failed");
  }
});

// USER ONLY
export const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req, "jwt");
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no user token");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, user token failed");
  }
});

// ADMIN ONLY
export const adminProtect = asyncHandler(async (req, res, next) => {
  const token = getToken(req, "admin_jwt");

  if (!token) {
    res.status(401);
    throw new Error("Not authorized as admin, no admin token");
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin) {
      res.status(401);
      throw new Error("Admin not found");
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized as admin, token failed or expired");
  }
});