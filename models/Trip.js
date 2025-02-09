const  DataTypes = require("sequelize");
const sequelize = require("../database");
const {States} = require("../enums/states");

const Trip = sequelize.define("Trip", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  riderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true, // can be null if no driver was found
  },
  pickupLocation: {
    type: DataTypes.JSON, // store as { lat: xx.xxx, lng: yy.yyy }
    allowNull: false,
  },
  dropoffLocation: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  state: {
    type: DataTypes.ENUM(States.CREATED, States.NO_DRIVER_FOUND, States.ACCEPTED, States.CANCELED,
      States.ARRIVED, States.STARTED, States.COMPLETED),
    allowNull: false,
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});


(async () => {
  try {

    await sequelize.sync(); 
    console.log("Trip model synced.");
  } 
  catch (error) {
    console.error("Error syncing the Trip model:", error);
    process.exit(1);
  }
})();



module.exports = {Trip};