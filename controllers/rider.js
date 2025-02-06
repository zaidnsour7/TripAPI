const {User} = require("../models/User");
const {Trip} = require("../models/Trip");
const { validatecancellationReason, validateCoordinates} = require('../validators/rider');
const {handlePushNotification} = require("../notifications/index");
const { Op } = require("sequelize");


async function createTripController (req, res) {
  const { pickupLocation, dropoffLocation } = req.body;

  if ( ! pickupLocation|| ! dropoffLocation) {
    return res.status(400).json({ message: "Pickup location or drop-off location is missing."});
  }


  const coordinatesValidation = validateCoordinates.validate({ pickupLocation, dropoffLocation });
  if (coordinatesValidation.error) 
    return res.status(400).json({ message: "Invalid coordinates provided." });
   
  try {
    const riderId = req.user.id;
    const rider =  await User.findOne({ where: { id:riderId } });

    if (!rider) return res.status(404).json({ message: "Rider not found." });

    const driver = await User.findOne({
      where: { role: "driver" , driverState:"online"},
      });

    const exsitingTrip = await Trip.findOne({
      where: { 
        riderId,
        state: { [Op.or]: ["created","accepted","arrived","started"] }
      }
    });

    if( exsitingTrip ){
      return res.status(400).json({ message: "Rider already part of an active trip." });
      }
      
    let state = "no_driver_found";

    if (driver){
      const driverId = driver.id;
      state = "created";
      driver.driverState = "busy";

      await driver.save();
      await Trip.create({driverId, riderId, pickupLocation, dropoffLocation, state});
      }

    else{
      await Trip.create({riderId, pickupLocation, dropoffLocation, state});
      }

    res.status(201).json({ message: "Trip created Succesfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}



async function cancelTripController (req, res){
  const { cancellationReason} = req.body;

  if ( !cancellationReason ) {
    return res.status(400).json({ message: "Missing cancellation Reason." });
  }

  const cancellationReasonValidation = validatecancellationReason.validate(cancellationReason);

  if(cancellationReasonValidation.error)
    return res.status(400).json({ message: "Invalid cancellation Reason." });

  try {
    const riderId = req.user.id;
    const rider =  await User.findOne({ where: { id:riderId} });
    if (! rider) return res.status(404).json({ message: "Rider not found." });

    const trip = await Trip.findOne({
          where: { 
            riderId,
            state: { [Op.or]: ["created","accepted","started"] }
          }
        });
    
    if( ! trip ){
      return res.status(400).json({ message: "Rider not already part of an active trip." });
      } 
      
    const driverId = trip.driverId;
    const driver =  await User.findOne({ where: { id:driverId} });
    if (! driver) return res.status(404).json({ message: "Driver not found." });

    const devicePushToken = driver.devicePushToken
    if (! devicePushToken) return res.status(404).json({ message: "device Push Token not found." });

    const tripState = "canceled"
    trip.state = tripState;
    trip.cancellationReason = cancellationReason;
    await trip.save();

    handlePushNotification(tripState, devicePushToken)
    driver.driverState = "online";
    await driver.save();
  
    res.status(200).json({ message: "Rider Cancelled Trip successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while Cancellation the Trip", error: err.message });
  }
};


module.exports = {createTripController, cancelTripController};