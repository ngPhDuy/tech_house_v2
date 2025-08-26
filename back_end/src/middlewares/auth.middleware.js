import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    console.log(payload);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };
};

export default { authenticateToken, authorize };
