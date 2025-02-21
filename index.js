require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/driver");
const riderRoutes = require("./routes/rider");
const tripRoutes = require("./routes/trip");

app.use("/auth", authRoutes);
app.use("/driver", driverRoutes);
app.use("/rider", riderRoutes);
app.use("/trip", tripRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
