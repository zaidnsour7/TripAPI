const  DataTypes = require("sequelize");
const sequelize = require("../database");


const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("rider", "driver"),
    allowNull: false,
  },
  driverState: {
    type: DataTypes.ENUM("offline", "online", "busy"),
    allowNull: true,
  },
});


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
    type: DataTypes.ENUM("created", "no_driver_found", "accepted", "canceled", "started", "completed"),
    allowNull: false,
  }
});


(async () => {
  try {

    await sequelize.sync(); 
    console.log("models synced.");
  } 
  catch (error) {
    console.error("Error syncing the models:", error);
    process.exit(1);
  }
})();

module.exports = {User, Trip};