const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

function generateToken(user) {
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  return token;
}

const signup = async (req, res) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let address = req.body.address;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (name.length < 8 || name.length > 60) {
      return res.status(400).json({ message: "Name must be 8-60 characters" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars with at least one uppercase and one special character",
      });
    }

    if (address && address.length > 400) {
      return res.status(400).json({ message: "Address too long" });
    }

    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      role: "user",
    });

    let token = generateToken(newUser);

    res
      .status(201)
      .json({ token: token, role: newUser.role, name: newUser.name });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let token = generateToken(user);

    res.json({
      token: token,
      role: user.role,
      name: user.name,
      id: user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars with at least one uppercase and one special character",
      });
    }

    let user = await User.findById(req.user.id);

    let isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is wrong" });
    }

    let newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, updatePassword };
