const {getUserIdFromJWT} = require("../helper");
const {User} = require("../models/User");
const {Trip} = require("../models/Trip");
const { validatecancellationReason} = require('../validators/rider');
const {notifyDriverWithTripCancellation} = require("../notifications/driver");
const { Op } = require("sequelize");


async function cancelTripController (req, res){
  const { cancellationReason} = req.body;

  if ( !cancellationReason ) {
    return res.status(400).json({ message: "Missing cancellation Reason." });
  }

  const cancellationReasonValidation = validatecancellationReason.validate(cancellationReason);

  if(cancellationReasonValidation.error)
    return res.status(400).json({ message: "Invalid cancellation Reason." });

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const riderId = await getUserIdFromJWT(token);
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

    trip.state = "canceled";
    trip.cancellationReason = cancellationReason;
    await trip.save();

    notifyDriverWithTripCancellation(devicePushToken);
    driver.driverState = "online";
    await driver.save();
  
    res.status(200).json({ message: "Rider Cancelled Trip successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while Cancellation the Trip", error: err.message });
  }
};


module.exports = {cancelTripController};