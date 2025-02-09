const Joi = require('joi');
const {DriverStates} = require("../enums/driverStates")


const validateDriverState = Joi.string().valid(DriverStates.ONLINE,
   DriverStates.OFFLINE, DriverStates.BUSY);


const changeDriverStateScema = Joi.object({
  state: validateDriverState,
});


module.exports = {
  changeDriverStateScema
};