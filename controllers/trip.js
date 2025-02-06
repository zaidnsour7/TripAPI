const { validateTripAction } = require('../validators/trip');
const { Trip, User } = require("../models/Trip");
const { handlePushNotification } = require('../notifications/index');
const { tripActor } = require('../states/tripStateMachine');

async function changeTripStateController(req, res) {
  const { action, tripId, devicePushToken } = req.body;

  if (!action) {
      return res.status(400).json({ message: "Action is required to change the state." });
  }

  if (!tripId) {
      return res.status(400).json({ message: "Missing Trip Id." });
  }

  const actionValidation = validateTripAction.validate(action);

  if (actionValidation.error)
      return res.status(400).json({ message: "Invalid Action." });

  try {
      const trip = await Trip.findOne({ where: { id: tripId } });
      if (!trip) {
          return res.status(404).json({ message: 'Trip not found' });
      }

      const currentState = trip.state;

      if(currentState == "completed")
        return res.status(400).json( { message: "Trip is already completed."} );

      else if(currentState == "canceled")
        return res.status(400).json( { message: "Trip is already canceled."} );

      else if(currentState == "no_driver_found")
        return res.status(400).json( { message: "there isn't available driver."} );

      tripActor.subscribe((state) => {
        console.log(state.value);
      });
      
      tripActor.start();

      tripActor.send({type:action}); 
      const newState = tripActor.getSnapshot().value;

      trip.state = newState;
      await trip.save();

      handlePushNotification(newState, devicePushToken);

      if(newState == "canceled" || newState == "completed"){
        const driverId = trip.driverId;
        const driver = await User.findOne( { where: { id: driverId} } );
        driver.driverState = "online";
        await driver.save()
      }

      res.status(200).json({ message: `Trip state updated to ${trip.state}` });
  } catch (err) {
      res.status(500).json({ message: "Server error While changing the state of Trip", error: err.message });
  }
};


module.exports = {
    changeTripStateController
};
