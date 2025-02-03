const bcrypt = require("bcryptjs");
const User = require("../models/models").User;
const { validateName, validatePhone, validatePassword, validateRole } = require('../validators/auth');
const jwt = require("jsonwebtoken");


async function registerController(req, res){
  const { name, phone, password, role } = req.body;
  if (!name || !phone || !password || !role)
    return res.status(400).json({ message: "Missing required fields: name, phone, password, or role" });

  const phoneValidation = validatePhone.validate(phone);
  const passwordValidation = validatePassword(password);
  const roleValidation = validateRole.validate(role);
  const nameValidation = validateName.validate(name);

  if( roleValidation.error )
    return res.status(400).json({ message: "Invalid role" });

  if(phoneValidation.error)
    return res.status(400).json({ message: "Invalid phone number" });

  if(nameValidation.error)
    return res.status(400).json({ message: "Invalid name" });


  if(! passwordValidation.isValid)
    return res.status(400).json({ message: passwordValidation.message });

  try {
    const userExists = await User.findOne({ where: { phone } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, phone, password: hashedPassword, role });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


async function loginController (req, res){
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Missing required fields: phone, or password" });
  }

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