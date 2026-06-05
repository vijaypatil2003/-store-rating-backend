const Store = require("../models/Store");
const Rating = require("../models/Rating");

const getStores = async (req, res) => {
  try {
    let name = req.query.name;
    let address = req.query.address;
    let sortBy = req.query.sortBy;
    let order = req.query.order;

    if (!sortBy) sortBy = "name";
    if (!order) order = "asc";

    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (address) filter.address = { $regex: address, $options: "i" };

    let sortOrder = 1;
    if (order === "desc") {
      sortOrder = -1;
    }

    let stores = await Store.find(filter).sort({ [sortBy]: sortOrder });

    let finalStores = [];

    for (let i = 0; i < stores.length; i++) {
      let store = stores[i];

      let ratings = await Rating.find({ store: store._id });

      let avgRating = null;
      if (ratings.length > 0) {
        let total = 0;
        for (let j = 0; j < ratings.length; j++) {
          total = total + ratings[j].value;
        }
        avgRating = (total / ratings.length).toFixed(1);
      }

      let myRating = await Rating.findOne({
        store: store._id,
        user: req.user.id,
      });

      let storeObj = store.toObject();
      storeObj.avgRating = avgRating;
      storeObj.totalRatings = ratings.length;
      storeObj.myRating = myRating ? myRating.value : null;
      storeObj.myRatingId = myRating ? myRating._id : null;

      finalStores.push(storeObj);
    }

    res.json(finalStores);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const submitRating = async (req, res) => {
  try {
    let storeId = req.body.storeId;
    let value = req.body.value;

    if (!value || value < 1 || value > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    let existingRating = await Rating.findOne({
      user: req.user.id,
      store: storeId,
    });

    if (existingRating) {
      existingRating.value = value;
      await existingRating.save();
      return res.json({ message: "Rating updated" });
    }

    await Rating.create({ user: req.user.id, store: storeId, value: value });
    res.status(201).json({ message: "Rating submitted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStores, submitRating };
