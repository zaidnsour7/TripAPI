const express = require("express");
const { authMiddleware, roleMiddleware} = require("../middleware/auth");
const {createTripController} = require("../controllers/trip")

const router = express.Router();


router.post("/create-trip", authMiddleware, roleMiddleware("rider"), createTripController);



module.exports = router;