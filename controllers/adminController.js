const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const bcrypt = require("bcryptjs");

function checkEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function checkPassword(pass) {
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  return re.test(pass);
}

const getDashboard = async (req, res) => {
  try {
    let userCount = await User.countDocuments({
      role: { $in: ["user", "owner"] },
    });
    let storeCount = await Store.countDocuments();
    let ratingCount = await Rating.countDocuments();

    res.json({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addUser = async (req, res) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let address = req.body.address;
    let role = req.body.role;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (name.length < 8 || name.length > 60) {
      return res.status(400).json({ message: "Name must be 8-60 characters" });
    }

    if (!checkEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!checkPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars with uppercase and special character",
      });
    }

    if (address && address.length > 400) {
      return res.status(400).json({ message: "Address too long" });
    }

    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      role: role,
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    let name = req.query.name;
    let email = req.query.email;
    let address = req.query.address;
    let role = req.query.role;
    let sortBy = req.query.sortBy;
    let order = req.query.order;

    if (!sortBy) sortBy = "name";
    if (!order) order = "asc";

    let filter = {};
    filter.role = { $in: ["user", "admin", "owner"] };

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }
    if (address) {
      filter.address = { $regex: address, $options: "i" };
    }
    if (role) {
      filter.role = role;
    }

    let sortOrder = 1;
    if (order === "desc") {
      sortOrder = -1;
    }

    let users = await User.find(filter)
      .select("-password")
      .sort({ [sortBy]: sortOrder });

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    let userId = req.params.id;
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let rating = null;
    if (user.role === "owner") {
      let store = await Store.findOne({ owner: user._id });
      if (store) {
        let allRatings = await Rating.find({ store: store._id });
        if (allRatings.length > 0) {
          let total = 0;
          for (let i = 0; i < allRatings.length; i++) {
            total = total + allRatings[i].value;
          }
          let avg = total / allRatings.length;
          rating = avg.toFixed(1);
        }
      }
    }

    let userData = user.toObject();
    userData.storeRating = rating;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addStore = async (req, res) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let ownerId = req.body.ownerId;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email required" });
    }

    if (name.length < 8 || name.length > 60) {
      return res
        .status(400)
        .json({ message: "Store name must be 8-60 characters" });
    }

    if (!checkEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    let existingStore = await Store.findOne({ email: email });
    if (existingStore) {
      return res.status(400).json({ message: "Store email already exists" });
    }

    let newStore = await Store.create({
      name: name,
      email: email,
      address: address,
      owner: ownerId ? ownerId : null,
    });

    res.status(201).json({ message: "Store created", store: newStore });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getStores = async (req, res) => {
  try {
    let name = req.query.name;
    let email = req.query.email;
    let address = req.query.address;
    let sortBy = req.query.sortBy;
    let order = req.query.order;

    if (!sortBy) sortBy = "name";
    if (!order) order = "asc";

    let filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (address) filter.address = { $regex: address, $options: "i" };

    let sortOrder = order === "desc" ? -1 : 1;

    let stores = await Store.find(filter)
      .populate("owner", "name email")
      .sort({ [sortBy]: sortOrder });

    let finalStores = [];
    for (let i = 0; i < stores.length; i++) {
      let store = stores[i];
      let ratings = await Rating.find({ store: store._id });

      let avgRating = null;
      if (ratings.length > 0) {
        let sum = 0;
        for (let j = 0; j < ratings.length; j++) {
          sum = sum + ratings[j].value;
        }
        avgRating = (sum / ratings.length).toFixed(1);
      }

      let storeObj = store.toObject();
      storeObj.avgRating = avgRating;
      storeObj.totalRatings = ratings.length;

      finalStores.push(storeObj);
    }

    res.json(finalStores);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboard,
  addUser,
  getUsers,
  getUserById,
  addStore,
  getStores,
};
