const Joi = require('joi');


const validateName = Joi.string().min(2).max(30).required();
const validatePhone = Joi.string().min(9).max(14).pattern(/^[0-9]+$/).required();
const validateRole = Joi.string().valid("rider", "driver").required();

// Custom password validation function
const validatePassword = (value, helpers) => {
  const errors = [];

  if (!value) {
    errors.push("Please enter your password");
  } else {
    if (value.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(value)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>_]/.test(value)) {
      errors.push("Password must contain at least one special character");
    }
  }

  if (errors.length > 0) {
    return helpers.message(errors.join(", "));
  }

  return value; 
};

const userRegisterSchema = Joi.object({
  name: validateName,
  phone: validatePhone,
  role: validateRole,
  password: Joi.string().custom(validatePassword).required(),
});

const userLoginSchema = Joi.object({
  phone: validatePhone,
  password: Joi.string().custom(validatePassword).required()
});


module.exports = {
  userRegisterSchema,
  userLoginSchema

};