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