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

/*
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      await schema.validateAsync(req.body, { abortEarly: false }); // Ensure all errors are captured
      next();
    } catch (err) {
      // Extract error messages, remove quotes around field names
      const errorMessages = err.details.map(e => 
        e.message.replace(/\"(\w+)\"/, '$1') // Removes quotes around field names
      );

      // Send the errors as an array
      return res.status(400).json({ errors: errorMessages });
    }
  };
};
*/


const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      await schema.validateAsync(req.body, { abortEarly: false });

      next(); // Proceed if validation passes
    } catch (err) {
      if (err.details) {
        // Extract error messages and remove all quotes
        const errorMessages = err.details.map(e => e.message.replace(/"/g, ''));

        // Send the errors as an array
        return res.status(400).json({ errors: errorMessages });
      }

      // Handle unexpected errors
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };
};




module.exports = { authMiddleware, roleMiddleware, validateRequest };
