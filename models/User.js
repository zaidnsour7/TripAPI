const  DataTypes = require("sequelize");
const sequelize = require("../database");
const {Roles} = require("../enums/roles");
const {DriverStates} = require("../enums/driverStates");


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
    type: DataTypes.ENUM(Roles.RIDER, Roles.DRIVER),
    allowNull: false,
  },
  driverState: {
    type: DataTypes.ENUM(DriverStates.OFFLINE, DriverStates.ONLINE, DriverStates.BUSY),
    allowNull: true,
  },
  devicePushToken: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
});


(async () => {
  try {

    await sequelize.sync(); 
    console.log("User model synced.");
  } 
  catch (error) {
    console.error("Error syncing the User model:", error);
    process.exit(1);
  }
})();



module.exports = {User};