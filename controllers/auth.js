const bcrypt = require("bcryptjs");
const {User} = require("../models/User");
const jwt = require("jsonwebtoken");


async function registerController(req, res){
  const { name, phone, password, role , devicePushToken} = req.body;

  try {
    const userExists = await User.findOne({ where: { phone } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, phone, password: hashedPassword, role, devicePushToken });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


async function loginController (req, res){
  const { phone, password } = req.body;
  try {
    const user = await User.findOne( { where: { phone } } );
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid number or, password" });

    const token = jwt.sign({ id: user.id, role: user.role },
       process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}



module.exports = {registerController, loginController};