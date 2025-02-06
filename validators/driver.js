const Joi = require('joi');


const validateDriverState = Joi.string().valid("online", "offline", "busy");


const changeDriverStateScema = Joi.object({
  state: validateDriverState,
});


module.exports = {
  changeDriverStateScema
};