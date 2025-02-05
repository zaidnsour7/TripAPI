const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const {cancelTripController, createTripController} = require("../controllers/rider")

const router = express.Router();


router.post("/create-trip", authMiddleware, roleMiddleware("rider"), createTripController);

router.post("/cancel-trip", authMiddleware, roleMiddleware("rider"), cancelTripController );


module.exports = router;