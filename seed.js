require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: hash,
    role: "admin",
    address: process.env.ADMIN_ADDRESS,
  });

  console.log(
    `Done! email: ${process.env.ADMIN_EMAIL} | password: ${process.env.ADMIN_PASSWORD}`,
  );

  process.exit();
});
