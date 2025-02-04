const Joi = require('joi');


const validatecancellationReason = Joi.string().min(10).max(50);


module.exports = {
  validatecancellationReason
};