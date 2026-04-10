import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

const getToken = (req, cookieName) => {
  // Check Authorization header first
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  
  // Then check cookies
  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }
  
  return null;
};

// UNIFIED: Works for both users and admins
export const unifiedProtect = asyncHandler(async (req, res, next) => {
  let token;
  let decoded;

  // Get token from header or cookies (admin_jwt takes priority)
  token = getToken(req, "admin_jwt") || getToken(req, "jwt");

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    // Try admin token first
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
      const admin = await Admin.findById(decoded.adminId).select("-password");
      if (admin) {
        req.admin = admin;
        return next();
      }
    } catch (adminErr) {
      // Not an admin token, continue to try user token
    }

    // Try user token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id;
      const user = await User.findById(userId).select("-password");
      if (user) {
        req.user = user;
        return next();
      }
    } catch (userErr) {
      // Not a user token either
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
  const authHeader = req.headers?.authorization;
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const cookieToken = req.cookies?.jwt || null;

  const tokensToTry = [headerToken, cookieToken].filter(Boolean);

  console.log("AUTH HEADER:", authHeader);
  console.log("COOKIES:", req.cookies);

  if (!tokensToTry.length) {
    res.status(401);
    throw new Error("Not authorized, no user token");
  }

  for (const token of tokensToTry) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id;
      const user = await User.findById(userId).select("-password");

      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      console.log("TOKEN FAILED:", err.message);
    }
  }

  res.status(401);
  throw new Error("Not authorized, user token failed");
});

// ADMIN ONLY
export const adminProtect = asyncHandler(async (req, res, next) => {
  let token = null;

  // Check Authorization header first
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.admin_jwt) {
    token = req.cookies.admin_jwt;
  }

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