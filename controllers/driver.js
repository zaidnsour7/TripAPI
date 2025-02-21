const {User} = require("../models/User");
const {Trip} = require("../models/Trip");
const {States} = require("../enums/states");

async function changeDriverStateController (req, res){
  const { state } = req.body;

  try {
    const driverId = req.user.id;
    const driver =  await User.findOne({ where: { id:driverId } });
    if (!driver) return res.status(404).json({ message: "Driver not found." });

    driver.driverState = state;
    await driver.save();

    res.status(200).json({ message: "Driver state updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

async function acceptTripController(req, res){
  try{
    const driverId = req.user.id;
    const driver =  await User.findOne({ where: { id:driverId } });
    if (!driver) return res.status(404).json({ message: "Driver not found." });

    const trip = await Trip.findOne({
      where: {driverId,state: States.CREATED}
    });

    if(!trip)
      return res.status(400).json({ message: "Driver not already part of an created Trip." });

    const riderId = trip.riderId;
    const rider =  await User.findOne({ where: { id:riderId} });

    const devicePushToken = rider.devicePushToken
      if (! devicePushToken) return res.status(404).json({ message: "device Push Token not found." });

    const tripState = States.ACCEPTED;  
    trip.state = tripState;
    await trip.save();
    handlePushNotification(tripState, devicePushToken)
    
    res.status(200).json({ message: "Driver accept Trip successfully." });  
  }
  catch (err) {
    res.status(500).json({ message: "Server error while Driver try to accept the Trip", error: err.message });
  }
}


function driverDashboardController (req, res) {
  res.json({ message: "Welcome to the driver dashboard." });
}


module.exports = {
  changeDriverStateController, 
  acceptTripController,
  driverDashboardController,
  };