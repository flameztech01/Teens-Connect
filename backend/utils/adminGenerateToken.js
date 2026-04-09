import jwt from "jsonwebtoken";

const adminGenerateToken = (res, adminId) => {
  const token = jwt.sign({ adminId }, process.env.ADMIN_JWT_SECRET, { expiresIn: "30d" });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie('adminJwt', token, {
    httpOnly: true,
    secure: isProd,  // true in production, false in development
    sameSite: isProd ? 'none' : 'lax',  // 'none' for cross-origin, 'lax' for same-origin
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return token;
};

export default adminGenerateToken;