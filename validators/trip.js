const Joi = require('joi');

// Trip state validation
const validateTripAction = Joi.string().valid('ACCEPT', 'NO_DRIVER', 'ARRIVE', 'CANCEL', 'START', 'COMPLETE');



module.exports = {
  validateTripAction
}