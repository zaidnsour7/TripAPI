const Joi = require('joi');


const validateDriverState = Joi.string().valid("online", "offline", "busy");


module.exports = {
  validateDriverState
};