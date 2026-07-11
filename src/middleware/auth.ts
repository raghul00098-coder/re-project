import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "cybershield_operations_secret_key_99887766";

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
  };
}

// --- MIDDLEWARE FOR SECURE API ROUTING ---
export function apiVerifyJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): any {
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

  if (!token) {
    return res.status(401).json({ error: "Access Denied: No session token provided. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Access Denied: Invalid or expired session token." });
  }
}

// --- MIDDLEWARE FOR SECURE PAGE ROUTING (HTML REDIRECTS) ---
export function pageVerifyJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): any {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/index.html?error=session_expired");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/index.html?error=session_invalid");
  }
}

