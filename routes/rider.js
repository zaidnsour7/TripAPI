const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const {cancelTripController} = require("../controllers/rider")

const router = express.Router();

router.post("/cancel-trip", authMiddleware, roleMiddleware("rider"), cancelTripController );


module.exports = router;