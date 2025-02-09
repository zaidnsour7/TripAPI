const Joi = require('joi');
const {Actions} = require("../enums/actions")

// Trip state validation
const validateTripAction = Joi.string().valid(Actions.ACCEPT, Actions.NO_DRIVER,
  Actions.ARRIVE, Actions.CANCEL, Actions.START, Actions.COMPLETE);
const validateTripId = Joi.number().required();
const validateDevicePushToken = Joi.string().required()

const changeTripStateSchema = Joi.object({
  action: validateTripAction.required(),
  tripId: validateTripId,
  devicePushToken: validateDevicePushToken
});


module.exports = {
  changeTripStateSchema
}