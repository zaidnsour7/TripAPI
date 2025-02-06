const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const {changeTripStateController} = require("../controllers/trip")


const router = express.Router();


router.post("/change-trip-state", authMiddleware, roleMiddleware("driver"), changeTripStateController);


module.exports = router;
