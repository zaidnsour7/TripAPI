const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const{changeDriverStateController, driverDashboardController} = require("../controllers/driver")

const router = express.Router();

router.post("/change-driver-state", authMiddleware, roleMiddleware("driver"), changeDriverStateController );


router.get("/driver-dashboard", authMiddleware, roleMiddleware("driver"), driverDashboardController);

module.exports = router;