const Joi = require('joi');


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

const validatecancellationReason = Joi.string().min(10).max(100);


module.exports = {
  validateCoordinates,
  validatecancellationReason
};