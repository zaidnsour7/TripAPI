const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const{changeDriverStateController,driverDashboardController,} = require("../controllers/driver")
const { validateRequest } = require("../middleware/auth");
const { changeDriverStateScema } = require("../validators/driver");

const router = express.Router();

router.post("/change-driver-state", authMiddleware, roleMiddleware("driver"),
            validateRequest(changeDriverStateScema), changeDriverStateController );


router.get("/driver-dashboard", authMiddleware, roleMiddleware("driver"), driverDashboardController);

module.exports = router;