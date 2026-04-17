import jwt from "jsonwebtoken";

const adminGenerateToken = (res, adminId) => {
  const token = jwt.sign({ adminId }, process.env.ADMIN_JWT_SECRET, { expiresIn: "30d" });

  const isProd = process.env.NODE_ENV === "production";

  // Change cookie name to 'admin_jwt' to match adminProtect middleware
  res.cookie('admin_jwt', token, {  // Changed from 'adminJwt' to 'admin_jwt'
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return token;
};

export default adminGenerateToken;