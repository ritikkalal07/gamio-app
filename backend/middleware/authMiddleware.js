import jwt from "jsonwebtoken";

// Protect route (any logged in user)
export const protect = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    // payload now contains { id, email, user_type }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Optional admin-only guard
export const adminOnly = (req, res, next) => {
  if (req.user?.user_type !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

