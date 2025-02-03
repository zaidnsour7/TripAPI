const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig);

async () => {
  try {
    await sequelize.authenticate();
    console.log("SQLite database connected.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = sequelize;