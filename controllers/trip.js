const { Trip} = require("../models/Trip");
const { User} = require("../models/User");
const { handlePushNotification } = require('../notifications/index');
const { tripActor } = require('../states/tripStateMachine');
const {States} = require("../enums/states");

async function changeTripStateController(req, res) {
  const { action, tripId, devicePushToken } = req.body;

  try {
      const trip = await Trip.findOne({ where: { id: tripId } });
      if (!trip) {
          return res.status(404).json({ message: 'Trip not found' });
      }

      const currentState = trip.state;

      if(currentState == States.COMPLETED)
        return res.status(400).json( { message: "Trip is already completed."} );

      else if(currentState == States.CANCELED)
        return res.status(400).json( { message: "Trip is already canceled."} );

      else if(currentState == States.NO_DRIVER_FOUND)
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

      if( newState == States.CANCELED || newState == States.COMPLETED ){
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
