const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/auth");
const {cancelTripController, createTripController} = require("../controllers/rider")
const { validateRequest } = require("../middleware/auth");
const {createTripSchema, cancelTripSchema} = require("../validators/rider");

const router = express.Router();

router.post("/create-trip", authMiddleware, roleMiddleware("rider"),
validateRequest(createTripSchema), createTripController);

router.post("/cancel-trip", authMiddleware, roleMiddleware("rider"),
validateRequest(cancelTripSchema), cancelTripController );


module.exports = router;