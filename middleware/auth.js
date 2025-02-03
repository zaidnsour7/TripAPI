const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied, No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; 
    // called to pass control to the next middleware or route handler 
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

//authorization based on rules
const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: "Access denied, Insufficient permissions." });
  }
  next();
};

// enable other files to import these objects
module.exports = { authMiddleware, roleMiddleware };
