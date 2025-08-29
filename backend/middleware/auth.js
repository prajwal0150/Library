import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export function authToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and has correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided or invalid format." });
  }

  const token = authHeader.split(" ")[1];

  // Ensure JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || typeof decoded !== "object") {
      throw new Error("Invalid token payload");
    }
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (error) {
    console.error("AuthToken Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
}

// Middleware to check user role(s)
export function checkRole(allowedRoles) {
  return (req, res, next) => {
    // Validate allowedRoles parameter
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
      return res.status(500).json({ message: "Invalid role configuration." });
    }

    // Check if user data exists
    if (!req.user || typeof req.user !== "object") {
      return res.status(401).json({ message: "Unauthorized. No user data." });
    }

    // Validate and check user role
    const userRole = req.user.role;
    if (typeof userRole !== "string" || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden. Required role: ${allowedRoles.join(" or ")}.`,
      });
    }

    next();
  };
}