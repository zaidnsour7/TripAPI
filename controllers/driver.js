const { validateDriverState} = require('../validators/driver');
const {User} = require("../models/User");


async function changeDriverStateController (req, res){
  const { state } = req.body;

  if ( !state ) {
    return res.status(400).json({ message: "Missing driver state." });
  }

  const stateValidation = validateDriverState.validate(state);

  if(stateValidation.error)
    return res.status(400).json({ message: "Invalid driver State." });

  try {
    const driverId = req.user.id;
    const driver =  await User.findOne({ where: { id:driverId } });
    if (!driver) return res.status(404).json({ message: "Driver not found." });

    if (driver.role !== "driver") {
      return res.status(403).json({ message: "Access denied, Insufficient permissions." });
    }

    driver.driverState = state;
    await driver.save();

    res.status(200).json({ message: "Driver state updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


function driverDashboardController (req, res) {
  res.json({ message: "Welcome to the driver dashboard." });
}


module.exports = {changeDriverStateController, driverDashboardController};