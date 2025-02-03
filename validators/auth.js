const Joi = require('joi');


const validateName = Joi.string().min(2).max(30);

const validatePhone = Joi.string().min(9).max(14).pattern(/^[0-9]+$/);

const validatePassword = (value) => {
  // Check if password is empty
  if (!value) {
    return { isValid: false, message: 'Please enter your password' };
  }

  // Check for minimum length (8 characters)
  if (value.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  // Check if password contains at least one uppercase letter
  if (!/[A-Z]/.test(value)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  // Check if password contains at least one number
  if (!/[0-9]/.test(value)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  // Check if password contains at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>_]/.test(value)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }

  // If all validations pass
  return { isValid: true, message: ' ' };
};


const validateRole = Joi.string().valid('rider', 'driver');



module.exports = {
  validateName,
  validatePhone,
  validatePassword,
  validateRole
};