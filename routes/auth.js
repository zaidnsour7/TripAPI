const express = require("express");
const {registerController, loginController} = require('../controllers/auth')
const { validateRequest } = require("../middleware/auth");
const {userRegisterSchema,userLoginSchema} = require("../validators/auth");

const router = express.Router();

router.post("/register", validateRequest(userRegisterSchema), registerController);

router.post("/login",validateRequest(userLoginSchema), loginController);

module.exports = router;





