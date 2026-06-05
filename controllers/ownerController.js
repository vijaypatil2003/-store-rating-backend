const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User");

const getDashboard = async (req, res) => {
  try {
    let ownerId = req.user.id;
    let store = await Store.findOne({ owner: ownerId });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    let ratings = await Rating.find({ store: store._id }).populate(
      "user",
      "name email",
    );

    let avgRating = null;
    if (ratings.length > 0) {
      let total = 0;
      for (let i = 0; i < ratings.length; i++) {
        total = total + ratings[i].value;
      }
      avgRating = (total / ratings.length).toFixed(1);
    }

    res.json({
      store: store,
      avgRating: avgRating,
      totalRatings: ratings.length,
      ratings: ratings,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboard };
