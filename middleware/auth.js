const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied, No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};


const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: "Access denied, Insufficient permissions." });
  }
  next();
};

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });

      next(); 
    } catch (err) {
      if (err.details) {
        const errorMessages = err.details.map(e => e.message.replace(/"/g, ''));

        return res.status(400).json({ errors: errorMessages });
      }

      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };
};


module.exports = { authMiddleware, roleMiddleware, validateRequest };
