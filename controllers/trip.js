const {User} = require("../models/User");
const {Trip} = require("../models/Trip");

const {getUserIdFromJWT} = require("../helper");
const {validateCoordinates} = require("../validators/trip");
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
    const token = req.headers.authorization?.split(' ')[1];
    const riderId = await getUserIdFromJWT(token);
    const rider =  await User.findOne({ where: { id:riderId } });

    // handle this case because jwt is stateless  
    if (!rider) return res.status(404).json({ message: "Rider not found." });


    const driver = await User.findOne({
      where: { role: "driver" , driverState:"online"},
      });

   
    if (rider.role !== "rider") {
      return res.status(403).json({ message: "Access denied, Insufficient permissions." });
    }

    const exsitingTrip = await Trip.findOne({
      where: { 
        riderId,
        state: { [Op.or]: ["created","accepted","started"] }
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


module.exports = {createTripController}