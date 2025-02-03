const jwt = require('jsonwebtoken');


const getUserIdFromJWT = async (token) => {
  try {
      if (!token) {
        throw new Error('Token is required');
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY); 
      const userId = decoded.id; 

      return userId; 
  } catch (error) {
      console.error('Error retrieving user Id from JWT:', error.message);
      return null; 
  }
};


module.exports = {getUserIdFromJWT};