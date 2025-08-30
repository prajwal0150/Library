import jwt from "jsonwebtoken";


export function authToken(req, res, next) {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided or invalid format." });
  }

  const token = authHeader.split(" ")[1];

 
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || typeof decoded !== "object") {
      throw new Error("Invalid token payload");
    }
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("AuthToken Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
}


export function checkRole(allowedRoles) {
  return (req, res, next) => {
  
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
      return res.status(500).json({ message: "Invalid role configuration." });
    }


    if (!req.user || typeof req.user !== "object") {
      return res.status(401).json({ message: "Unauthorized. No user data." });
    }


    const userRole = req.user.role;
    if (typeof userRole !== "string" || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden. Required role: ${allowedRoles.join(" or ")}.`,
      });
    }

    next();
  };
}