const Joi = require('joi');


// Trip state validation
const validateTripState = Joi.string().valid('created', 'no_driver_found', 'accepted', 'finished');

// Longitude validation
const validateLongitude = Joi.number().min(-180).max(180);

// Latitude validation
const validateLatitude = Joi.number().min(-90).max(90);

const validateCoordinates = Joi.object({
  pickupLocation: Joi.object({
    lat: validateLatitude.required(),
    lng: validateLongitude.required(),
  }).required(),
  dropoffLocation: Joi.object({
    lat: validateLatitude.required(),
    lng: validateLongitude.required(),
  }).required(),
});


module.exports = {
  validateTripState,
  validateCoordinates
};