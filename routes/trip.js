const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const {changeTripStateController} = require("../controllers/trip")
const { validateRequest } = require("../middleware/auth");
const {changeTripStateSchema} = require("../validators/trip");


const router = express.Router();


router.post("/change-trip-state", authMiddleware, roleMiddleware("driver"),
validateRequest(changeTripStateSchema),  changeTripStateController);


module.exports = router;
