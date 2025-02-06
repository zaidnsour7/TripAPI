const Joi = require('joi');

// Trip state validation
const validateTripAction = Joi.string().valid('ACCEPT', 'NO_DRIVER', 'ARRIVE', 'CANCEL', 'START', 'COMPLETE');
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